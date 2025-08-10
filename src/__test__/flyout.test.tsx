import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Flyout from '@/components/Flyout';
import '@testing-library/jest-dom';
import { act } from 'react';

const mockUseRootSelector = vi.fn();
const mockUseGenerateCSVDownloadQuery = vi.fn();

vi.mock('@/store/store', () => ({
  useRootSelector: (...args: unknown[]) => mockUseRootSelector(...args),
}));

vi.mock('@/api/api', () => ({
  useGenerateCSVDownloadQuery: (...args: unknown[]) => mockUseGenerateCSVDownloadQuery(...args),
}));

const mockPokemons = [
  { id: 1, name: 'Bulbasaur', image: '...' },
  { id: 4, name: 'Charmander', image: '...' },
];

const mockOnUnselectAll = vi.fn();

const renderFlyout = (selectedCount: number) => {
  mockUseRootSelector.mockReturnValue(selectedCount > 0 ? mockPokemons : []);
  mockUseGenerateCSVDownloadQuery.mockReturnValue({
    data: selectedCount > 0 ? 'mock-download-url' : undefined,
    isLoading: false,
  });
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
      expect(mockUseGenerateCSVDownloadQuery).toHaveBeenCalled();
    });
    const downloadLink = screen.getByRole('link', { name: /download/i });
    expect(downloadLink).toHaveAttribute('href', 'mock-download-url');
    expect(downloadLink).toHaveAttribute('download', '2_items.csv');
  });

  it('should not prepare a CSV file if no pokemons are selected', () => {
    renderFlyout(0);
    expect(URL.createObjectURL).not.toHaveBeenCalled();
  });

  it('should revoke the object URL upon component unmount', async () => {
    const { unmount } = renderFlyout(1);
    await waitFor(() =>
      expect(screen.getByRole('link', { name: /download/i })).toHaveAttribute('href', 'mock-download-url')
    );
    unmount();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('mock-download-url');
  });
});
