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
      <div className="flex-1 max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-8 text-center">Какой формат занятий вам удобнее?</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {formatOptions.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.key}
                onClick={() => setFormat(opt.key as Format)}
                className={`border-2 rounded-3xl p-6 text-center transition-all hover:border-green-600 flex flex-col items-center justify-center h-full ${
                  format === opt.key
                    ? 'border-green-600 bg-green-50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`mb-3 ${format === opt.key ? 'text-green-600' : 'text-gray-400'}`}>
                  <Icon className="w-10 h-10 mx-auto" />
                </div>
                <div className="font-medium text-base mb-1">{opt.label}</div>
                {opt.desc && <div className="text-gray-600 text-sm text-center">{opt.desc}</div>}
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
