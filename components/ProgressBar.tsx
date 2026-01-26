// components/ProgressBar.tsx
'use client';
import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  currentStep: number;
}

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  const percentage = Math.round((currentStep / 5) * 100);

  return (
    <div className="px-6 pt-8">
      <Progress value={percentage} className="h-1.5 bg-gray-100" />
      <div className="flex justify-between text-xs text-gray-400 mt-1.5 px-1">
        <span>Шаг {currentStep} из 5</span>
        <span>{percentage}%</span>
      </div>
    </div>
  );
}