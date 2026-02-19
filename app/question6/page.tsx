'use client';
import { useAnswersStore } from '@/stores/useAnswersStore';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from 'next/navigation';
import ProgressBar from '@/components/ProgressBar';
import { AlertCircle } from 'lucide-react';

const commonDiseases = [
  'Гипертония',
  'Диабет',
  'Астма',
  'Артрит',
  'Остеопороз',
  'Заболевания щитовидной железы',
  'Хронические боли в спине',
  'Мигрени',
];

export default function Question6Screen() {
  const { chronicDiseases, contraindications, toggleChronicDisease, setContraindications } = useAnswersStore();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ProgressBar currentStep={6} />
      
      <div className="flex-1 max-w-2xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-semibold mb-2 text-center">
          Хронические заболевания и противопоказания
        </h2>
        <p className="text-center text-gray-600 mb-6 text-sm">
          Это поможет подобрать безопасную программу
        </p>

        {/* Хронические заболевания */}
        <div className="mb-6">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            Есть ли у вас хронические заболевания?
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {commonDiseases.map((disease) => (
              <label
                key={disease}
                className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${
                  chronicDiseases.includes(disease)
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Checkbox
                  checked={chronicDiseases.includes(disease)}
                  onCheckedChange={() => toggleChronicDisease(disease)}
                />
                <span className="text-sm">{disease}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Противопоказания */}
        <div className="mb-6 p-4 bg-orange-50 rounded-2xl">
          <label className="block text-sm font-medium mb-2">
            Есть ли противопоказания к физическим нагрузкам?
          </label>
          <Textarea
            value={contraindications}
            onChange={e => setContraindications(e.target.value)}
            placeholder="Например: недавняя операция, острые боли, запрет врача..."
            rows={3}
            className="text-base bg-white"
          />
          <p className="text-xs text-gray-600 mt-2">
            Укажите любые ограничения, о которых нам важно знать
          </p>
        </div>

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
            onClick={() => router.push('/question5')} 
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
