import { create } from 'zustand';

type Forms = {
  Uncontrolled: boolean;
  Controlled: boolean;
  setControlled: (value: boolean) => void;
  setUncontrolled: (value: boolean) => void;
};

const useStoreForms = create<Forms>()((set) => ({
  Uncontrolled: false,
  Controlled: false,
  setUncontrolled: (value) => set({ Uncontrolled: value }),
  setControlled: (value) => set({ Controlled: value }),
}));

export default useStoreForms;
