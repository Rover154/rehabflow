'use client';
import { useAnswersStore } from '@/stores/useAnswersStore';
import { Button } from "@/components/ui/button";
import { useStep } from '@/hooks/useStep';

const timeOptions = [
  { key: 'acute', label: 'Меньше 1 месяца (острый период)' },
  { key: '1-3', label: '1–3 месяца' },
  { key: '3-6', label: '3–6 месяцев' },
  { key: '6plus', label: 'Больше 6 месяцев' },
  { key: '1yplus', label: 'Больше года' },
];

export default function Question2Screen() {
  const { time, setTime } = useAnswersStore();
  const { goBack, goNext } = useStep();

  return (
    <div className="min-h-screen bg-white">
      <ProgressBar currentStep={2} />
      <div className="max-w-md mx-auto px-4 pt-8">
        <h2 className="text-2xl font-semibold mb-8">Сколько времени прошло?</h2>
        
        <div className="space-y-3">
          {timeOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setTime(opt.key as any)}
              className={`w-full text-left border-2 rounded-2xl px-6 py-5 transition-all hover:border-green-500 ${
                time === opt.key 
                  ? 'border-green-600 bg-green-50 shadow-sm' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex gap-3 mt-12">
          <Button variant="outline" size="lg" onClick={goBack} className="flex-1">
            ← Назад
          </Button>
          <Button 
            size="lg" 
            onClick={goNext} 
            disabled={!time}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            Далее →
          </Button>
        </div>
      </div>
    </div>
  );
}