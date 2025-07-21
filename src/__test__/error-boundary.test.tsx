import { fireEvent, render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../error-boundary';
import { vi, describe, it, expect } from 'vitest';
import ErrorButton from '../error-button';

describe('ErrorBoundary', () => {
  it('render without error', () => {
    render(
      <ErrorBoundary>
        <div>Child component</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Child component')).toBeInTheDocument();
  });

  it('render fallback UI with error', async () => {
    const consoleSpy = vi.spyOn(console, 'error');

    render(
      <ErrorBoundary>
        <ErrorButton />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Get Error' }));
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
