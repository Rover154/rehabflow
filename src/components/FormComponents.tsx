import { cn } from '../utils/cn';

interface OptionCardProps {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export function OptionCard({ selected, onClick, icon, title, description, className }: OptionCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'option-card flex flex-col items-center justify-center text-center min-h-[140px]',
        selected && 'selected',
        className
      )}
    >
      <div className={cn('w-12 h-12 rounded-full flex items-center justify-center mb-3', selected ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600')}>
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
  );
}

interface RadioOptionProps {
  selected: boolean;
  onClick: () => void;
  label: string;
}

export function RadioOption({ selected, onClick, label }: RadioOptionProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all',
        selected ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-500'
      )}
    >
      <div className={cn('w-5 h-5 rounded-full border-2 flex items-center justify-center', selected ? 'border-green-600' : 'border-gray-300')}>
        {selected && <div className="w-2.5 h-2.5 rounded-full bg-green-600" />}
      </div>
      <span className="text-gray-700">{label}</span>
    </div>
  );
}

interface CheckboxOptionProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

export function CheckboxOption({ checked, onChange, label }: CheckboxOptionProps) {
  return (
    <div
      onClick={onChange}
      className={cn(
        'flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all',
        checked ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-500'
      )}
    >
      <div className={cn('w-5 h-5 rounded border-2 flex items-center justify-center', checked ? 'border-green-600 bg-green-600' : 'border-gray-300')}>
        {checked && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
      </div>
      <span className="text-gray-700">{label}</span>
    </div>
  );
}
