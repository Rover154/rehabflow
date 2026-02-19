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

          {/* Рост и вес - два отдельных поля по 3 клетки */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Ruler className="w-4 h-4 text-green-600" />
                Рост (см)
              </label>
              <Input
                type="text"
                inputMode="numeric"
                value={patientInfo.height}
                onChange={e => {
                  const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);
                  setPatientInfo({ height: value });
                }}
                placeholder="170"
                className="h-12 text-base text-center font-mono"
                maxLength={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Weight className="w-4 h-4 text-green-600" />
                Вес (кг)
              </label>
              <Input
                type="text"
                inputMode="numeric"
                value={patientInfo.weight}
                onChange={e => {
                  const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);
                  setPatientInfo({ weight: value });
                }}
                placeholder="70"
                className="h-12 text-base text-center font-mono"
                maxLength={3}
              />
            </div>
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
