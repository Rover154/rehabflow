import { useState } from 'react';
import { ArrowRight, ArrowLeft, Clock } from 'lucide-react';

interface Step4TimeFrameProps {
  onNext: (timePassed: string) => void;
  onBack?: () => void;
}

const timeOptions = [
  { id: 'acute', label: 'Меньше 1 месяца (острый период)' },
  { id: '1-3', label: '1–3 месяца' },
  { id: '3-6', label: '3–6 месяцев' },
  { id: '6-12', label: '6–12 месяцев' },
  { id: '1yplus', label: 'Больше года' },
];

export function Step4TimeFrame({ onNext, onBack }: Step4TimeFrameProps) {
  const [selected, setSelected] = useState('');

  const handleSubmit = () => {
    if (!selected) return;
    onNext(selected);
  };

  return (
    <div className="card animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">Сколько времени прошло?</h2>
      <p className="text-center text-gray-500 mb-6">С момента события или лечения</p>

      <div className="space-y-3 mb-8">
        {timeOptions.map(({ id, label }) => (
          <div key={id} onClick={() => setSelected(id)} className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${selected === id ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-500'}`}>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected === id ? 'border-green-600' : 'border-gray-300'}`}>
              {selected === id && <div className="w-2.5 h-2.5 rounded-full bg-green-600" />}
            </div>
            <Clock className={`w-5 h-5 ${selected === id ? 'text-green-600' : 'text-gray-400'}`} />
            <span className={`text-gray-700 ${selected === id ? 'font-medium' : ''}`}>{label}</span>
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
