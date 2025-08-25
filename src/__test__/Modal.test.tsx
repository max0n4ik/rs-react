import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Modal from '../shared/Modal';
import useStoreForms from '../store/ModalStore';

vi.mock('../store/ModalStore');

const mockedUseStoreForms = vi.mocked(useStoreForms);

describe('Modal Component', () => {
  const mockCloseModal = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseStoreForms.mockReturnValue(mockCloseModal);
  });
  it('should render its children inside the document body (portal)', () => {
    const modalContentText = 'Modal';
    const { container } = render(
      <Modal>
        <p>{modalContentText}</p>
      </Modal>
    );

    expect(screen.getByText(modalContentText)).toBeInTheDocument();
    expect(container).toBeEmptyDOMElement();
    expect(document.body).toContainElement(screen.getByText(modalContentText));
  });

  it('should call closeModal when the backdrop is clicked', () => {
    render(
      <Modal>
        <div>Content</div>
      </Modal>
    );

    const backdrop = screen.getByRole('dialog');

    fireEvent.click(backdrop);

    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it('should call closeModal when the Escape key is pressed', () => {
    render(
      <Modal>
        <div>Content</div>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it('should NOT call closeModal when the inner content is clicked', () => {
    const modalContentText = 'Click here';
    render(
      <Modal>
        <p>{modalContentText}</p>
      </Modal>
    );

    const content = screen.getByText(modalContentText);
    fireEvent.click(content);

    expect(mockCloseModal).not.toHaveBeenCalled();
  });

  it('should clean up the keydown event listener on unmount', () => {
    const { unmount } = render(
      <Modal>
        <div>Content</div>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockCloseModal).toHaveBeenCalledTimes(1);

    unmount();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });
});
