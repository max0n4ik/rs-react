import { render, screen } from '@testing-library/react';
import ControlledForm from '../components/ControlledForm';
import { describe, expect, test } from 'vitest';

describe('ControlledForm', () => {
  test('renders form title', () => {
    render(<ControlledForm />);
    expect(screen.getByText('Controlled Form')).toBeInTheDocument();
  });

  test('renders name input field', () => {
    render(<ControlledForm />);
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
  });

  test('renders age input field', () => {
    render(<ControlledForm />);
    expect(screen.getByPlaceholderText('Enter your age')).toBeInTheDocument();
  });

  test('renders email input field', () => {
    render(<ControlledForm />);
    expect(screen.getByPlaceholderText('Enter your emаil')).toBeInTheDocument();
  });

  test('renders password input fields', () => {
    render(<ControlledForm />);
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm your password')).toBeInTheDocument();
  });

  test('renders gender radio buttons', () => {
    render(<ControlledForm />);
    expect(screen.getByLabelText('Male')).toBeInTheDocument();
    expect(screen.getByLabelText('Female')).toBeInTheDocument();
    expect(screen.getByLabelText('Other')).toBeInTheDocument();
  });

  test('renders terms checkbox', () => {
    render(<ControlledForm />);
    expect(screen.getByText('I accept the Terms and Conditions')).toBeInTheDocument();
  });

  test('renders submit button with correct text', () => {
    render(<ControlledForm />);
    const button = screen.getByRole('button', { name: /send form/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Send Form');
  });

  test('renders country select field', () => {
    render(<ControlledForm />);
    // Проверяем наличие элемента по части текста
    expect(screen.getByText(/country/i)).toBeInTheDocument();
  });

  test('renders image upload label', () => {
    render(<ControlledForm />);
    expect(screen.getByText('Profile Image (PNG or JPEG)')).toBeInTheDocument();
  });
});
