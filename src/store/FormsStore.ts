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

type FieldChanges = {
  [fieldName: string]: boolean;
};

interface FormsState {
  latestByForm: {
    uncontrolled?: Submission;
    controlled?: Submission;
  };
  history: Submission[];
  recentHighlight: { id: string; until: number } | null;
  fieldChanges: {
    uncontrolled?: FieldChanges;
    controlled?: FieldChanges;
  };

  submitted: (payload: Submission) => void;
  clearHighlight: () => void;
  resetFormData: (origin: FormOrigin) => void;
  clearFieldChanges: (origin: FormOrigin) => void;
}

export const compareSubmissions = (prev: Submission | undefined, current: Submission): FieldChanges => {
  if (!prev) return {};

  const changes: FieldChanges = {};

  (Object.keys(prev) as (keyof Submission)[]).forEach((key) => {
    changes[key as string] = prev[key] !== current[key];
  });
  return changes;
};

export const useFormsStore = create<FormsState>()(
  persist(
    (set) => ({
      latestByForm: {},
      history: [],
      recentHighlight: null,
      fieldChanges: {},

      submitted: (payload) =>
        set((state) => {
          const previous = state.latestByForm[payload.origin];
          const fieldChanges = compareSubmissions(previous, payload);

          return {
            latestByForm: {
              ...state.latestByForm,
              [payload.origin]: payload,
            },
            history: [...state.history, payload],
            recentHighlight: {
              id: payload.id,
              until: Date.now() + 4000,
            },
            fieldChanges: {
              ...state.fieldChanges,
              [payload.origin]: fieldChanges,
            },
          };
        }),

      clearHighlight: () => set({ recentHighlight: null }),

      resetFormData: (origin) =>
        set((state) => ({
          latestByForm: {
            ...state.latestByForm,
            [origin]: undefined,
          },
          fieldChanges: {
            ...state.fieldChanges,
            [origin]: {},
          },
        })),

      clearFieldChanges: (origin) =>
        set((state) => ({
          fieldChanges: {
            ...state.fieldChanges,
            [origin]: {},
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

export const selectFieldChanges = (origin: FormOrigin) => (state: FormsState) => state.fieldChanges[origin] || {};
