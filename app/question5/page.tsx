'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useAnswersStore } from '@/stores/useAnswersStore';
import { useStep } from '@/hooks/useStep';
import ProgressBar from '@/components/ProgressBar';

export default function Question5Screen() {
  const { name, contact, comment, setContactData, reset: resetForm } = useAnswersStore();
  const { goNext } = useStep();

  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isPhone = (v: string) => {
    const cleaned = v.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 12; // RU/EU формат
  };

  const isContactValid = contact.trim().length >= 7 && (isEmail(contact) || isPhone(contact));
  const isNameValid = name.trim().length >= 2;
  const isValid = isNameValid && isContactValid && agreed && !isSubmitting;

  const handleSubmit = async () => {
    if (!isValid) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        name: name.trim(),
        contact: contact.trim(),
        comment: comment.trim(),
        diagnosis: useAnswersStore.getState().diagnosis,
        time: useAnswersStore.getState().time,
        symptoms: useAnswersStore.getState().symptoms,
        format: useAnswersStore.getState().format,
        submittedAt: new Date().toISOString(),
      };

      const res = await fetch('/api/submit-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Ошибка сервера');

      toast.success('Рекомендация отправлена!', {
        description: 'Мы свяжемся с вами в ближайшее время',
        duration: 5000,
      });

      resetForm(); // очищаем форму после успеха
      goNext();    // → экран результата

    } catch (err: any) {
      const msg = err.message?.includes('Network')
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
      <ProgressBar currentStep={5} />

      <div className="flex-1 max-w-md mx-auto px-5 pt-8 pb-12">
        <h2 className="text-2xl font-semibold mb-8 text-center">
          Как с вами связаться?
        </h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">Имя</label>
            <Input
              value={name}
              onChange={e => setContactData({ name: e.target.value })}
              placeholder="Иван Иванов"
              disabled={isSubmitting}
              className="h-12"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Телефон или Email</label>
            <Input
              value={contact}
              onChange={e => {
                // Простая маска телефона (RU стиль)
                let val = e.target.value.replace(/\D/g, '');
                if (val.startsWith('7') || val.startsWith('8')) val = val.slice(1);
                val = val.slice(0, 10);
                const masked = val.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 ($2) $3-$4');
                setContactData({ contact: val.length > 0 ? `+7${masked}` : '' });
              }}
              placeholder="+7 (___) ___-__-__"
              disabled={isSubmitting}
              className="h-12 font-mono"
            />
            {!isContactValid && contact && (
              <p className="text-xs text-red-600 mt-1">
                Укажите корректный телефон или email
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Комментарий (необязательно)</label>
            <Textarea
              value={comment}
              onChange={e => setContactData({ comment: e.target.value })}
              placeholder="Дополнительные пожелания..."
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="agree"
              checked={agreed}
              onCheckedChange={setAgreed}
              disabled={isSubmitting}
            />
            <label htmlFor="agree" className="text-sm text-gray-600 leading-tight">
              Согласен на обработку персональных данных
            </label>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 rounded-2xl text-red-800 text-sm">
            {error}
          </div>
        )}

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            onClick={() => history.back()}
            disabled={isSubmitting}
            className="flex-1 h-12"
          >
            ← Назад
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            className="flex-1 h-12 bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? 'Отправка...' : 'Получить рекомендацию →'}
          </Button>
        </div>
      </div>
    </div>
  );
}