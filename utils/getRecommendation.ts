// utils/getRecommendation.ts
import recommendationsData from '@/data/recommendations.json';

type Diagnosis = 'stroke' | 'infarct' | 'trauma' | 'chronic' | 'other';
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

export function getRecommendation(answers: Answers) {
  if (!answers.diagnosis || !answers.time || !answers.format) return recommendationsData.fallback;

  const normalizedTime = answers.time === 'any' ? 'any' : answers.time;

  // Точное совпадение
  let match = recommendationsData.recommendations.find((rec: any) => {
    const cond = rec.conditions;
    return (
      cond.diagnosis === answers.diagnosis &&
      (cond.time === normalizedTime || cond.time === 'any') &&
      (answers.symptoms.length === 0 || answers.symptoms.some((s: string) => cond.symptoms.includes(s))) &&
      (cond.format === answers.format || cond.format === 'any')
    );
  });

  // Частичное совпадение (приоритет: диагноз + время + формат)
  if (!match) {
    match = recommendationsData.recommendations.find((rec: any) => {
      const cond = rec.conditions;
      return (
        cond.diagnosis === answers.diagnosis &&
        (cond.time === normalizedTime || cond.time === 'any') &&
        (cond.format === answers.format || cond.format === 'any')
      );
    });
  }

  // Фоллбэк по диагнозу
  if (!match) {
    match = recommendationsData.recommendations.find((rec: any) => rec.conditions.diagnosis === answers.diagnosis);
  }

  return match || recommendationsData.fallback;
}
