'use client';
import { useAnswersStore } from '@/stores/useAnswersStore';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from 'next/navigation';
import ProgressBar from '@/components/ProgressBar';
import { Brain, HeartPulse, Bandage, Activity, Stethoscope } from 'lucide-react';
import { useState } from 'react';

const options = [
  { key: 'stroke' as const, label: 'Инсульт', icon: Brain, color: 'text-purple-600' },
  { key: 'infarct' as const, label: 'Инфаркт', icon: HeartPulse, color: 'text-red-600' },
  { key: 'trauma' as const, label: 'Травма', icon: Bandage, color: 'text-orange-600' },
  { key: 'stress' as const, label: 'Стресс', icon: Activity, color: 'text-yellow-600' },
  { key: 'other' as const, label: 'Другое', icon: Stethoscope, color: 'text-gray-600' },
];

export default function Question1Screen() {
  const { diagnoses, otherDescription, toggleDiagnosis, setOtherDescription } = useAnswersStore();
  const router = useRouter();
  const [showOtherField, setShowOtherField] = useState(diagnoses.includes('other'));

  const handleToggle = (key: typeof options[number]['key']) => {
    toggleDiagnosis(key);
    if (key === 'other') {
      setShowOtherField(!diagnoses.includes('other'));
    }
  };

  const isValid = diagnoses.length > 0 && (!diagnoses.includes('other') || otherDescription.trim().length > 0);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ProgressBar currentStep={1} />
      
      <div className="flex-1 max-w-2xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-semibold mb-2 text-center">Что произошло?</h2>
        <p className="text-center text-gray-600 mb-6 text-sm">
          Можно выбрать несколько вариантов
        </p>

        {/* Кнопки в два ряда */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = diagnoses.includes(opt.key);
            
            return (
              <button
                key={opt.key}
                onClick={() => handleToggle(opt.key)}
                className={`border-2 rounded-2xl p-4 text-center transition-all hover:border-green-600 ${
                  isSelected ? 'border-green-600 bg-green-50 shadow-sm' : 'border-gray-200'
                }`}
              >
                <div className={`flex justify-center mb-2 ${isSelected ? 'text-green-600' : opt.color}`}>
                  <Icon className="w-10 h-10" />
                </div>
                <div className="font-medium text-sm">{opt.label}</div>
              </button>
            );
          })}
        </div>

        {/* Поле для описания "другое" */}
        {showOtherField && diagnoses.includes('other') && (
          <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
            <label className="block text-sm font-medium mb-2">
              Опишите вашу проблему
            </label>
            <Textarea
              value={otherDescription}
              onChange={e => setOtherDescription(e.target.value)}
              placeholder="Расскажите подробнее о вашей ситуации..."
              rows={3}
              className="text-base"
            />
          </div>
        )}

        {diagnoses.length > 0 && (
          <p className="text-sm text-gray-500 mb-4 text-center">
            Выбрано: {diagnoses.length}
          </p>
        )}

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => router.back()} 
            className="flex-1 h-12"
            size="lg"
          >
            ← Назад
          </Button>
          <Button 
            disabled={!isValid} 
            onClick={() => router.push('/question2')} 
            className="flex-1 h-12 bg-green-600 hover:bg-green-700"
            size="lg"
          >
            Далее →
          </Button>
        </div>
      </div>
    </div>
  );
}
