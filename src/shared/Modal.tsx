import { createPortal } from 'react-dom';

import { useEffect, type JSX } from 'react';
import useStoreForms from '../store/ModalStore';

export default function Modal({ children }: { children: JSX.Element }) {
  const closeModal = useStoreForms((state) => state.closeModal);
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const isModal = e.currentTarget === e.target;
    if (!isModal) return;
    closeModal();
  };

  const handleEscKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  const modal = (
    <div
      onClick={(event) => handleClick(event)}
      className="fixed inset-0 bg-slate-900/60 overflow-y-auto backdrop-blur py-10">
      <div className="bg-white rounded-lg mx-auto min-h-[320px] max-w-[640px] ">{children}</div>
    </div>
  );

  return createPortal(modal, document.body);
}
