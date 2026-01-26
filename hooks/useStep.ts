// hooks/useStep.ts
'use client';
import { useRouter, usePathname } from 'next/navigation';

const stepRoutes = [
  '/',                    // 0 — старт
  '/question1',           // 1
  '/question2',           // 2
  '/question3',           // 3
  '/question4',           // 4
  '/question5',           // 5
  '/result'               // 6
];

export function useStep() {
  const router = useRouter();
  const pathname = usePathname();

  const currentIndex = stepRoutes.findIndex(route => route === pathname);
  const currentStep = Math.max(currentIndex, 0); // 1–5 для вопросов

  const goNext = () => {
    if (currentIndex < stepRoutes.length - 1) {
      router.push(stepRoutes[currentIndex + 1]);
    }
  };

  const goBack = () => {
    if (currentIndex > 1) {
      router.push(stepRoutes[currentIndex - 1]);
    } else {
      router.push('/');
    }
  };

  return {
    currentStep: Math.min(currentStep, 5),
    goNext,
    goBack,
    isLastStep: currentIndex === 5
  };
}