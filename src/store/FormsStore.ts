import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FormOrigin = 'uncontrolled' | 'controlled';

export type Submission = {
  id: string;
  origin: FormOrigin;
  createdAt: string;
  name: string;
  age: number;
  email: string;
  gender: 'male' | 'female' | 'other';
  acceptedTC: boolean;
  country: {
    code: string;
    name: string;
  };
  image: {
    base64: string;
    mime: 'image/png' | 'image/jpeg';
    size: number;
  };
  password: string;
};

interface FormsState {
  latestByForm: {
    uncontrolled?: Submission;
    controlled?: Submission;
  };
  history: Submission[];
  recentHighlight: { id: string; until: number } | null;

  // Actions
  submitted: (payload: Submission) => void;
  clearHighlight: () => void;
  resetFormData: (origin: FormOrigin) => void;
}

export const useFormsStore = create<FormsState>()(
  persist(
    (set) => ({
      latestByForm: {},
      history: [],
      recentHighlight: null,

      submitted: (payload) =>
        set((state) => ({
          latestByForm: {
            ...state.latestByForm,
            [payload.origin]: payload,
          },
          history: [...state.history, payload],
          recentHighlight: {
            id: payload.id,
            until: Date.now() + 4000,
          },
        })),

      clearHighlight: () => set({ recentHighlight: null }),

      resetFormData: (origin) =>
        set((state) => ({
          latestByForm: {
            ...state.latestByForm,
            [origin]: undefined,
          },
        })),
    }),
    {
      name: 'forms-storage',
      partialize: (state) => ({
        ...state,
        history: state.history.map(({ image: _, ...item }) => item),
        latestByForm: Object.fromEntries(
          Object.entries(state.latestByForm).map(([key, value]) => [
            key,
            value ? { ...value, image: undefined as any } : undefined,
          ])
        ),
      }),
    }
  )
);
