import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useSelector } from 'react-redux';
import Flyout from '@/components/Flyout';
import { downloadCSV } from '@/utils/CsvDownloader';
import '@testing-library/jest-dom';
import { act } from 'react';

vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
}));

vi.mock('@/utils/CsvDownloader', () => ({
  downloadCSV: vi.fn(),
}));

const mockPokemons = [
  { id: 1, name: 'Bulbasaur', image: '...' },
  { id: 4, name: 'Charmander', image: '...' },
];

const mockOnUnselectAll = vi.fn();

const renderFlyout = (selectedCount: number) => {
  vi.mocked(useSelector).mockReturnValue(selectedCount > 0 ? mockPokemons : []);
  return render(<Flyout selectedCount={selectedCount} onUnselectAll={mockOnUnselectAll} />);
};

describe('Flyout Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    if (!window.URL.createObjectURL) {
      window.URL.createObjectURL = vi.fn(() => 'mock-download-url');
    } else {
      vi.spyOn(window.URL, 'createObjectURL').mockReturnValue('mock-download-url');
    }

    if (!window.URL.revokeObjectURL) {
      window.URL.revokeObjectURL = vi.fn();
    } else {
      vi.spyOn(window.URL, 'revokeObjectURL').mockImplementation(() => {});
    }

    vi.spyOn(Blob.prototype, 'size', 'get').mockReturnValue(1234);

    vi.mocked(downloadCSV).mockResolvedValue('id,name\n1,Bulbasaur\n4,Charmander');
  });

  it('should display the correct number of selected items', async () => {
    await act(async () => {
      renderFlyout(2);
    });

    expect(screen.getByText('2 items selected')).toBeInTheDocument();
  });

  it('should display "item" in singular form when one item is selected', async () => {
    await act(async () => {
      renderFlyout(1);
    });
    expect(screen.getByText('1 item selected')).toBeInTheDocument();
  });

  it('should call `onUnselectAll` when the "Unselect all" button is clicked', async () => {
    await act(async () => {
      renderFlyout(2);
    });
    const unselectAllButton = screen.getByRole('button', {
      name: /unselect all/i,
    });
    fireEvent.click(unselectAllButton);
    expect(mockOnUnselectAll).toHaveBeenCalledTimes(1);
  });

  it('should prepare a CSV file for download when pokemons are selected', async () => {
    renderFlyout(2);
    await waitFor(() => {
      expect(downloadCSV).toHaveBeenCalledWith(mockPokemons);
      expect(URL.createObjectURL).toHaveBeenCalled();
    });
    const downloadLink = screen.getByRole('link', { name: /download/i });
    expect(downloadLink).toHaveAttribute('href', 'mock-download-url');
    expect(downloadLink).toHaveAttribute('download', '2_items.csv');
  });

  it('should not prepare a CSV file if no pokemons are selected', () => {
    renderFlyout(0);
    expect(downloadCSV).not.toHaveBeenCalled();
    expect(URL.createObjectURL).not.toHaveBeenCalled();
  });

  it('should revoke the object URL upon component unmount', async () => {
    const { unmount } = renderFlyout(1);
    await waitFor(() => {
      expect(URL.createObjectURL).toHaveBeenCalled();
    });
    unmount();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('mock-download-url');
  });
});
