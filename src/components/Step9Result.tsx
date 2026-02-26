import { CheckCircle, Mail, MessageCircle } from 'lucide-react';

interface Step9ResultProps {
  name: string;
  onBuy: () => void;
}

export function Step9Result({ name, onBuy }: Step9ResultProps) {
  return (
    <div className="card animate-in fade-in zoom-in duration-500 text-center">
      <div className="mb-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{name}, ваша программа готова!</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Спасибо за заполнение анкеты. Мы подготовим для вас персональный комплекс из 10-15 упражнений для самостоятельных занятий.
        </p>
      </div>

      <div className="space-y-4 max-w-sm mx-auto">
        <button onClick={onBuy} className="btn-primary w-full text-lg">
          <Mail className="mr-2 w-5 h-5 inline" />
          ПРИОБРЕСТИ МЕТОДИЧКУ за 299 руб.
        </button>

        <a href="https://t.me/cigunrehab_bot" target="_blank" rel="noopener noreferrer" className="btn-secondary w-full flex items-center justify-center">
          <MessageCircle className="mr-2 w-5 h-5" />
          ПОЛУЧИТЬ БЕСПЛАТНО
        </a>
        <p className="text-xs text-gray-500">с помощью Telegram бота 3-4 простых упражнения</p>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500">Если есть вопросы — свяжитесь с нами:</p>
        <a href="tel:+79537902010" className="text-lg font-semibold text-green-600 hover:text-green-700">8-953-790-20-10</a>
      </div>
    </div>
  );
}
