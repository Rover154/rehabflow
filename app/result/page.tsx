'use client';
import { useAnswersStore } from '@/stores/useAnswersStore';
import { getRecommendation } from '@/utils/getRecommendation';
import { Button } from "@/components/ui/button";

export default function ResultScreen() {
  const answers = useAnswersStore();
  const rec = getRecommendation(answers);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-2">Ваша программа готова ✓</h1>
      <div className="bg-white rounded-3xl shadow p-8 mt-8">
        <h2 className="text-xl font-medium">{rec.title}</h2>
        <p className="text-green-700 mt-1">{rec.stage}</p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Почему */}
          <div>
            <h3 className="font-medium mb-3">Почему подходит:</h3>
            <ul className="space-y-2 text-sm">
              {rec.why.map((w, i) => <li key={i}>• {w}</li>)}
            </ul>
          </div>

          {/* Что включено */}
          <div>
            <h3 className="font-medium mb-3">Что включено:</h3>
            <ul className="space-y-1.5">
              {rec.included.map((item, i) => <li key={i} className="flex gap-2 text-sm"><span>✓</span> {item}</li>)}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row gap-4 justify-between items-end">
          <div>
            <div className="text-sm text-gray-500">Стоимость</div>
            <div className="text-3xl font-semibold">{rec.price} ₽</div>
          </div>
          <Button size="lg" className="w-full sm:w-auto">{rec.cta}</Button>
        </div>

        {/* Упражнения */}
        <div className="mt-10">
          <h3 className="font-medium mb-4">Рекомендуемые упражнения:</h3>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {rec.exercises.map((id) => (
              <div key={id} className="min-w-[140px] bg-gray-50 border rounded-2xl p-4 text-center">
                Рисунок {id}
                <div className="text-[10px] text-gray-400 mt-1">цигун</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}