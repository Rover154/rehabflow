'use client';
import { useAnswersStore } from '@/stores/useAnswersStore';
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, MessageCircle, RefreshCcw, Phone, Book } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ResultScreen() {
  const answers = useAnswersStore();
  const router = useRouter();
  const [botUrl, setBotUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Формируем URL для бота с данными в start параметре
    const botUsername = 'cigunrehab_bot';

    // Формируем компактные данные для бота (только ключевые поля)
    const startData = {
      n: answers.patientInfo.name || '',
      a: answers.patientInfo.age || '',
      d: answers.diagnoses || [],
      t: answers.time || '',
      s: answers.symptoms || [],
      f: answers.format || '',
    };

    // Кодируем в base64 для компактности
    const jsonString = JSON.stringify(startData);
    const base64Data = btoa(unescape(encodeURIComponent(jsonString)));
    
    setBotUrl(`https://t.me/${botUsername}?start=${base64Data}`);
  }, [answers]);

  const handleGenerateFullComplex = async () => {
    setIsGenerating(true);
    try {
      // Используем email из store или rover38354@gmail.com по умолчанию
      const targetEmail = answers.email || 'rover38354@gmail.com';
      
      const response = await fetch('/api/generate-complex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: answers.patientInfo.name,
          age: answers.patientInfo.age,
          diagnoses: answers.diagnoses,
          symptoms: answers.symptoms,
          time: answers.time,
          format: answers.format,
          contact: answers.contact,
          email: targetEmail,
        }),
      });

      const result = await response.json();

      console.log('API Response:', response.status, result);

      if (!response.ok) {
        throw new Error(result.error || result.details || 'Ошибка генерации');
      }

      alert(`✅ Полный комплекс упражнений сгенерирован и отправлен на email: ${targetEmail}`);
    } catch (error) {
      console.error('Ошибка генерации:', error);
      alert(`❌ Не удалось сгенерировать комплекс: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const isSelfFormat = answers.format === 'self';

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50/30">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-green-600 text-white rounded-2xl text-2xl sm:text-3xl mb-3 sm:mb-4">
            ✓
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">
            {answers.patientInfo.name ? `${answers.patientInfo.name}, ваша программа готова!` : 'Ваша программа готова!'}
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Спасибо за заполнение анкеты
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-6 md:p-10 mb-4 sm:mb-6">
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
                
                <div className="bg-green-50 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
                  <h3 className="font-semibold text-base sm:text-lg mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                    Что включено:
                  </h3>
                  <ul className="space-y-2 text-gray-700 text-sm sm:text-base">
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

                <div className="bg-blue-50 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 text-center">
                  <p className="text-xl sm:text-2xl font-bold text-blue-900 mb-2">299 ₽</p>
                  <p className="text-xs sm:text-sm text-gray-600">Методичка в формате PDF</p>
                </div>

                {/* Кнопка перехода в бот */}
                <Button
                  size="lg"
                  className="w-full h-auto min-h-[64px] py-3 px-4 text-base sm:text-lg bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-lg mb-4"
                  onClick={() => window.open(botUrl, '_blank')}
                >
                  <Download className="mr-2 h-5 w-5 flex-shrink-0" />
                  <div className="flex flex-col leading-tight">
                    <span>Получить бесплатную</span>
                    <span>версию через бот</span>
                  </div>
                </Button>

                <p className="text-xs text-center text-gray-500 mb-6">
                  Бот сгенерирует программу и выдаст
				  результат бесплатно на три упражнения
                </p>

                <div className="border-t pt-4 sm:pt-6">
                  <p className="text-center text-gray-600 mb-4 text-sm sm:text-base">
                    Полный комплекс из 10-15 упражнений с картинками
                  </p>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full h-auto min-h-[48px] border-green-600 text-green-700 hover:bg-green-50"
                    onClick={handleGenerateFullComplex}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Генерация комплекса...
                      </>
                    ) : (
                      'Сгенерировать полный комплекс (299₽)'
                    )}
                  </Button>
                  <p className="text-xs text-center text-gray-500 mt-3">
                    PDF будет отправлен на ваш email
                  </p>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-700 mb-6">
                  Мы получили вашу заявку и свяжемся с вами в ближайшее время для уточнения деталей.
                </p>
                
                <div className="bg-green-50 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
                  <h3 className="font-semibold text-base sm:text-lg mb-3">Ваш выбор:</h3>
                  <p className="text-gray-700 text-sm sm:text-base">
                    {answers.format === 'online' && 'Занятия с инструктором онлайн'}
                    {answers.format === 'personal' && 'Личные занятия в Новосибирске'}
                    {answers.format === 'help' && 'Помощь в выборе формата'}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="border-t pt-4 sm:pt-6">
            <h3 className="font-semibold mb-4 text-center text-sm sm:text-base">Свяжитесь с нами:</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 h-12 text-sm sm:text-base"
                onClick={() => window.open('tel:+79537902010', '_blank')}
              >
                <Phone className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                +7 953 790 20 10
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="flex-1 h-12 text-sm sm:text-base"
                onClick={() => window.open('https://t.me/cigunrehab', '_blank')}
              >
                <MessageCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                @cigunrehab
              </Button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            variant="outline"
            size="lg"
            className="w-full h-auto min-h-[56px] py-3 px-4 border-purple-600 text-purple-700 hover:bg-purple-50"
            onClick={() => {
              const link = document.createElement('a');
              link.href = '/cigun/cigun.zip';
              link.download = 'cigun.zip';
              link.click();
            }}
          >
            <Book className="mr-2 h-5 w-5 flex-shrink-0" />
            <span className="text-center leading-snug text-sm sm:text-base">Скачать книгу «300 вопросов о цигун»</span>
          </Button>

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
    </div>
  );
}
