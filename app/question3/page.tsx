'use client';

import { useAnswersStore } from '@/stores/useAnswersStore';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useStep } from '@/hooks/useStep';
import ProgressBar from '@/components/ProgressBar';

const strokeSymptoms = [
  { key: 'weak_arm',      label: 'Слабость или неподвижность руки' },
  { key: 'weak_leg',      label: 'Слабость или неподвижность ноги' },
  { key: 'balance',       label: 'Проблемы с равновесием / координацией' },
  { key: 'speech',        label: 'Нарушения речи' },
  { key: 'memory',        label: 'Проблемы с памятью / вниманием' },
  { key: 'dizziness',     label: 'Головокружения' },
  { key: 'anxiety',       label: 'Тревожность, страх повторного инсульта' },
  { key: 'fatigue',       label: 'Общая слабость, утомляемость' },
];

const infarctSymptoms = [
  { key: 'dyspnea',         label: 'Одышка при небольшой нагрузке' },
  { key: 'fear_activity',   label: 'Страх физической активности' },
  { key: 'fatigue',         label: 'Быстрая утомляемость' },
  { key: 'palpitations',    label: 'Учащённое сердцебиение' },
  { key: 'anxiety',         label: 'Тревожность, панические атаки' },
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

export default function Question3Screen() {
  const { diagnosis, symptoms, toggleSymptom, setDiagnosis } = useAnswersStore();
  const { goBack, goNext } = useStep();

  if (!diagnosis) {
    // защита от прямого захода на шаг 3
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <p className="text-xl mb-6">Сначала выберите, что произошло</p>
          <Button onClick={() => setDiagnosis('stroke')}>Вернуться к первому вопросу</Button>
        </div>
      </div>
    );
  }

  let options: { key: string; label: string }[] = [];
  let title = 'Что беспокоит сейчас?';

  if (diagnosis === 'stroke') {
    options = strokeSymptoms;
    title += ' (можно выбрать несколько)';
  } else if (diagnosis === 'infarct') {
    options = infarctSymptoms;
    title += ' (можно выбрать несколько)';
  } else if (diagnosis === 'trauma') {
    options = traumaAreas;
    title = 'Какая область тела пострадала?';
  } else {
    // chronic / other → пропускаем или показываем заглушку
    return (
      <div className="min-h-screen flex flex-col">
        <ProgressBar currentStep={3} />
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Для выбранного варианта дополнительные симптомы не требуются</h2>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={goBack}>← Назад</Button>
              <Button onClick={goNext}>Далее →</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isMulti = diagnosis !== 'trauma';
  const selectedCount = symptoms.length;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ProgressBar currentStep={3} />

      <div className="flex-1 max-w-lg mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-8">{title}</h2>

        <div className="space-y-3">
          {options.map((item) => (
            <label
              key={item.key}
              className={`flex items-start gap-3 p-4 border rounded-2xl cursor-pointer transition-all ${
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
              <span className="flex-1">{item.label}</span>
            </label>
          ))}
        </div>

        {isMulti && selectedCount > 0 && (
          <p className="text-sm text-gray-500 mt-4">
            Выбрано: {selectedCount}
          </p>
        )}

        <div className="flex gap-3 mt-10 pt-4 border-t">
          <Button variant="outline" size="lg" onClick={goBack} className="flex-1">
            ← Назад
          </Button>
          <Button
            size="lg"
            onClick={goNext}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            Далее →
          </Button>
        </div>
      </div>
    </div>
  );
}