'use client';
import { useAnswersStore } from '@/stores/useAnswersStore';
import { Button } from "@/components/ui/button";
import { getPdfContent } from '@/utils/getPdfContent';
import { Download, MessageCircle, RefreshCcw } from "lucide-react";
import { useRouter } from 'next/navigation';
import { jsPDF } from 'jspdf';
import { useEffect, useState } from 'react';

// Simplified font handling for demo - using standard font or would need to load custom font for Cyrillic
// For this environment, we'll try to use a robust approach or fallback to window.print()
const generatePDF = (content: ReturnType<typeof getPdfContent>) => {
  try {
    const doc = new jsPDF();
    
    // Note: jsPDF default fonts don't support Cyrillic. 
    // In a real production app, we would load a font like Roboto-Regular.ttf
    // For now, we will use a workaround or rely on the user to use "Print to PDF"
    // But let's try to add some content.
    
    doc.setFontSize(20);
    // Transliteration or English fallback would be safer without font files, 
    // but let's try to write text and see if the environment has system fonts or if it shows garbled text.
    // Actually, without a loaded font, Cyrillic will likely be garbled in jsPDF.
    // So we will trigger window.print() as the primary "Download" action for this MVP
    // to ensure the user gets a readable Russian document.
    
    window.print();
  } catch (e) {
    console.error(e);
    window.print();
  }
};

export default function ResultScreen() {
  const answers = useAnswersStore();
  const router = useRouter();
  const [content, setContent] = useState<ReturnType<typeof getPdfContent> | null>(null);

  useEffect(() => {
    setContent(getPdfContent(answers));
  }, [answers]);

  if (!content) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 print:p-0 print:max-w-none">
      {/* Header Buttons (Hidden in Print) */}
      <div className="flex justify-between items-center mb-8 print:hidden">
        <Button variant="ghost" onClick={() => router.push('/')}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          В начало
        </Button>
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-8 sm:p-12 print:shadow-none print:p-0">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{content.title}</h1>
          <p className="text-lg text-green-700 font-medium">{content.subtitle}</p>
        </div>

        <div className="prose max-w-none mb-10 text-gray-600">
          <p className="text-lg leading-relaxed">{content.intro}</p>
        </div>

        <div className="space-y-8">
          <h3 className="text-2xl font-semibold text-gray-800 border-b pb-2">Рекомендуемые упражнения</h3>
          
          {content.exercises.map((ex, i) => (
            <div key={i} className="bg-green-50/50 rounded-2xl p-6 border border-green-100 print:border-gray-200 print:bg-white">
              <h4 className="text-xl font-bold text-green-800 mb-3">{ex.name}</h4>
              <p className="text-gray-700 mb-4">{ex.description}</p>
              <div className="h-40 bg-white border-2 border-dashed border-green-200 rounded-xl flex items-center justify-center text-green-600/50 font-medium">
                {ex.imagePlaceholder}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4 print:hidden">
          <Button 
            size="lg" 
            className="flex-1 bg-green-600 hover:bg-green-700 h-14 text-lg"
            onClick={() => window.print()}
          >
            <Download className="mr-2 h-5 w-5" />
            Скачать методичку (PDF)
          </Button>
          
          <Button 
            size="lg" 
            variant="outline"
            className="flex-1 h-14 text-lg border-green-600 text-green-700 hover:bg-green-50"
            onClick={() => window.open('https://t.me/cigunrehab', '_blank')}
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Записаться на консультацию
          </Button>
        </div>

        {/* Print-only Footer */}
        <div className="hidden print:block mt-10 pt-4 border-t text-center text-sm text-gray-500">
          <p>Скачано с RehabFlow | {content.footer}</p>
        </div>
      </div>
    </div>
  );
}