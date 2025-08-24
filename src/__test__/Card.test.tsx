import { render, screen } from '@testing-library/react';
import { expect, test, describe } from 'vitest';
import Card from '../components/Card';
import type { Submission } from '../store/FormsStore';

const mockCardData: Submission = {
  id: '123456789',
  origin: 'controlled',
  createdAt: '1132134141',
  name: 'John Doe',
  age: 30,
  gender: 'male',
  email: 'john.doe@example.com',
  password: 'strongPassword123',
  country: {
    name: 'United States',
    code: 'US',
  },
  acceptedTC: true,
  image: {
    base64: 'data:image/png;base64,...',
    mime: 'image/jpeg',
    size: 1024,
  },
};

describe('Card Component', () => {
  test('should render all card data correctly', () => {
    render(<Card card={mockCardData} />);

    expect(screen.getByText(/123456.../i)).toBeInTheDocument();
    expect(screen.getByText(/controlled/i)).toBeInTheDocument();

    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/30 years/i)).toBeInTheDocument();
    expect(screen.getByText(/male/i)).toBeInTheDocument();
    expect(screen.getByText(/john.doe@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/United States/i)).toBeInTheDocument();
    expect(screen.getByText(/strongPassword123/i)).toBeInTheDocument();

    expect(screen.getByText(/Terms Accepted/i)).toBeInTheDocument();

    const image = screen.getByRole('img', { name: /profile/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockCardData.image.base64);
  });
});
