'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useAnswersStore } from '@/stores/useAnswersStore';
import { useRouter } from 'next/navigation';
import ProgressBar from '@/components/ProgressBar';

export default function Question5Screen() {
  const store = useAnswersStore();
  const { contact, email: storeEmail, comment, setContactData } = store;
  const router = useRouter();

  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState(storeEmail || '');

  const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isPhone = (v: string) => {
    const cleaned = v.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 12;
  };

  const isContactValid = contact.trim().length >= 7 && (isEmail(contact) || isPhone(contact));
  const isValid = isContactValid && agreed && !isSubmitting && email.trim().length > 0 && isEmail(email);

  const handleSubmit = async () => {
    if (!isValid) return;

    setIsSubmitting(true);
    setError(null);

    // Сохраняем email в store
    setContactData({ email: email.trim() });

    try {
      // Отправляем данные в Telegram
      const telegramRes = await fetch('/api/send-to-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientInfo: store.patientInfo,
          diagnoses: store.diagnoses,
          otherDescription: store.otherDescription,
          time: store.time,
          symptoms: store.symptoms,
          chronicDiseases: store.chronicDiseases,
          contraindications: store.contraindications,
          format: store.format,
          contact: contact.trim(),
          email: email.trim(),
          comment: comment.trim(),
        }),
      });

      if (!telegramRes.ok) {
        console.error('Failed to send to Telegram');
      }

      // Отправляем данные на старый endpoint (если нужно)
      const res = await fetch('/api/submit-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...store,
          contact: contact.trim(),
          email: email.trim(),
          comment: comment.trim(),
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error('Ошибка сервера');

      toast.success('Рекомендация отправлена!', {
        description: 'Мы свяжемся с вами в ближайшее время',
        duration: 5000,
      });

      router.push('/result');

    } catch (err: unknown) {
      const msg = (err as Error).message?.includes('Network')
        ? 'Нет соединения. Проверьте интернет.'
        : 'Не удалось отправить. Попробуйте ещё раз.';

      setError(msg);
      toast.error('Ошибка', { description: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ProgressBar currentStep={7} />

      <div className="flex-1 max-w-md mx-auto px-4 sm:px-5 py-4 sm:py-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-center">
          Как с вами связаться?
        </h2>
        <p className="text-center text-gray-600 mb-4 sm:mb-6 text-sm">
          Мы отправим персональную программу на ваш контакт
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Телефон или Email</label>
            <Input
              value={contact}
              onChange={e => setContactData({ contact: e.target.value })}
              placeholder="+7 (___) ___-__-__ или email@example.com"
              disabled={isSubmitting}
              className="h-12 text-base"
            />
            {!isContactValid && contact && (
              <p className="text-xs text-red-600 mt-1">
                Укажите корректный телефон или email
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Email для получения методички <span className="text-red-500">*</span>
            </label>
            <Input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="example@mail.ru"
              type="email"
              disabled={isSubmitting}
              className="h-12 text-base"
              required
            />
            {email && !isEmail(email) && (
              <p className="text-xs text-red-600 mt-1">
                Введите корректный email
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Комментарий <span className="text-gray-400">(по желанию)</span>
            </label>
            <Textarea
              value={comment}
              onChange={e => setContactData({ comment: e.target.value })}
              placeholder="Дополнительные пожелания или вопросы..."
              rows={3}
              disabled={isSubmitting}
              className="text-base"
            />
          </div>

          <div className="flex items-start gap-3 pt-2">
            <Checkbox
              id="agree"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
              disabled={isSubmitting}
              className="mt-1"
            />
            <label htmlFor="agree" className="text-sm text-gray-600 leading-snug cursor-pointer">
              Согласен на обработку персональных данных
            </label>
          </div>
        </div>

        {error && (
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-red-50 rounded-2xl text-red-800 text-sm">
            {error}
          </div>
        )}

        <div className="mt-6 sm:mt-8 flex flex-col gap-3">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="w-full h-12 text-base"
            size="lg"
          >
            ← Назад
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            className="w-full h-12 bg-green-600 hover:bg-green-700 text-base font-medium"
            size="lg"
          >
            {isSubmitting ? 'Отправка...' : 'Получить рекомендацию →'}
          </Button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          Ваши данные защищены и не передаются третьим лицам
        </p>
      </div>
    </div>
  );
}
