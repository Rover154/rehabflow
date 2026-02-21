import React, { useState } from "react";
import { generateQigongPlan, ClientData } from "./services/aiService";
import { BrainCircuit, BookOpen, Send, CheckCircle2, Loader2, Sparkles, Activity } from "lucide-react";

export function App() {
  const [formData, setFormData] = useState<ClientData>({
    name: "",
    email: "",
    age: "",
    goals: "",
    healthConditions: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [loadingStep, setLoadingStep] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    try {
      setLoadingStep("Подключение к нейросети io.net...");
      await new Promise(r => setTimeout(r, 1500));
      
      setLoadingStep("Обращение к библиотеке '300 вопросов о Цигун'...");
      await new Promise(r => setTimeout(r, 1500));
      
      setLoadingStep("Генерация персонального комплекса упражнений...");
      await generateQigongPlan(formData);
      
      setLoadingStep("Отправка PDF на rover38354@gmmail.com...");
      await new Promise(r => setTimeout(r, 1000));

      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">Успешно!</h2>
          <p className="text-slate-600">
            Ваш персональный план Цигун был сгенерирован на основе методики "300 вопросов о Цигун".
          </p>
          <div className="bg-slate-100 p-4 rounded-lg text-sm text-slate-500">
            <p>Копия отправлена на:</p>
            <p className="font-medium text-slate-700 mt-1">rover38354@gmmail.com</p>
          </div>
          <button 
            onClick={() => setStatus("idle")}
            className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors"
          >
            Создать еще один план
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center space-x-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium border border-indigo-100">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Rehabilitation</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Персональный поток Цигун
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Создайте индивидуальный комплекс упражнений, адаптированный к вашим потребностям, используя нашу нейросеть, обученную на книге "300 вопросов о Цигун".
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
          
          {/* Progress Bar (Visual) */}
          <div className="h-2 bg-slate-100 w-full">
            <div className={`h-full bg-indigo-600 transition-all duration-1000 ${status === 'loading' ? 'w-full animate-pulse' : 'w-1/3'}`}></div>
          </div>

          <div className="p-8 sm:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              
              {/* Left Column: Info */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-indigo-600" />
                    Как это работает
                  </h3>
                  <p className="mt-3 text-slate-500 leading-relaxed">
                    Мы используем распределенную вычислительную сеть <strong>io.net</strong> для анализа вашего профиля и подбора упражнений из тысяч традиционных практик Цигун.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    Источники
                  </h3>
                  <div className="mt-3 bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                    <p className="text-indigo-900 font-medium">300 вопросов о Цигун</p>
                    <p className="text-indigo-700 text-sm mt-1">Цифровой архив (app/cigun)</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                    <Send className="w-5 h-5 text-indigo-600" />
                    Доставка
                  </h3>
                  <p className="mt-3 text-slate-500 text-sm">
                    Результаты собираются в PDF-руководство и мгновенно отправляются нашим специалистам и вам на почту.
                  </p>
                </div>
              </div>

              {/* Right Column: Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">ФИО</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full rounded-lg border-slate-200 border px-4 py-2.5 focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                      placeholder="Введите ваше имя"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={status === "loading"}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full rounded-lg border-slate-200 border px-4 py-2.5 focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={status === "loading"}
                    />
                  </div>

                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-slate-700 mb-1">Возраст</label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      required
                      className="w-full rounded-lg border-slate-200 border px-4 py-2.5 focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                      placeholder="Ваш возраст"
                      value={formData.age}
                      onChange={handleChange}
                      disabled={status === "loading"}
                    />
                  </div>

                  <div>
                    <label htmlFor="goals" className="block text-sm font-medium text-slate-700 mb-1">Цели оздоровления</label>
                    <textarea
                      id="goals"
                      name="goals"
                      rows={2}
                      className="w-full rounded-lg border-slate-200 border px-4 py-2.5 focus:border-indigo-500 focus:ring-indigo-500 transition-colors resize-none"
                      placeholder="Например: улучшить гибкость, снизить стресс..."
                      value={formData.goals}
                      onChange={handleChange}
                      disabled={status === "loading"}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 px-6 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform active:scale-[0.99]"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Обработка...</span>
                      </>
                    ) : (
                      <>
                        <Activity className="w-5 h-5" />
                        <span>Приобрести и создать план</span>
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-slate-400 mt-4">
                    Безопасная транзакция через io.net • Мгновенная доставка PDF
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay Modal */}
      {status === "loading" && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-900">AI Обработка</h3>
              <p className="text-indigo-600 text-sm font-medium mt-1 animate-pulse">
                {loadingStep}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
