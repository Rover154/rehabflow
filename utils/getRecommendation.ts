// utils/getRecommendation.ts
import recommendationsData from '@/data/recommendations.json'; // ваш JSON

export function getRecommendation(answers: Answers) {
  if (!answers.diagnosis || !answers.time || !answers.format) return recommendationsData.fallback;

  const normalizedTime = answers.time === 'any' ? 'any' : answers.time;

  // Точное совпадение
  let match = recommendationsData.recommendations.find((rec) => {
    const cond = rec.conditions;
    return (
      cond.diagnosis === answers.diagnosis &&
      (cond.time === normalizedTime || cond.time === 'any') &&
      (answers.symptoms.length === 0 || answers.symptoms.some((s) => cond.symptoms.includes(s))) &&
      (cond.format === answers.format || cond.format === 'any')
    );
  });

  // Частичное совпадение (приоритет: диагноз + время + формат)
  if (!match) {
    match = recommendationsData.recommendations.find((rec) => {
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
    match = recommendationsData.recommendations.find((rec) => rec.conditions.diagnosis === answers.diagnosis);
  }

  return match || recommendationsData.fallback;
}