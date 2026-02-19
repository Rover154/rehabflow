'use client';
import { useAnswersStore } from '@/stores/useAnswersStore';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import ProgressBar from '@/components/ProgressBar';

const timeOptions = [
  { key: 'acute', label: 'Меньше 1 месяца (острый период)' },
  { key: '1-3', label: '1–3 месяца' },
  { key: '3-6', label: '3–6 месяцев' },
  { key: '6plus', label: 'Больше 6 месяцев' },
  { key: '1yplus', label: 'Больше года' },
];

export default function Question2Screen() {
  const { time, setTime } = useAnswersStore();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ProgressBar currentStep={2} />
      
      <div className="flex-1 max-w-md mx-auto px-4 py-6">
        <h2 className="text-2xl font-semibold mb-2 text-center">
          Сколько времени прошло?
        </h2>
        <p className="text-center text-gray-600 mb-6 text-sm">
          С момента события или начала проблемы
        </p>
        
        <div className="space-y-3">
          {timeOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setTime(opt.key as TimePeriod)}
              className={`w-full text-left border-2 rounded-2xl px-6 py-4 transition-all hover:border-green-500 ${
                time === opt.key
                  ? 'border-green-600 bg-green-50 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex gap-3 mt-10">
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
            onClick={() => router.push('/question3')} 
            disabled={!time}
            className="flex-1 h-12 bg-green-600 hover:bg-green-700"
          >
            Далее →
          </Button>
        </div>
      </div>
    </div>
  );
}
