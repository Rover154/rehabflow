// app/api/send-to-telegram/route.ts
import { NextRequest, NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

// Словари для перевода
const diagnosisLabels: Record<string, string> = {
  stroke: 'Инсульт',
  infarct: 'Инфаркт',
  trauma: 'Травма',
  stress: 'Стресс',
  other: 'Другое',
};

const timeLabels: Record<string, string> = {
  acute: 'Острый период (до 1 месяца)',
  '1-3': '1-3 месяца',
  '3-6': '3-6 месяцев',
  '6plus': '6-12 месяцев',
  '1yplus': 'Более года',
  any: 'Любой период',
};

const formatLabels: Record<string, string> = {
  self: 'Самостоятельно по методичке',
  online: 'Занятия с инструктором онлайн',
  personal: 'Личные занятия в Новосибирске',
  help: 'Помощь в выборе формата',
};

const symptomsLabels: Record<string, string> = {
  // Инсульт
  weak_arm: 'Слабость или неподвижность руки',
  weak_leg: 'Слабость или неподвижность ноги',
  balance: 'Проблемы с равновесием / координацией',
  speech: 'Нарушения речи',
  memory: 'Проблемы с памятью / вниманием',
  dizziness: 'Головокружения',
  anxiety: 'Тревожность',
  fatigue: 'Повышенная утомляемость',
  
  // Инфаркт
  dyspnea: 'Одышка при небольшой нагрузке',
  fear_activity: 'Страх физической активности',
  palpitations: 'Учащённое сердцебиение',
  sleep: 'Нарушения сна',
  pressure: 'Повышенное давление',
  chest_pain: 'Боли в груди при нагрузке',
  
  // Травма
  arm: 'Рука / плечо',
  leg: 'Нога / колено / голеностоп',
  back: 'Спина / позвоночник',
  neck: 'Шея',
  hip: 'Тазобедренный сустав',
  multiple: 'Несколько областей',
  
  // Стресс
  tension: 'Мышечное напряжение',
  headaches: 'Головные боли',
  concentration: 'Трудности с концентрацией',
};

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Переводим диагнозы
    const diagnosesText = data.diagnoses?.length > 0
      ? data.diagnoses.map((d: string) => diagnosisLabels[d] || d).join(', ')
      : 'Не указано';

    // Переводим время
    const timeText = data.time ? timeLabels[data.time] || data.time : 'Не указано';

    // Переводим формат
    const formatText = data.format ? formatLabels[data.format] || data.format : 'Не указано';

    // Переводим симптомы
    const symptomsText = data.symptoms?.length > 0
      ? data.symptoms.map((s: string) => symptomsLabels[s] || s).join(', ')
      : 'Нет';
    
    // Формируем сообщение
    const message = `
🆕 Новый пользователь!

👤 Пациент:
Имя: ${data.patientInfo?.name || 'Не указано'}
Возраст: ${data.patientInfo?.age || 'Не указано'} лет
Рост: ${data.patientInfo?.height || 'Не указано'} см
Вес: ${data.patientInfo?.weight || 'Не указано'} кг

🏥 Диагнозы:
${diagnosesText}
${data.otherDescription ? `Другое: ${data.otherDescription}` : ''}

⏱ Время с момента события:
${timeText}

💊 Симптомы:
${symptomsText}

🩺 Хронические заболевания:
${data.chronicDiseases?.length > 0 ? data.chronicDiseases.join(', ') : 'Нет'}

⚠️ Противопоказания:
${data.contraindications || 'Нет'}

📋 Формат занятий:
${formatText}

📞 Контакт:
${data.contact || 'Не указано'}

💬 Комментарий:
${data.comment || 'Нет'}

📅 Дата: ${new Date().toLocaleString('ru-RU')}
    `.trim();

    // Отправляем в Telegram
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      
      const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        }),
      });

      if (!response.ok) {
        console.error('Telegram API error:', await response.text());
        throw new Error('Failed to send to Telegram');
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    return NextResponse.json(
      { error: 'Failed to send data' },
      { status: 500 }
    );
  }
}
