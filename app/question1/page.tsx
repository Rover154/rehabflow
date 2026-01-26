'use client';
import { useAnswersStore } from '@/stores/useAnswersStore';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

const options = [
  { key: 'stroke', label: 'Инсульт', icon: '🧠' },
  { key: 'infarct', label: 'Инфаркт', icon: '❤️' },
  { key: 'trauma', label: 'Травма (перелом, операция)', icon: '🦴' },
  { key: 'chronic', label: 'Хроническое заболевание', icon: '📅' },
  { key: 'other', label: 'Другое', icon: '❓' },
];

export default function Question1Screen() {
  const { diagnosis, setDiagnosis } = useAnswersStore();
  const router = useRouter();

  return (
    <div className="max-w-md mx-auto px-4 py-8 sm:px-6">
      <h2 className="text-2xl font-semibold mb-8 text-center">Что произошло?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setDiagnosis(opt.key as any)}
            className={`border-2 rounded-3xl p-6 text-left transition-all hover:border-green-600 ${
              diagnosis === opt.key ? 'border-green-600 bg-green-50' : 'border-gray-200'
            }`}
          >
            <div className="text-4xl mb-3">{opt.icon}</div>
            <div className="font-medium">{opt.label}</div>
          </button>
        ))}
      </div>
      <div className="flex gap-3 mt-10">
        <Button variant="outline" onClick={() => router.back()}>← Назад</Button>
        <Button disabled={!diagnosis} onClick={() => router.push('/question2')} className="flex-1">Далее →</Button>
      </div>
    </div>
  );
}