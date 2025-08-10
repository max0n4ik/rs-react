import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { describe, it, expect } from 'vitest';
import type { JSX } from 'react';

function ThrowError(): JSX.Element {
  throw new Error('Test error');
}

describe('ErrorBoundary', () => {
  it('render without error', () => {
    render(
      <ErrorBoundary>
        <div>Child component</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Child component')).toBeInTheDocument();
  });
  it('render with error', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/please refresh the page/i)).toBeInTheDocument();

    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
