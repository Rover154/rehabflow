'use client';

import { useAnswersStore } from '@/stores/useAnswersStore';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from 'next/navigation';
import ProgressBar from '@/components/ProgressBar';

// Исправлены опечатки: 'anxiety' → 'anxiety'
const strokeSymptoms = [
  { key: 'weak_arm',      label: 'Слабость или неподвижность руки' },
  { key: 'weak_leg',      label: 'Слабость или неподвижность ноги' },
  { key: 'balance',       label: 'Проблемы с равновесием / координацией' },
  { key: 'speech',        label: 'Нарушения речи' },
  { key: 'memory',        label: 'Проблемы с памятью / вниманием' },
  { key: 'dizziness',     label: 'Головокружения' },
  { key: 'anxiety',       label: 'Тревожность, страх повторного инсульта' }, // ✅ исправлено
  { key: 'fatigue',       label: 'Общая слабость, утомляемость' },
];

const infarctSymptoms = [
  { key: 'dyspnea',         label: 'Одышка при небольшой нагрузке' },
  { key: 'fear_activity',   label: 'Страх физической активности' },
  { key: 'fatigue',         label: 'Быстрая утомляемость' },
  { key: 'palpitations',    label: 'Учащённое сердцебиение' },
  { key: 'anxiety',         label: 'Тревожность, панические атаки' }, // ✅ исправлено
  { key: 'sleep',           label: 'Нарушения сна' },
  { key: 'pressure',        label: 'Повышенное давление' },
  { key: 'chest_pain',      label: 'Боли в груди при нагрузке' },
];

const traumaAreas = [
  { key: 'arm',     label: 'Рука / плечо' },
  { key: 'leg',     label: 'Нога / колено / голеностоп' },
  { key: 'back',    label: 'Спина / позвоночник' },
  { key: 'neck',    label: 'Шея' },
  { key: 'hip',     label: 'Тазобедренный сустав' },
  { key: 'multiple',label: 'Несколько областей' },
];

const stressSymptoms = [
  { key: 'anxiety',         label: 'Тревожность, беспокойство' }, // ✅
  { key: 'sleep',           label: 'Нарушения сна' },
  { key: 'fatigue',         label: 'Хроническая усталость' },
  { key: 'tension',         label: 'Мышечное напряжение' },
  { key: 'headaches',       label: 'Головные боли' },
  { key: 'concentration',   label: 'Проблемы с концентрацией' },
];

export default function Question3Screen() {
  const { diagnoses, symptoms, toggleSymptom } = useAnswersStore();
  const router = useRouter();

  if (!diagnoses || diagnoses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <p className="text-xl mb-6">Сначала выберите, что произошло</p>
          <Button onClick={() => router.push('/question1')}>Вернуться к первому вопросу</Button>
        </div>
      </div>
    );
  }

  const options: { key: string; label: string }[] = [];
  let title = 'Что беспокоит сейчас?';

  if (diagnoses.includes('stroke')) options.push(...strokeSymptoms);
  if (diagnoses.includes('infarct')) options.push(...infarctSymptoms);
  if (diagnoses.includes('trauma')) options.push(...traumaAreas);
  if (diagnoses.includes('stress')) options.push(...stressSymptoms);

  const uniqueOptions = Array.from(
    new Map(options.map(item => [item.key, item])).values()
  );

  if (diagnoses.length === 1 && diagnoses.includes('other')) {
    return (
      <div className="min-h-screen flex flex-col">
        <ProgressBar currentStep={3} />
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div>
            <h2 className="text-2xl font-semibold mb-6">
              Для выбранного варианта дополнительные симптомы не требуются
            </h2>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => router.back()}>← Назад</Button>
              <Button onClick={() => router.push('/question4')}>Далее →</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (uniqueOptions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <ProgressBar currentStep={3} />
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div>
            <h2 className="text-2xl font-semibold mb-6">
              Дополнительные симптомы не требуются
            </h2>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => router.back()}>← Назад</Button>
              <Button onClick={() => router.push('/question4')}>Далее →</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  title += ' (можно выбрать несколько)';
  const selectedCount = symptoms.length;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ProgressBar currentStep={3} />

      <div className="flex-1 max-w-2xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-semibold mb-2 text-center">{title}</h2>
        <p className="text-center text-gray-600 mb-6 text-sm">
          Выберите все, что вас беспокоит
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {uniqueOptions.map((item) => (
            <label
              key={item.key}
              className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-all ${
                symptoms.includes(item.key)
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Checkbox
                checked={symptoms.includes(item.key)}
                onCheckedChange={() => toggleSymptom(item.key)}
                className="mt-1"
              />
              <span className="flex-1 text-sm">{item.label}</span>
            </label>
          ))}
        </div>

        {selectedCount > 0 && (
          <p className="text-sm text-gray-500 mt-4 text-center">
            Выбрано: {selectedCount}
          </p>
        )}

        <div className="flex gap-3 mt-8">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => router.back()} 
            className="flex-1 h-12"
          >
            ← Назад
          </Button>
          <Button
            size="lg"
            onClick={() => router.push('/question4')}
            className="flex-1 h-12 bg-green-600 hover:bg-green-700"
          >
            Далее →
          </Button>
        </div>
      </div>
    </div>
  );
}