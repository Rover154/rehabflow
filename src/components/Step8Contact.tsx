import { useState } from 'react';
import { ArrowRight, ArrowLeft, User, Phone, Mail, MessageSquare, CheckSquare, Loader } from 'lucide-react';
import { validateName, validatePhone, validateEmail } from '../utils/validate';

interface Step8ContactProps {
  initialName: string;
  onNext: (data: { name: string; phone: string; email: string; comment: string; consent: boolean }) => void;
  onBack?: () => void;
}

export function Step8Contact({ initialName, onNext, onBack }: Step8ContactProps) {
  const [data, setData] = useState({ name: initialName, phone: '', email: '', comment: '', consent: false });
  const [errors, setErrors] = useState<Partial<typeof data>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<typeof data> = {};
    if (!validateName(data.name)) newErrors.name = 'Введите ваше имя';
    if (!validatePhone(data.phone)) newErrors.phone = 'Введите корректный номер телефона';
    if (!validateEmail(data.email)) newErrors.email = 'Введите корректный email';
    if (!data.consent) newErrors.consent = true as any;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      onNext(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Как с вами связаться для отправки рекомендации?</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Ваше имя *</label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input type="text" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} className={`block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 outline-none ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'}`} />
          </div>
          {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Телефон *</label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input type="tel" placeholder="+7 (999) 000-00-00" value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} className={`block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 outline-none ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'}`} />
          </div>
          {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Email для получения методички *</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input type="email" placeholder="example@mail.ru" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} className={`block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 outline-none ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'}`} />
          </div>
          {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Комментарий (по желанию)</label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <textarea rows={3} value={data.comment} onChange={(e) => setData({ ...data, comment: e.target.value })} className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 outline-none" />
          </div>
        </div>

        <div className="flex items-start">
          <button type="button" onClick={() => setData({ ...data, consent: !data.consent })} className={`flex-shrink-0 h-6 w-6 rounded border transition-colors flex items-center justify-center mt-0.5 ${data.consent ? 'bg-green-600 border-green-600 text-white' : 'border-gray-300 bg-white'} ${errors.consent ? 'ring-2 ring-red-500' : ''}`}>
            {data.consent && <CheckSquare className="h-4 w-4" />}
          </button>
          <div className="ml-3 text-sm">
            <label onClick={() => setData({ ...data, consent: !data.consent })} className="font-medium text-gray-700 cursor-pointer">Согласен на обработку персональных данных</label>
            {errors.consent && <p className="text-red-600 text-xs mt-1">Необходимо согласие</p>}
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          {onBack && <button type="button" onClick={onBack} className="btn-secondary flex-1 flex items-center justify-center"><ArrowLeft className="mr-2 w-5 h-5" /> Назад</button>}
          <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 flex items-center justify-center font-bold uppercase">
            {isSubmitting ? <Loader className="w-5 h-5 animate-spin mr-2" /> : <ArrowRight className="ml-2 w-5 h-5" />}
            {isSubmitting ? 'ОТПРАВКА...' : 'ПОЛУЧИТЬ РЕКОМЕНДАЦИЮ'}
          </button>
        </div>
      </form>
    </div>
  );
}
