export interface FormData {
  name: string;
  age: string;
  height: string;
  weight: string;
  conditions: string[];
  otherConditionDetails: string;
  timePassed: string;
  strokeSymptoms: string[];
  heartAttackSymptoms: string[];
  traumaArea: string;
  traumaOtherDetails: string;
  chronicDiseases: string[];
  chronicOtherDetails: string;
  format: string;
  phone: string;
  email: string;
  comment: string;
  consent: boolean;
}

export const initialData: FormData = {
  name: '',
  age: '',
  height: '',
  weight: '',
  conditions: [],
  otherConditionDetails: '',
  timePassed: '',
  strokeSymptoms: [],
  heartAttackSymptoms: [],
  traumaArea: '',
  traumaOtherDetails: '',
  chronicDiseases: [],
  chronicOtherDetails: '',
  format: '',
  phone: '',
  email: '',
  comment: '',
  consent: false,
};
