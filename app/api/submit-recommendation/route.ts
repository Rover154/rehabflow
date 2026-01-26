import { NextResponse } from 'next/server';

// ⚠️ Замените эти значения на свои!
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN; // например: '123456789:ABCdefGhIJKlmNoPQRsTUVwxyz'
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;     // например: '987654321' (ваш ID)

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // === 1. Опционально: сохранение в базу данных (оставьте, если нужно) ===
    // Например: await saveToDatabase(data);

    // === 2. Отправка уведомления в Telegram ===
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const message = `
🆕 Новая рекомендация в RehabFlow!

Данные:
${JSON.stringify(data, null, 2)}
      `.trim();

      const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

      await fetch(telegramUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML', // можно убрать, если не используете HTML
        }),
      });
    }

    // === 3. Опционально: отправка пользователю (email, SMS и т.д.) ===
    // Например: await sendEmailToUser(data.email, ...);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка при обработке запроса:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}