// utils/getRecommendation.ts
import recommendationsData from '@/data/recommendations.json';

type Diagnosis = 'stroke' | 'infarct' | 'trauma' | 'stress' | 'other';
type TimePeriod = 'acute' | '1-3' | '3-6' | '6plus' | '1yplus' | 'any';
type Format = 'self' | 'online' | 'personal' | 'help';

interface Answers {
  diagnosis: Diagnosis | null;
  time: TimePeriod | null;
  symptoms: string[];
  format: Format | null;
  name?: string;
  contact?: string;
  comment?: string;
}

export interface Recommendation {
  id: string;
  conditions: {
    diagnosis: Diagnosis;
    time: TimePeriod;
    symptoms: string[];
    format: Format;
  };
  title: string;
  stage: string;
  format: string;
  price: number;
  duration: string;
  sessions: number;
  included: string[];
  exercises: number[];
  why: string[];
  cta: string;
  pdf: string | null;
}

export function getRecommendation(answers: Answers): Recommendation {
  // Защита от неполных ответов — возвращаем полную структуру фоллбэка
  if (!answers.diagnosis || !answers.time || !answers.format) {
    return recommendationsData.fallback as Recommendation;
  }

  const normalizedTime = answers.time === 'any' ? 'any' : answers.time;

  // 🔍 1. Точное совпадение: диагноз + время + симптомы + формат
  let match = recommendationsData.recommendations.find((rec: any) => {
    const cond = rec.conditions;
    return (
      cond.diagnosis === answers.diagnosis &&
      (cond.time === normalizedTime || cond.time === 'any') &&
      (answers.symptoms.length === 0 || 
       answers.symptoms.some(s => cond.symptoms.includes(s))) &&
      (cond.format === answers.format || cond.format === 'help')
    );
  });

  // 🔍 2. Частичное совпадение: диагноз + время + формат (без симптомов)
  if (!match) {
    match = recommendationsData.recommendations.find((rec: any) => {
      const cond = rec.conditions;
      return (
        cond.diagnosis === answers.diagnosis &&
        (cond.time === normalizedTime || cond.time === 'any') &&
        (cond.format === answers.format || cond.format === 'help')
      );
    });
  }

  // 🔍 3. Фоллбэк по диагнозу
  if (!match) {
    match = recommendationsData.recommendations.find((rec: any) => 
      rec.conditions.diagnosis === answers.diagnosis
    );
  }

  return (match as Recommendation) || (recommendationsData.fallback as Recommendation);
}