import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { describe, it, expect } from 'vitest';
import About from '../about';
import type { JSX } from 'react';

const renderWithRouter = (component: JSX.Element) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('About', () => {
  it('renders About heading', () => {
    renderWithRouter(<About />);
    expect(screen.getByRole('heading', { name: 'About' })).toBeInTheDocument();
  });

  it('renders created by text', () => {
    renderWithRouter(<About />);
    expect(screen.getByText('Created by')).toBeInTheDocument();
  });

  it('renders Max0n4ik link', () => {
    renderWithRouter(<About />);
    const maxLink = screen.getByRole('link', { name: /max0n4ik/i });
    expect(maxLink).toBeInTheDocument();
    expect(maxLink).toHaveAttribute('href', 'https://github.com/max0n4ik');
    expect(maxLink).toHaveAttribute('target', '_blank');
  });

  it('renders for text', () => {
    renderWithRouter(<About />);
    expect(screen.getByText('for')).toBeInTheDocument();
  });

  it('renders RS School link', () => {
    renderWithRouter(<About />);
    const rsLink = screen.getByRole('link', { name: /rs school/i });
    expect(rsLink).toBeInTheDocument();
    expect(rsLink).toHaveAttribute('href', 'https://rs.school/');
    expect(rsLink).toHaveAttribute('target', '_blank');
  });

  it('renders Back to Homepage link', () => {
    renderWithRouter(<About />);
    const backLink = screen.getByRole('link', { name: 'Back to Homepage' });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/');
  });

  it('renders GitHub SVG icon', () => {
    renderWithRouter(<About />);
    const svgIcon = screen.getByRole('img');
    expect(svgIcon).toBeInTheDocument();
    expect(svgIcon).toHaveAttribute('viewBox', '0 0 24 24');
  });
});
