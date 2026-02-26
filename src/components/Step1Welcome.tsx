import { ArrowRight, Activity, Heart, Users } from 'lucide-react';

interface Step1WelcomeProps {
  onNext: () => void;
}

export function Step1Welcome({ onNext }: Step1WelcomeProps) {
  return (
    <div className="card animate-in fade-in zoom-in duration-500">
      <div className="text-center space-y-8 py-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl shadow-xl mb-4">
          <Activity className="w-10 h-10 text-white" />
        </div>
        
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Подберём программу под вашу ситуацию
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Ответьте на 5 вопросов — это займёт 2 минуты.
            <br />
            После этого вы получите персональную рекомендацию.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-green-600" />
            <span>Персональный подход</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            <span>Опытные инструкторы</span>
          </div>
        </div>

        <button onClick={onNext} className="btn-primary text-lg px-12">
          НАЧАТЬ
          <ArrowRight className="ml-2 w-5 h-5 inline" />
        </button>
      </div>
    </div>
  );
}
