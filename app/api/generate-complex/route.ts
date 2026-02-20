import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';

// Инициализация OpenAI-compatible клиента для io.net
const openai = new OpenAI({
  apiKey: process.env.IO_NET_API_KEY,
  baseURL: 'https://api.intelligence.io.solutions/api/v1',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      age, 
      diagnoses, 
      symptoms, 
      time, 
      format,
      contact,
      email 
    } = body;

    console.log('=== ЗАПРОС НА ГЕНЕРАЦИЮ ===');
    console.log('Получены данные:', body);
    console.log('IO_NET_API_KEY:', process.env.IO_NET_API_KEY ? 'настроен (длина: ' + process.env.IO_NET_API_KEY.length + ')' : 'НЕ НАСТРОЕН');
    console.log('EMAIL_USER:', process.env.EMAIL_USER || 'НЕ НАСТРОЕН');
    console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'настроен' : 'НЕ НАСТРОЕН');
    
    // Проверяем переменные окружения
    const ioNetKey = process.env.IO_NET_API_KEY;
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASSWORD;
    
    if (!ioNetKey) {
      console.error('❌ IO_NET_API_KEY отсутствует!');
      return NextResponse.json(
        { error: 'IO_NET_API_KEY не настроен', envCheck: {
          IO_NET_API_KEY: process.env.IO_NET_API_KEY ? 'есть' : 'нет'
        }},
        { status: 500 }
      );
    }
    
    if (!emailUser || !emailPass) {
      console.error('❌ EMAIL не настроен!');
      return NextResponse.json(
        { error: 'EMAIL_USER или EMAIL_PASSWORD не настроены' },
        { status: 500 }
      );
    }

    // Формируем промт для генерации
    const diagnosisMap: Record<string, string> = {
      stroke: 'Инсульт',
      infarct: 'Инфаркт',
      trauma: 'Травма',
      stress: 'Стресс',
      other: 'Другое',
    };

    const symptomMap: Record<string, string> = {
      pain: 'Боль',
      stiffness: 'Скованность',
      weakness: 'Слабость',
      dizziness: 'Головокружение',
      fatigue: 'Утомляемость',
      sleep: 'Нарушения сна',
      anxiety: 'Тревожность',
      other: 'Другое',
    };

    const timeMap: Record<string, string> = {
      acute: 'Острый период (до 1 месяца)',
      '1-3': '1-3 месяца',
      '3-6': '3-6 месяцев',
      '6plus': '6-12 месяцев',
      '1yplus': 'Более 1 года',
      any: 'Любой период',
    };

    const diagnosesText = diagnoses?.length > 0 
      ? diagnoses.map((d: string) => diagnosisMap[d] || d).join(', ') 
      : 'Не указано';

    const symptomsText = symptoms?.length > 0 
      ? symptoms.map((s: string) => symptomMap[s] || s).join(', ') 
      : 'Не указано';

    const prompt = `Ты — профессиональный инструктор по цигун с 30-летним опытом реабилитации.

ПАЦИЕНТ:
- Имя: ${name || 'Не указано'}
- Возраст: ${age || 'Не указано'} лет
- Диагнозы: ${diagnosesText}
- Период: ${time ? timeMap[time] : 'Не указан'}
- Симптомы: ${symptomsText}
- Формат: ${format === 'self' ? 'Самостоятельно' : 'С инструктором'}

ЗАДАЧА:
Составь ПОЛНЫЙ персональный комплекс из 10-15 упражнений цигун.

ФОРМАТ ОТВЕТА (строго JSON):
{
  "complex_name": "Название комплекса",
  "exercises": [
    {
      "name_ru": "Название на русском",
      "name_cn": "Название на китайском",
      "position": "Исходное положение",
      "steps": ["шаг 1", "шаг 2", "шаг 3"],
      "breathing": "Дыхание",
      "repetitions": "Повторения",
      "duration": "Время",
      "effect": "Эффект",
      "contraindications": "Противопоказания"
    }
  ],
  "recommendations": "Общие рекомендации",
  "warnings": "Предупреждения безопасности"
}`;

    console.log('Отправка запроса к io.net API...');
    
    // Генерируем комплекс через io.net API
    const completion = await openai.chat.completions.create({
      model: 'moonshotai/Kimi-K2-Instruct-0905',
      messages: [
        { role: 'system', content: 'Ты профессиональный инструктор цигун. Отвечай ТОЛЬКО в формате JSON.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 4000,
      temperature: 0.7,
      top_p: 0.9,
    });

    const responseText = completion.choices[0].message.content || '';
    console.log('Ответ от AI:', responseText.substring(0, 500) + '...');
    
    // Парсим JSON ответ
    let complexData;
    try {
      const cleanJson = responseText.replace(/```json\s*|\s*```/g, '').trim();
      complexData = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('Ошибка парсинга JSON:', parseError);
      return NextResponse.json(
        { error: 'Ошибка генерации комплекса', details: String(parseError) },
        { status: 500 }
      );
    }

    console.log('Генерация PDF...');
    
    // Генерируем PDF
    const pdfBuffer = await generatePDF(complexData, name);

    console.log('Отправка email...');
    
    // Отправляем email с PDF
    await sendEmailWithPDF({
      to: email || 'rover38354@gmail.com',
      subject: `Ваш персональный комплекс цигун для ${name || 'пациента'}`,
      complexData,
      pdfBuffer,
    });

    console.log('Готово!');

    return NextResponse.json({
      success: true,
      message: 'Комплекс сгенерирован и отправлен на email',
      complex: complexData,
    });

  } catch (error) {
    console.error('Ошибка генерации комплекса:', error);
    return NextResponse.json(
      { error: 'Ошибка при генерации комплекса', details: String(error) },
      { status: 500 }
    );
  }
}

async function generatePDF(complexData: any, patientName: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ 
      size: 'A4', 
      margins: { top: 50, bottom: 50, left: 50, right: 50 } 
    });
    const chunks: Buffer[] = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Заголовок
    doc
      .fontSize(24)
      .font('Helvetica-Bold')
      .text('Персональный комплекс цигун', { align: 'center' })
      .moveDown(0.5);

    doc
      .fontSize(14)
      .font('Helvetica')
      .text(`Для: ${patientName || 'Пациента'}`, { align: 'center' })
      .moveDown(0.5);

    doc
      .fontSize(12)
      .text(`Дата генерации: ${new Date().toLocaleDateString('ru-RU')}`, { align: 'center' })
      .moveDown(2);

    // Название комплекса
    doc
      .fontSize(18)
      .font('Helvetica-Bold')
      .text(complexData.complex_name || 'Комплекс упражнений')
      .moveDown(1);

    // Упражнения
    complexData.exercises?.forEach((exercise: any, index: number) => {
      doc
        .fontSize(14)
        .font('Helvetica-Bold')
        .text(`${index + 1}. ${exercise.name_ru || 'Упражнение'} ${exercise.name_cn ? `(${exercise.name_cn})` : ''}`)
        .moveDown(0.5);

      doc
        .fontSize(11)
        .font('Helvetica')
        .text(`Исходное положение: ${exercise.position || 'Не указано'}`)
        .moveDown(0.3);

      doc
        .font('Helvetica-Bold')
        .text('Выполнение:')
        .moveDown(0.2);

      exercise.steps?.forEach((step: string, i: number) => {
        doc
          .font('Helvetica')
          .text(`  ${i + 1}. ${step}`, { indent: 20 })
          .moveDown(0.2);
      });

      doc
        .font('Helvetica-Bold')
        .text(`Дыхание: ${exercise.breathing || 'Не указано'}`)
        .moveDown(0.2);

      doc
        .text(`Повторения: ${exercise.repetitions || 'Не указано'}`)
        .moveDown(0.2);

      doc
        .text(`Время: ${exercise.duration || 'Не указано'}`)
        .moveDown(0.2);

      doc
        .font('Helvetica-Oblique')
        .text(`Эффект: ${exercise.effect || 'Не указано'}`)
        .moveDown(0.5);

      if (exercise.contraindications) {
        doc
          .fontSize(10)
          .font('Helvetica-Bold')
          .fillColor('red')
          .text(`⚠ Противопоказания: ${exercise.contraindications}`)
          .fillColor('black')
          .moveDown(1);
      } else {
        doc.moveDown(1);
      }
    });

    // Рекомендации
    if (complexData.recommendations) {
      doc
        .fontSize(16)
        .font('Helvetica-Bold')
        .text('Рекомендации:')
        .moveDown(0.5);

      doc
        .fontSize(11)
        .font('Helvetica')
        .text(complexData.recommendations)
        .moveDown(1);
    }

    // Предупреждения
    if (complexData.warnings) {
      doc
        .fontSize(16)
        .font('Helvetica-Bold')
        .fillColor('red')
        .text('⚠ Предупреждения безопасности:')
        .moveDown(0.5);

      doc
        .fontSize(11)
        .font('Helvetica')
        .fillColor('black')
        .text(complexData.warnings);
    }

    // Footer
    doc
      .fontSize(10)
      .font('Helvetica')
      .text('\n\n---\nСгенерировано автоматически на основе книги "300 вопросов о цигун"', { align: 'center' });

    doc.end();
  });
}

async function sendEmailWithPDF(options: {
  to: string;
  subject: string;
  complexData: any;
  pdfBuffer: Buffer;
}) {
  const { to, subject, complexData, pdfBuffer } = options;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const exercisesList = complexData.exercises?.map((ex: any, i: number) => 
    `<li><strong>${i + 1}. ${ex.name_ru || 'Упражнение'}</strong></li>`
  ).join('') || '';

  const htmlContent = `
    <h2>Ваш персональный комплекс цигун готов!</h2>
    <p>Здравствуйте!</p>
    <p>Мы сгенерировали для вас полный комплекс из ${complexData.exercises?.length || 0} упражнений.</p>
    
    <h3>Список упражнений:</h3>
    <ol>${exercisesList}</ol>
    
    <h3>Рекомендации:</h3>
    <p>${complexData.recommendations || 'Следуйте инструкциям в PDF файле.'}</p>
    
    <p><strong>Важно:</strong> Перед началом практики проконсультируйтесь с лечащим врачом.</p>
    
    <p>С заботой о вашем здоровье,<br>Команда Цигун-Реабилитация</p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: htmlContent,
    attachments: [
      {
        filename: 'complex-cigun.pdf',
        content: pdfBuffer,
      },
    ],
  });
}
