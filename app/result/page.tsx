'use client';
import { useAnswersStore } from '@/stores/useAnswersStore';
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, MessageCircle, RefreshCcw, Phone } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ResultScreen() {
  const answers = useAnswersStore();
  const router = useRouter();
  const [botUrl, setBotUrl] = useState('');

  useEffect(() => {
    // Формируем URL для бота с данными
    const botUsername = 'cigunrehab_bot';
    const startParam = encodeURIComponent(JSON.stringify({
      name: answers.patientInfo.name,
      age: answers.patientInfo.age,
      diagnoses: answers.diagnoses,
      time: answers.time,
      symptoms: answers.symptoms,
      format: answers.format,
    }));
    
    setBotUrl(`https://t.me/${botUsername}?start=${startParam}`);
  }, [answers]);

  const isSelfFormat = answers.format === 'self';

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50/30">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-2xl text-3xl mb-4">
            ✓
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            {answers.patientInfo.name ? `${answers.patientInfo.name}, ваша программа готова!` : 'Ваша программа готова!'}
          </h1>
          <p className="text-lg text-gray-600">
            Спасибо за заполнение анкеты
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 mb-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Что дальше?
            </h2>

            {isSelfFormat ? (
              <>
                <p className="text-gray-700 mb-6">
                  {answers.patientInfo.name && <strong>{answers.patientInfo.name}</strong>} Вы выбрали формат <strong>&quot;Самостоятельно по методичке&quot;</strong>.
                  Мы подготовим для вас персональный комплекс из 10-15 упражнений по цигун.
                </p>
                
                <div className="bg-green-50 rounded-2xl p-6 mb-6">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    Что включено:
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>Персональный комплекс упражнений (10-15 шт)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>Иллюстрации с правильной техникой</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>Подробные описания каждого упражнения</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>Рекомендации по частоте и длительности</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-2xl p-6 mb-6 text-center">
                  <p className="text-2xl font-bold text-blue-900 mb-2">299 ₽</p>
                  <p className="text-sm text-gray-600">Методичка в формате PDF</p>
                </div>

                {/* Кнопка перехода в бот */}
                <Button 
                  size="lg" 
                  className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-lg mb-4"
                  onClick={() => window.open(botUrl, '_blank')}
                >
                  <Download className="mr-2 h-5 w-5" />
                  Скачать бесплатную версию через бот
                </Button>

                <p className="text-xs text-center text-gray-500 mb-6">
                  Бот сгенерирует программу и выдаст результат бесплатно на три упражнения
                </p>

                <div className="border-t pt-6">
                  <p className="text-center text-gray-600 mb-4">
                    Или купите готовую методичку за 299 ₽
                  </p>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="w-full h-12 border-green-600 text-green-700 hover:bg-green-50"
                    onClick={() => window.open('https://t.me/cigunrehab', '_blank')}
                  >
                    Оплатить по СБП
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-700 mb-6">
                  Мы получили вашу заявку и свяжемся с вами в ближайшее время для уточнения деталей.
                </p>
                
                <div className="bg-green-50 rounded-2xl p-6 mb-6">
                  <h3 className="font-semibold text-lg mb-3">Ваш выбор:</h3>
                  <p className="text-gray-700">
                    {answers.format === 'online' && 'Занятия с инструктором онлайн'}
                    {answers.format === 'personal' && 'Личные занятия в Новосибирске'}
                    {answers.format === 'help' && 'Помощь в выборе формата'}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4 text-center">Свяжитесь с нами:</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline"
                size="lg"
                className="flex-1 h-12"
                onClick={() => window.open('tel:+79537902010', '_blank')}
              >
                <Phone className="mr-2 h-5 w-5" />
                +7 953 790 20 10
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                className="flex-1 h-12"
                onClick={() => window.open('https://t.me/cigunrehab', '_blank')}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                @cigunrehab
              </Button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center">
          <Button 
            variant="ghost"
            size="lg"
            className="h-12"
            onClick={() => {
              answers.reset();
              router.push('/');
            }}
          >
            <RefreshCcw className="mr-2 h-5 w-5" />
            Пройти заново
          </Button>
        </div>
      </div>
    </div>
  );
}
