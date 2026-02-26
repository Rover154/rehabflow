import { useState } from 'react';
import { ArrowRight, ArrowLeft, Book, Video, Users, HelpCircle } from 'lucide-react';

interface Step7FormatProps {
  onNext: (format: string) => void;
  onBack?: () => void;
}

const formatOptions = [
  { id: 'self', icon: Book, title: 'Самостоятельно по методичке', desc: 'Занимаюсь сам дома, нужны инструкции' },
  { id: 'online', icon: Video, title: 'С инструктором онлайн', desc: 'Нужен контроль и обратная связь' },
  { id: 'personal', icon: Users, title: 'Личные занятия в Новосибирске', desc: 'Живу в Новосибирске, хочу лично' },
  { id: 'dont_know', icon: HelpCircle, title: 'Не знаю, помогите выбрать', desc: '' },
];

export function Step7Format({ onNext, onBack }: Step7FormatProps) {
  const [selected, setSelected] = useState('');

  const handleSubmit = () => {
    if (!selected) return;
    onNext(selected);
  };

  return (
    <div className="card animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">Какой формат занятий удобнее?</h2>
      <p className="text-center text-gray-500 mb-6">Выберите один вариант</p>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {formatOptions.map(({ id, icon: Icon, title, desc }) => (
          <div key={id} onClick={() => setSelected(id)} className={`option-card flex flex-col items-start text-left min-h-[140px] ${selected === id ? 'selected' : ''}`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${selected === id ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
              <Icon className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
            {desc && <p className="text-sm text-gray-500">{desc}</p>}
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-6 justify-center">
        {onBack && <button type="button" onClick={onBack} className="btn-secondary flex-1 max-w-xs flex items-center justify-center"><ArrowLeft className="mr-2 w-5 h-5 inline" /> Назад</button>}
        <button type="button" onClick={handleSubmit} disabled={!selected} className="btn-primary flex-1 max-w-xs flex items-center justify-center">Далее <ArrowRight className="ml-2 w-5 h-5 inline" /></button>
      </div>
    </div>
  );
}
