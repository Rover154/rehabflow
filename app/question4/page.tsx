'use client';
import { useAnswersStore } from '@/stores/useAnswersStore';
import { Button } from "@/components/ui/button";
import { useStep } from '@/hooks/useStep';
import { useRouter } from 'next/navigation';
import ProgressBar from '@/components/ProgressBar';
import { BookOpen, Video, Users, HelpCircle } from 'lucide-react';

const formatOptions = [
  { 
    key: 'self', 
    label: 'Самостоятельно по методичке', 
    desc: 'Занимаюсь сам дома, мне нужны инструкции',
    icon: BookOpen
  },
  { 
    key: 'online', 
    label: 'С инструктором онлайн', 
    desc: 'Нужен контроль и обратная связь',
    icon: Video
  },
  { 
    key: 'personal', 
    label: 'Личные занятия в Новосибирске', 
    desc: 'Живу в Новосибирске, хочу заниматься лично',
    icon: Users
  },
  { 
    key: 'help', 
    label: 'Не знаю, помогите выбрать', 
    desc: '',
    icon: HelpCircle
  },
];

export default function Question4Screen() {
  const { format, setFormat } = useAnswersStore();
  const { goBack } = useStep();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ProgressBar currentStep={4} />
      <div className="flex-1 max-w-lg mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-8">Какой формат занятий вам удобнее?</h2>
        
        <div className="space-y-4">
          {formatOptions.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.key}
                onClick={() => setFormat(opt.key as Format)}
                className={`w-full border-2 rounded-3xl p-6 text-left transition-all hover:border-green-600 ${
                  format === opt.key
                    ? 'border-green-600 bg-green-50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-1 ${format === opt.key ? 'text-green-600' : 'text-gray-400'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-lg">{opt.label}</div>
                    {opt.desc && <div className="text-gray-600 text-sm mt-1.5">{opt.desc}</div>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex gap-3 mt-12">
          <Button variant="outline" size="lg" onClick={goBack} className="flex-1">
            ← Назад
          </Button>
          <Button 
            size="lg" 
            onClick={() => router.push('/question6')} 
            disabled={!format}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            Далее →
          </Button>
        </div>
      </div>
    </div>
  );
}
