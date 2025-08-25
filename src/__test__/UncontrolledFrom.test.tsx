import { render, screen } from '@testing-library/react';
import UncontrolledForm from '../components/UncontrolledForm';
import { describe, expect, test } from 'vitest';

describe('UncontrolledForm', () => {
  test('renders the form title', () => {
    render(<UncontrolledForm />);
    expect(screen.getByText('Uncontrolled Form')).toBeInTheDocument();
  });

  test('renders all the main input fields', () => {
    render(<UncontrolledForm />);

    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your age')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your emаil')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm your password')).toBeInTheDocument();
  });

  test('renders gender selection radio buttons', () => {
    render(<UncontrolledForm />);

    expect(screen.getByLabelText('Male')).toBeInTheDocument();
    expect(screen.getByLabelText('Female')).toBeInTheDocument();
    expect(screen.getByLabelText('Other')).toBeInTheDocument();
  });

  test('renders the country selection field', () => {
    render(<UncontrolledForm />);
    expect(screen.getByText('Select country...')).toBeInTheDocument();
  });

  test('renders the image upload field', () => {
    render(<UncontrolledForm />);
    expect(screen.getByText('Profile Image (PNG or JPEG)')).toBeInTheDocument();
  });

  test('renders the terms acceptance checkbox', () => {
    render(<UncontrolledForm />);
    expect(screen.getByLabelText(/I accept the Terms/)).toBeInTheDocument();
  });

  test('renders the form submission button', () => {
    render(<UncontrolledForm />);
    expect(screen.getByRole('button', { name: 'Send Form' })).toBeInTheDocument();
  });
});
