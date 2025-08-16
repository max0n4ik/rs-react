import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { describe, it, expect } from 'vitest';
import NotFound from '@/app/not-found';
import type { JSX } from 'react';

const renderWithRouter = (component: JSX.Element) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('NotFound', () => {
  it('renders 404 heading', () => {
    renderWithRouter(<NotFound />);
    expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument();
  });

  it('renders something is missing text', () => {
    renderWithRouter(<NotFound />);
    expect(screen.getByText("Something's missing.")).toBeInTheDocument();
  });

  it('renders description text', () => {
    renderWithRouter(<NotFound />);
    expect(
      screen.getByText("Sorry, we can't find that page. You'll find lots to explore on the home page.")
    ).toBeInTheDocument();
  });

  it('renders Back to Homepage link', () => {
    renderWithRouter(<NotFound />);
    const backLink = screen.getByRole('link', { name: 'Back to Homepage' });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/');
  });
});
