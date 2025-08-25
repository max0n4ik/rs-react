import { create } from 'zustand';

export type Forms = {
  isOpen: boolean;
  modalKind: 'uncontrolled' | 'controlled' | null;
  openModal: (kind: 'uncontrolled' | 'controlled') => void;
  closeModal: () => void;
};

const useModalStore = create<Forms>()((set) => ({
  isOpen: false,
  modalKind: null,
  openModal: (kind) => set({ isOpen: true, modalKind: kind }),

  closeModal: () => set({ isOpen: false, modalKind: null }),
}));

export default useModalStore;
