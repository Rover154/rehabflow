// components/ClientWrapper.tsx
'use client';

import { usePathname } from 'next/navigation';
import ProgressBar from '@/components/ProgressBar';
import { ReactNode } from 'react';

const stepPages = ['/question0', '/question1', '/question2', '/question3', '/question4', '/question5', '/question6'];

export default function ClientWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showProgress = stepPages.includes(pathname);
  const currentStep = showProgress ? stepPages.indexOf(pathname) + 1 : 0;

  return (
    <>
      {showProgress && <ProgressBar currentStep={currentStep} />}
      <main className="min-h-screen">{children}</main>
    </>
  );
}