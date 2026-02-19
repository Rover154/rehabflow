// components/ProgressBar.tsx
'use client';

interface ProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

export default function ProgressBar({ currentStep, totalSteps = 7 }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;
  
  // Градиент от красного к зеленому
  const getColor = (percent: number) => {
    if (percent < 33) return 'from-red-500 to-orange-500';
    if (percent < 66) return 'from-orange-500 to-yellow-500';
    return 'from-yellow-500 to-green-500';
  };

  return (
    <div className="w-full bg-gray-100 h-1.5">
      <div
        className={`h-full bg-gradient-to-r ${getColor(progress)} transition-all duration-500 ease-out`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
