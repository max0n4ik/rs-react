import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../shared/Button';
import { describe, expect, test, vi } from 'vitest';

describe('Button - basic rendering tests', () => {
  test('renders the button with the passed text', () => {
    render(<Button onClick={() => {}}>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  test('renders the button with child elements', () => {
    render(
      <Button onClick={() => {}}>
        <span>Submit</span>
      </Button>
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  test('button has the correct styling classes', () => {
    render(<Button onClick={() => {}}>Test Button</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('py-2');
    expect(button).toHaveClass('px-4');
    expect(button).toHaveClass('bg-blue-600');
    expect(button).toHaveClass('rounded-lg');
  });

  test('button is wrapped in a div with specific classes', () => {
    render(<Button onClick={() => {}}>Test Button</Button>);
    const wrapper = screen.getByRole('button').parentElement;

    expect(wrapper).toHaveClass('max-w-fit');
  });

  test('calls the onClick handler when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
