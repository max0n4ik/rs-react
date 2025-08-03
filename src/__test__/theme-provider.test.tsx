import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '../theme-provider';
import { ThemeContext } from '../store/context-store';
import { useContext } from 'react';

const ThemeConsumer = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <div>
      <span data-testid="theme-status">{theme}</span>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('light', 'dark');
  });

  test('should provide a default "light" theme if nothing is in localStorage', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme-status')).toHaveTextContent('light');
    expect(document.documentElement).not.toHaveClass('dark');
  });

  test('should load the theme from localStorage on initial render', () => {
    localStorage.setItem('theme', 'dark');
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme-status')).toHaveTextContent('dark');
    expect(document.documentElement).toHaveClass('dark');
  });

  test('should toggle the theme from light to dark and update localStorage', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(toggleButton);

    expect(screen.getByTestId('theme-status')).toHaveTextContent('dark');
    expect(document.documentElement).toHaveClass('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  test('should toggle the theme from dark to light and update localStorage', () => {
    localStorage.setItem('theme', 'dark');
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(toggleButton);

    expect(screen.getByTestId('theme-status')).toHaveTextContent('light');
    expect(document.documentElement).not.toHaveClass('dark');
    expect(localStorage.getItem('theme')).toBe('light');
  });

  test('should not apply any theme class if the stored theme is invalid', () => {
    localStorage.setItem('theme', 'invalid-theme');
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-status')).toHaveTextContent('light');
    expect(document.documentElement).not.toHaveClass('dark');
  });
});
