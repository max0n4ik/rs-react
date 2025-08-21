import { createPortal } from 'react-dom';

import { useEffect, type JSX } from 'react';
import useStoreForms from '../store/store';

export default function Modal({ children }: { children: JSX.Element }) {
  const closeC = useStoreForms((state) => state.setControlled);
  const closeU = useStoreForms((state) => state.setUncontrolled);
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const isModal = e.currentTarget === e.target;
    if (!isModal) return;
    closeC(false);
    closeU(false);
  };

  const handleEscKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeC(false);
      closeU(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  const modal = (
    <div onClick={(event) => handleClick(event)} className="fixed inset-0 bg-slate-900/60 backdrop-blur py-10">
      <div className="bg-white rounded-lg mx-auto min-h-[320px] max-w-[640px]">{children}</div>
    </div>
  );

  return createPortal(modal, document.body);
}
