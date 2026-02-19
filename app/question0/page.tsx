'use client';
import { useAnswersStore } from '@/stores/useAnswersStore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from 'next/navigation';
import ProgressBar from '@/components/ProgressBar';
import { User, Calendar, Ruler, Weight } from 'lucide-react';

export default function Question0Screen() {
  const { patientInfo, setPatientInfo } = useAnswersStore();
  const router = useRouter();

  const isValid = 
    patientInfo.name.trim().length >= 2 &&
    patientInfo.age.trim().length > 0 &&
    patientInfo.height.trim().length > 0 &&
    patientInfo.weight.trim().length > 0;

  const handleHeightWeightChange = (value: string) => {
    const parts = value.trim().split(/\s+/);
    if (parts.length >= 1) {
      setPatientInfo({ height: parts[0] });
    }
    if (parts.length >= 2) {
      setPatientInfo({ weight: parts[1] });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ProgressBar currentStep={0} />
      
      <div className="flex-1 max-w-md mx-auto px-5 py-8">
        <h2 className="text-2xl font-semibold mb-2 text-center">
          Анкета пациента
        </h2>
        <p className="text-center text-gray-600 mb-8 text-sm">
          Заполните основную информацию о себе
        </p>

        <div className="space-y-5">
          {/* Имя */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-green-600" />
              Ваше имя
            </label>
            <Input
              value={patientInfo.name}
              onChange={e => setPatientInfo({ name: e.target.value })}
              placeholder="Иван Иванов"
              className="h-12 text-base"
            />
          </div>

          {/* Возраст */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-green-600" />
              Возраст (лет)
            </label>
            <Input
              type="number"
              value={patientInfo.age}
              onChange={e => setPatientInfo({ age: e.target.value })}
              placeholder="45"
              className="h-12 text-base"
              min="1"
              max="120"
            />
          </div>

          {/* Рост и вес */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Ruler className="w-4 h-4 text-green-600" />
              <Weight className="w-4 h-4 text-green-600" />
              Рост и вес (через пробел)
            </label>
            <Input
              value={`${patientInfo.height}${patientInfo.weight ? ' ' + patientInfo.weight : ''}`}
              onChange={e => handleHeightWeightChange(e.target.value)}
              placeholder="170 75"
              className="h-12 text-base font-mono"
            />
            <p className="text-xs text-gray-500 mt-1">
              Пример: 170 75 (рост в см, вес в кг)
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="flex-1 h-12"
            size="lg"
          >
            ← Назад
          </Button>

          <Button
            onClick={() => router.push('/question1')}
            disabled={!isValid}
            className="flex-1 h-12 bg-green-600 hover:bg-green-700"
            size="lg"
          >
            Далее →
          </Button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          Эти данные помогут подобрать оптимальную программу реабилитации
        </p>
      </div>
    </div>
  );
}
