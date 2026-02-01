
import { useAnswersStore } from '@/stores/useAnswersStore';

export const getPdfContent = (answers: ReturnType<typeof useAnswersStore.getState>) => {
  const diagnosisMap: Record<string, string> = {
    stroke: 'Инсульт',
    infarct: 'Инфаркт',
    trauma: 'Травма',
    chronic: 'Хроническое заболевание',
    other: 'Общее восстановление'
  };

  const diagnosisLabel = answers.diagnosis ? diagnosisMap[answers.diagnosis] || 'Восстановление' : 'Восстановление';

  return {
    title: `Методичка по реабилитации: ${diagnosisLabel}`,
    subtitle: 'На основе книги "Хоушен Линь. Секреты китайской медицины. 300 вопросов о цигун"',
    intro: `Эта программа составлена специально для вашего случая (${diagnosisLabel}). Выполняйте упражнения плавно, без резких движений.`,
    exercises: [
      {
        name: 'Упражнение 1: Дыхание Даньтянь',
        description: 'Сядьте прямо или лягте. Положите руки на живот. Вдыхайте глубоко носом, чувствуя, как живот надувается. Выдыхайте ртом, втягивая живот. Повторите 10 раз.',
        imagePlaceholder: '[Рисунок: Человек с руками на животе]'
      },
      {
        name: 'Упражнение 2: Подъем неба',
        description: 'Встаньте прямо. Медленно поднимите руки через стороны вверх, делая вдох. Опустите руки перед собой, делая выдох. Представьте, что вы разглаживаете энергию.',
        imagePlaceholder: '[Рисунок: Человек поднимает руки]'
      },
      {
        name: 'Упражнение 3: Успокоение сердца',
        description: 'Положите левую руку на сердце, правую сверху. Закройте глаза. Дышите ровно. Представьте теплый свет в области сердца.',
        imagePlaceholder: '[Рисунок: Руки на груди]'
      }
    ],
    footer: 'Для записи на консультацию: https://t.me/cigunrehab'
  };
};
