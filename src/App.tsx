import { useState } from 'react';
import { Step1Welcome } from './components/Step1Welcome';
import { Step2PersonalInfo } from './components/Step2PersonalInfo';
import { Step3Condition } from './components/Step3Condition';
import { Step4TimeFrame } from './components/Step4TimeFrame';
import { Step5Specifics } from './components/Step5Specifics';
import { Step6Contraindications } from './components/Step6Contraindications';
import { Step7Format } from './components/Step7Format';
import { Step8Contact } from './components/Step8Contact';
import { Step9Result } from './components/Step9Result';
import { FormData, initialData } from './types';

export function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [isBuying, setIsBuying] = useState(false);

  const updateData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleStep4Next = (timePassed: string) => {
    updateData({ timePassed });
    const needsSpecifics = formData.conditions.some((c) =>
      ['stroke', 'heart_attack', 'trauma'].includes(c)
    );
    setStep(needsSpecifics ? 5 : 6);
  };

  const handleTelegramSend = async (data: FormData) => {
    const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.warn('Telegram Token или Chat ID не заданы');
      return;
    }

    const conditionLabels: Record<string, string> = {
      stroke: 'Инсульт',
      heart_attack: 'Инфаркт',
      trauma: 'Травма',
      chronic: 'Хроническое заболевание',
      other: 'Другое',
    };

    const formatLabels: Record<string, string> = {
      self: 'Самостоятельно по методичке',
      online: 'С инструктором онлайн',
      personal: 'Личные занятия в Новосибирске',
      dont_know: 'Не знаю, помогите выбрать',
    };

    const chronicLabels: Record<string, string> = {
      hypertension: 'Гипертония',
      asthma: 'Астма',
      diabetes: 'Диабет',
      other: 'Другое',
    };

    const traumaAreaLabels: Record<string, string> = {
      arm: 'Рука / плечо',
      leg: 'Нога / колено / голеностоп',
      back: 'Спина / позвоночник',
      neck: 'Шея',
      hip: 'Тазобедренный сустав',
      other: 'Другое',
    };

    const message = `
🔔 *Новая заявка на реабилитацию*

👤 *Клиент:* ${data.name}
📱 *Телефон:* ${data.phone}
✉️ *Email:* ${data.email}

📊 *Анкета:*
- Возраст: ${data.age} лет
- Рост/Вес: ${data.height} см / ${data.weight} кг
- Ситуация: ${data.conditions.map(c => conditionLabels[c] || c).join(', ')}
${data.otherConditionDetails ? `- Описание ситуации: ${data.otherConditionDetails}` : ''}
- Время прошло: ${data.timePassed}
${data.strokeSymptoms && data.strokeSymptoms.length > 0 ? `- Симптомы (инсульт): ${data.strokeSymptoms.join(', ')}` : ''}
${data.heartAttackSymptoms && data.heartAttackSymptoms.length > 0 ? `- Симптомы (инфаркт): ${data.heartAttackSymptoms.join(', ')}` : ''}
${data.traumaArea ? `- Область травмы: ${traumaAreaLabels[data.traumaArea] || data.traumaArea}${data.traumaOtherDetails ? ` (${data.traumaOtherDetails})` : ''}` : ''}
${data.chronicDiseases.length > 0 ? `- Хронические заболевания: ${data.chronicDiseases.map(c => chronicLabels[c] || c).join(', ')}` : ''}
${data.chronicOtherDetails ? `- Описание хронических: ${data.chronicOtherDetails}` : ''}
- Формат: ${formatLabels[data.format] || data.format}
${data.comment ? `- 💬 Комментарий: ${data.comment}` : ''}

📅 ${new Date().toLocaleString('ru-RU')}
    `.trim();

    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown',
        }),
      });
      console.log('✅ Отправлено в Telegram');
    } catch (error) {
      console.error('Ошибка Telegram:', error);
    }
  };

  const handleBuy = async () => {
    if (isBuying) return;
    setIsBuying(true);
    try {
      const conditionLabels: Record<string, string> = {
        stroke: 'Инсульт',
        heart_attack: 'Инфаркт',
        trauma: 'Травма',
        chronic: 'Хроническое заболевание',
        other: 'Другое',
      };

      const formatLabels: Record<string, string> = {
        self: 'Самостоятельно по методичке',
        online: 'С инструктором онлайн',
        personal: 'Личные занятия в Новосибирске',
        dont_know: 'Не знаю, помогите выбрать',
      };

      const chronicLabels: Record<string, string> = {
        hypertension: 'Гипертония',
        asthma: 'Астма',
        diabetes: 'Диабет',
        other: 'Другое',
      };

      const traumaAreaLabels: Record<string, string> = {
        arm: 'Рука / плечо',
        leg: 'Нога / колено / голеностоп',
        back: 'Спина / позвоночник',
        neck: 'Шея',
        hip: 'Тазобедренный сустав',
        other: 'Другое',
      };

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: formData.name,
          clientEmail: formData.email,
          phone: formData.phone,
          age: formData.age,
          height: formData.height,
          weight: formData.weight,
          conditions: formData.conditions.map((c: string) => conditionLabels[c] || c).join(', '),
          otherDetails: formData.otherConditionDetails,
          timePassed: formData.timePassed,
          strokeSymptoms: formData.strokeSymptoms,
          heartAttackSymptoms: formData.heartAttackSymptoms,
          traumaArea: formData.traumaArea ? traumaAreaLabels[formData.traumaArea] || formData.traumaArea : '',
          traumaOtherDetails: formData.traumaOtherDetails,
          chronicDiseases: formData.chronicDiseases.map((c: string) => chronicLabels[c] || c).join(', '),
          chronicOtherDetails: formData.chronicOtherDetails,
          format: formatLabels[formData.format] || formData.format,
          comment: formData.comment,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Не удалось отправить письмо');
      }

      alert('Спасибо! Ваша персональная программа отправлена на email и инструктору.');
    } catch (error) {
      console.error('Ошибка отправки email:', error);
      alert('Ошибка отправки письма. Попробуйте позже или свяжитесь с нами по телефону.');
    } finally {
      setIsBuying(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1Welcome onNext={nextStep} />;
      case 2:
        return <Step2PersonalInfo onNext={(data) => { updateData(data); nextStep(); }} onBack={prevStep} />;
      case 3:
        return <Step3Condition onNext={(conditions, otherDetails) => { updateData({ conditions, otherConditionDetails: otherDetails }); nextStep(); }} onBack={prevStep} />;
      case 4:
        return <Step4TimeFrame onNext={handleStep4Next} onBack={prevStep} />;
      case 5:
        return <Step5Specifics conditions={formData.conditions} onNext={(data) => { updateData(data); nextStep(); }} onBack={prevStep} />;
      case 6:
        return <Step6Contraindications onNext={(conditions, otherDetails) => { updateData({ chronicDiseases: conditions, chronicOtherDetails: otherDetails }); nextStep(); }} onBack={prevStep} />;
      case 7:
        return <Step7Format onNext={(format) => { updateData({ format }); nextStep(); }} onBack={prevStep} />;
      case 8:
        return <Step8Contact initialName={formData.name} onNext={(data) => { const finalData = { ...formData, ...data }; updateData(data); handleTelegramSend(finalData); nextStep(); }} onBack={prevStep} />;
      case 9:
        return <Step9Result name={formData.name} onBuy={handleBuy} isBuying={isBuying} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col">
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 py-4 px-6 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Второе Дыхание" className="w-10 h-10 rounded-xl shadow-lg" />
            <span className="font-bold text-xl text-gray-800">Второе Дыхание</span>
          </div>
          {step > 1 && step < 9 && (
            <div className="text-sm font-medium text-gray-500">
              Шаг {step} / 8
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {renderStep()}
        </div>
      </main>

      <footer className="bg-white/80 border-t border-green-100 py-6 text-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Второе Дыхание. Все права защищены.</p>
        <p className="mt-1">📞 +7 (953) 790-20-10</p>
      </footer>
    </div>
  );
}

export default App;
