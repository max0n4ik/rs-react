import { create } from 'zustand';
import type { UserFormData } from '../utils/scheme';

const initialFormData: UserFormData = {
  name: '',
  age: 0,
  email: '',
  password: '',
  confirmPassword: '',
};

interface UserFormState {
  formData: UserFormData;
  errors: Partial<Record<keyof UserFormData, string>>;
}

interface UserFormActions {
  setFormData: (data: Partial<UserFormData>) => void;
  setErrors: (errors: Partial<Record<keyof UserFormData, string>>) => void;
  resetForm: () => void;
}

export const useUserFormStore = create<UserFormState & UserFormActions>((set) => ({
  formData: initialFormData,
  errors: {},

  setFormData: (data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        ...data,
      },
    })),

  setErrors: (errors) => set({ errors }),

  resetForm: () =>
    set({
      formData: initialFormData,
      errors: {},
    }),
}));
