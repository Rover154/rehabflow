import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import nodemailer from 'nodemailer';
// Используем require для pdfkit чтобы избежать проблем с bundling
const PDFDocument = require('pdfkit');
import * as fs from 'fs';
import * as path from 'path';
import { loadCigunBook, findRelevantExercises, getImageBaseUrl } from '@/lib/cigun-book-parser';

// Путь к шрифтам pdfkit - используем require.resolve для правильного пути
const PDFKIT_FONT_PATH = path.dirname(require.resolve('pdfkit')) + '/../js/data';

// Инициализация OpenAI-compatible клиента для io.net
const openai = new OpenAI({
  apiKey: process.env.IO_NET_API_KEY,
  baseURL: 'https://api.intelligence.io.solutions/api/v1',
});

// Путь к книге цигун
const CIGUN_BOOK_DIR = path.join(process.cwd(), 'app', 'cigun');

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

    // Загружаем книгу цигун
    console.log('Загрузка книги цигун...');
    const cigunBook = loadCigunBook(CIGUN_BOOK_DIR);
    
    // Находим релевантные упражнения для пациента
    const relevantExercises = findRelevantExercises(
      cigunBook,
      diagnoses || [],
      symptoms || []
    );
    
    console.log(`Найдено ${relevantExercises.length} релевантных упражнений`);

    // Формируем контекст из книги для AI
    const bookContext = relevantExercises.map((ex, i) => 
      `Упражнение ${i + 1} (ID: ${ex.id}):
Вопрос: ${ex.question}
Ответ: ${ex.answer}
---`
    ).join('\n');

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

КОНТЕКСТ ИЗ КНИГИ "300 ВОПРОСОВ О ЦИГУН":
${bookContext}

ЗАДАЧА:
На основе предоставленных данных из книги "300 вопросов о цигун" составь ПОЛНЫЙ персональный комплекс из 10-15 упражнений цигун для реабилитации пациента.

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
      "contraindications": "Противопоказания",
      "book_reference": "ID упражнения из книги (число)"
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

    console.log('Генерация PDF с картинками...');

    // Генерируем PDF с картинками из книги
    const pdfBuffer = await generatePDFWithImages(complexData, name, relevantExercises);

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

async function generatePDFWithImages(complexData: any, patientName: string, bookExercises: any[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    // Создаем документ
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
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

    // Вступление
    doc
      .fontSize(12)
      .font('Helvetica')
      .text('Данный комплекс составлен на основе книги "300 вопросов о цигун" с учетом ваших индивидуальных особенностей и потребностей.')
      .moveDown(1);

    // Упражнения
    complexData.exercises?.forEach((exercise: any, index: number) => {
      doc
        .fontSize(14)
        .font('Helvetica-Bold')
        .text(`${index + 1}. ${exercise.name_ru || 'Упражнение'} ${exercise.name_cn ? `(${exercise.name_cn})` : ''}`)
        .moveDown(0.5);

      // Пытаемся найти картинку из книги по ID упражнения
      const bookRef = exercise.book_reference || (index < bookExercises.length ? bookExercises[index].id : null);
      if (bookRef) {
        const imageFileName = `image${String(bookRef).padStart(3, '0')}.gif`;
        const imagePath = path.join(CIGUN_BOOK_DIR, 'img', imageFileName);
        
        if (fs.existsSync(imagePath)) {
          try {
            // Добавляем картинку в PDF
            doc.image(imagePath, {
              fit: [400, 300],
              align: 'center',
            });
            doc.moveDown(0.5);
          } catch (imgError) {
            console.error(`Ошибка добавления изображения ${imagePath}:`, imgError);
          }
        }
      }

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
      .text('\n\n---\nСгенерировано автоматически на основе книги "300 вопросов о цигун"\nwww.ariom.ru', { align: 'center' });

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
    <p>Мы сгенерировали для вас полный комплекс из ${complexData.exercises?.length || 0} упражнений на основе книги "300 вопросов о цигун".</p>

    <h3>Список упражнений:</h3>
    <ol>${exercisesList}</ol>

    <h3>Рекомендации:</h3>
    <p>${complexData.recommendations || 'Следуйте инструкциям в PDF файле.'}</p>

    <p><strong>Важно:</strong> Перед началом практики проконсультируйтесь с лечащим врачом.</p>
    
    <p>В PDF файле содержатся иллюстрации к упражнениям из книги.</p>

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
