// app/page.tsx
'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import ProgressBar from "@/components/ProgressBar";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50/30 flex flex-col">
      {/* Прогресс-бар (на старте 0%) */}
      <ProgressBar currentStep={0} />

      <div className="flex-1 flex flex-col items-center justify-center px-5 sm:px-6 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full"
        >
          {/* Логотип / заголовок */}
          <div className="mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-2xl text-3xl mb-4">
              氣
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-4">
              Подберём программу<br />под вашу ситуацию
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
              Ответьте на 5 вопросов — это займёт всего 2 минуты.
              <br />
              Получите персональную рекомендацию по цигун-реабилитации.
            </p>
          </div>

          {/* Кнопка старта */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Button
              size="lg"
              className="w-full h-14 sm:h-16 text-lg sm:text-xl font-medium bg-green-600 hover:bg-green-700 rounded-2xl shadow-lg shadow-green-200/50"
              onClick={() => router.push("/question1")}
            >
              НАЧАТЬ
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </motion.div>

          {/* Нижняя подсказка */}
          <p className="text-sm text-gray-500 mt-10">
            Безопасные практики цигун для восстановления после инсульта, инфаркта, травм и операций
          </p>
        </motion.div>
      </div>

      {/* Футер-подсказка */}
      <div className="py-6 text-center text-xs text-gray-400">
        Разработано для мягкой реабилитации · Helsinki 2026
      </div>
    </div>
  );
}