// stores/useAnswersStore.ts
import { create } from 'zustand';

type Diagnosis = 'stroke' | 'infarct' | 'trauma' | 'chronic' | 'other';
type TimePeriod = 'acute' | '1-3' | '3-6' | '6plus' | '1yplus' | 'any';
type Format = 'self' | 'online' | 'personal' | 'help';

interface Answers {
  diagnosis: Diagnosis | null;
  time: TimePeriod | null;
  symptoms: string[];
  format: Format | null;
  name: string;
  contact: string;
  comment: string;
}

interface AnswersStore extends Answers {
  setDiagnosis: (d: Diagnosis) => void;
  setTime: (t: TimePeriod) => void;
  toggleSymptom: (s: string) => void;
  setFormat: (f: Format) => void;
  setContactData: (data: Partial<Pick<Answers, 'name' | 'contact' | 'comment'>>) => void;
  reset: () => void;
}

export const useAnswersStore = create<AnswersStore>((set) => ({
  diagnosis: null,
  time: null,
  symptoms: [],
  format: null,
  name: '',
  contact: '',
  comment: '',
  setDiagnosis: (d) => set({ diagnosis: d, symptoms: [] }),
  setTime: (t) => set({ time: t }),
  toggleSymptom: (s) =>
    set((state) => ({
      symptoms: state.symptoms.includes(s)
        ? state.symptoms.filter((x) => x !== s)
        : [...state.symptoms, s],
    })),
  setFormat: (f) => set({ format: f }),
  setContactData: (data) => set(data),
  reset: () => set({ diagnosis: null, time: null, symptoms: [], format: null, name: '', contact: '', comment: '' }),
}));