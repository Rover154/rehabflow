// stores/useAnswersStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Diagnosis = 'stroke' | 'infarct' | 'trauma' | 'stress' | 'other';
export type TimePeriod = 'acute' | '1-3' | '3-6' | '6plus' | '1yplus' | 'any';
export type Format = 'self' | 'online' | 'personal' | 'help';

interface PatientInfo {
  name: string;
  age: string;
  height: string;
  weight: string;
}

interface Answers {
  // Анкета пациента
  patientInfo: PatientInfo;
  
  // Диагнозы (множественный выбор)
  diagnoses: Diagnosis[];
  otherDescription: string;
  
  // Остальные вопросы
  time: TimePeriod | null;
  symptoms: string[];
  chronicDiseases: string[];
  contraindications: string;
  format: Format | null;
  
  // Контакты
  contact: string;
  comment: string;
}

interface AnswersStore extends Answers {
  // Методы для анкеты
  setPatientInfo: (info: Partial<PatientInfo>) => void;
  
  // Методы для диагнозов
  toggleDiagnosis: (d: Diagnosis) => void;
  setOtherDescription: (desc: string) => void;
  
  // Остальные методы
  setTime: (t: TimePeriod) => void;
  toggleSymptom: (s: string) => void;
  toggleChronicDisease: (d: string) => void;
  setContraindications: (c: string) => void;
  setFormat: (f: Format) => void;
  setContactData: (data: Partial<Pick<Answers, 'contact' | 'comment'>>) => void;
  
  reset: () => void;
}

const initialState: Answers = {
  patientInfo: {
    name: '',
    age: '',
    height: '',
    weight: '',
  },
  diagnoses: [],
  otherDescription: '',
  time: null,
  symptoms: [],
  chronicDiseases: [],
  contraindications: '',
  format: null,
  contact: '',
  comment: '',
};

export const useAnswersStore = create<AnswersStore>()(
  persist(
    (set) => ({
      ...initialState,
      
      setPatientInfo: (info) =>
        set((state) => ({
          patientInfo: { ...state.patientInfo, ...info },
        })),
      
      toggleDiagnosis: (d) =>
        set((state) => ({
          diagnoses: state.diagnoses.includes(d)
            ? state.diagnoses.filter((x) => x !== d)
            : [...state.diagnoses, d],
        })),
      
      setOtherDescription: (desc) => set({ otherDescription: desc }),
      
      setTime: (t) => set({ time: t }),
      
      toggleSymptom: (s) =>
        set((state) => ({
          symptoms: state.symptoms.includes(s)
            ? state.symptoms.filter((x) => x !== s)
            : [...state.symptoms, s],
        })),
      
      toggleChronicDisease: (d) =>
        set((state) => ({
          chronicDiseases: state.chronicDiseases.includes(d)
            ? state.chronicDiseases.filter((x) => x !== d)
            : [...state.chronicDiseases, d],
        })),
      
      setContraindications: (c) => set({ contraindications: c }),
      
      setFormat: (f) => set({ format: f }),
      
      setContactData: (data) => set(data),
      
      reset: () => set(initialState),
    }),
    {
      name: 'rehab-answers-storage',
    }
  )
);
