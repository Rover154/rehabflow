import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import iconv from 'iconv-lite';
import OpenAI from 'openai';
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

// Интерфейс для упражнения
interface Exercise {
  name: string;
  description: string;
  duration: string;
  benefits: string;
  imageFile?: string;
}

// Чтение контента книги
function readBookContent(): string {
  const filePath = path.join(process.cwd(), 'app', 'cigun', 'content.txt');
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf-8');
  }
  return '';
}

// Получение списка доступных изображений
function getAvailableImages(): string[] {
  const imgDir = path.join(process.cwd(), 'app', 'cigun', 'img');
  if (!fs.existsSync(imgDir)) return [];
  
  const files = fs.readdirSync(imgDir);
  return files.filter(f => /\.(gif|png|jpg|jpeg)$/i.test(f));
}

// Генерация промпта для нейросети на основе данных клиента
function createPrompt(clientData: {
  name: string;
  email: string;
  age: string;
  goals: string;
  healthConditions: string;
}): string {
  return `Ты эксперт по цигун, обученный на книге "300 вопросов о цигун".
  
На основе данных клиента:
- Имя: ${clientData.name}
- Возраст: ${clientData.age}
- Цели: ${clientData.goals}
- Состояние здоровья: ${clientData.healthConditions || 'Не указано'}

Создай персональный комплекс упражнений цигун из 5-7 упражнений.
Для каждого упражнения укажи:
1. Название (на русском)
2. Описание техники выполнения
3. Рекомендуемую продолжительность
4. Пользу для здоровья
5. Номер изображения из книги (формат: imageXXX.gif или imageXXX.png)

Ответ должен быть в формате JSON массива объектов с полями:
name, description, duration, benefits, imageNumber

Ответ ТОЛЬКО JSON, без дополнительного текста.`;
}

// Интеграция с io.net (Kimi K2 через OpenAI-compatible API)
async function generateWithIoNet(prompt: string): Promise<Exercise[]> {
  const apiKey = process.env.IO_NET_API_KEY;
  
  if (!apiKey || apiKey === 'your_io_net_api_key_here') {
    console.warn('[io.net] API key не настроен, используем демо-режим');
    return getDemoExercises();
  }

  try {
    // io.net предоставляет совместимый API с OpenAI
    const client = new OpenAI({
      apiKey: apiKey,
      baseURL: 'https://api.io.net/v1', // Базовый URL io.net
    });

    const completion = await client.chat.completions.create({
      model: 'kimi-k2', // Kimi K2 модель
      messages: [
        {
          role: 'system',
          content: 'Ты эксперт по цигун. Отвечай ТОЛЬКО в формате JSON массива.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content || '[]';
    const exercises: Exercise[] = JSON.parse(content);
    
    // Сопоставляем номера изображений с файлами
    const availableImages = getAvailableImages();
    exercises.forEach((ex, idx) => {
      const imgNum = (ex as any).imageNumber || idx + 1;
      const paddedNum = String(imgNum).padStart(3, '0');
      const matchingImg = availableImages.find(img => 
        img.includes(paddedNum) || img.includes(String(imgNum))
      );
      if (matchingImg) {
        ex.imageFile = matchingImg;
      }
    });

    return exercises;
  } catch (error) {
    console.error('[io.net] Ошибка при генерации:', error);
    return getDemoExercises();
  }
}

// Демо-упражнения (если API недоступен)
function getDemoExercises(): Exercise[] {
  return [
    {
      name: 'Стойка Вуцзи',
      description: 'Встаньте прямо, ноги на ширине плеч, руки свободно вдоль тела. Расслабьтесь, дышите глубоко животом.',
      duration: '5 минут',
      benefits: 'Заземление, успокоение ума, накопление энергии',
      imageFile: 'image001.png'
    },
    {
      name: 'Облачные руки',
      description: 'Медленно поднимайте руки перед собой на вдохе, опускайте на выдохе, представляя поток энергии.',
      duration: '10 повторений',
      benefits: 'Плавное течение Ци, гармонизация верхнего и нижнего',
      imageFile: 'image002.png'
    },
    {
      name: 'Поддерживание неба',
      description: 'Одна рука поднимается вверх ладонью к небу, другая опускается вниз ладонью к земле.',
      duration: '8 повторений на каждую сторону',
      benefits: 'Соединение энергии Неба и Земли',
      imageFile: 'image003.gif'
    },
    {
      name: 'Восемь кусков парчи',
      description: 'Комплекс из 8 движений для укрепления внутренних органов.',
      duration: '10 минут',
      benefits: 'Укрепление органов, улучшение циркуляции Ци',
      imageFile: 'image004.gif'
    },
    {
      name: 'Дыхание даньтянем',
      description: 'Глубокое брюшное дыхание с фокусом на нижний даньтянь.',
      duration: '5-10 минут',
      benefits: 'Накопление жизненной энергии, укрепление здоровья',
      imageFile: 'image005.gif'
    }
  ];
}

// Генерация PDF с упражнениями и картинками
async function generatePDF(
  clientData: { name: string; email: string; age: string; goals: string },
  exercises: Exercise[]
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ 
      size: 'A4', 
      margins: { top: 50, bottom: 50, left: 50, right: 50 } 
    });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const imgDir = path.join(process.cwd(), 'app', 'cigun', 'img');

    // Заголовок
    doc
      .fontSize(24)
      .font('Helvetica-Bold')
      .text('Персональный комплекс Цигун', { align: 'center' })
      .moveDown(0.5);

    doc
      .fontSize(12)
      .font('Helvetica')
      .text('Создано на основе книги "300 вопросов о Цигун"', { align: 'center' })
      .moveDown(1);

    // Информация о клиенте
    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('Информация о клиенте:')
      .moveDown(0.3);

    doc
      .fontSize(11)
      .font('Helvetica')
      .text(`Имя: ${clientData.name}`)
      .text(`Возраст: ${clientData.age}`)
      .text(`Email: ${clientData.email}`)
      .text(`Цели: ${clientData.goals}`)
      .moveDown(1);

    // Разделитель
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    // Упражнения
    exercises.forEach((exercise, index) => {
      // Название упражнения
      doc
        .fontSize(16)
        .font('Helvetica-Bold')
        .text(`${index + 1}. ${exercise.name}`, { underline: true })
        .moveDown(0.3);

      // Описание
      doc
        .fontSize(11)
        .font('Helvetica')
        .text('Описание:', { continued: true })
        .font('Helvetica-Oblique')
        .text(exercise.description)
        .moveDown(0.3);

      // Продолжительность
      doc
        .font('Helvetica-Bold')
        .text('Продолжительность:', { continued: true })
        .font('Helvetica')
        .text(exercise.duration)
        .moveDown(0.3);

      // Польза
      doc
        .font('Helvetica-Bold')
        .text('Польза:', { continued: true })
        .font('Helvetica')
        .text(exercise.benefits)
        .moveDown(0.5);

      // Изображение (если есть)
      if (exercise.imageFile) {
        const imagePath = path.join(imgDir, exercise.imageFile);
        if (fs.existsSync(imagePath)) {
          try {
            // Для GIF нужно конвертировать или использовать placeholder
            const ext = exercise.imageFile.split('.').pop()?.toLowerCase();
            if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') {
              const y = doc.y;
              doc.image(imagePath, 50, y, { width: 200 });
              doc.y = Math.max(y + 150, doc.y);
            } else {
              // Для GIF показываем placeholder
              doc
                .fontSize(10)
                .font('Helvetica-Oblique')
                .text(`[Иллюстрация: ${exercise.imageFile}]`, { align: 'center' })
                .moveDown(0.3);
            }
          } catch (imgError) {
            console.warn(`[PDF] Не удалось добавить изображение ${exercise.imageFile}:`, imgError);
          }
        }
      }

      doc.moveDown(0.5);
      
      // Разделитель между упражнениями
      if (index < exercises.length - 1) {
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.5);
      }
    });

    // Footer
    doc.moveDown(1);
    doc
      .fontSize(9)
      .font('Helvetica')
      .text('---', { align: 'center' })
      .moveDown(0.3)
      .text('Комплекс сгенерирован с использованием AI io.net', { align: 'center' })
      .text(`Дата создания: ${new Date().toLocaleDateString('ru-RU')}`, { align: 'center' });

    doc.end();
  });
}

// Отправка email с PDF
async function sendEmail(
  pdfBuffer: Buffer,
  clientEmail: string,
  exercises: Exercise[]
): Promise<void> {
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;

  if (!emailUser || !emailPassword || 
      emailUser === 'your_email@gmail.com' || 
      emailPassword === 'your_app_password_here') {
    console.warn('[Email] Email не настроен. PDF не отправлен.');
    return;
  }

  // Создаём transporter для Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
  });

  // Список упражнений для письма
  const exerciseList = exercises
    .map((ex, i) => `${i + 1}. ${ex.name} - ${ex.duration}`)
    .join('\n');

  // Опции письма для клиента
  const mailOptionsClient = {
    from: `"RehabFlow Цигун" <${emailUser}>`,
    to: clientEmail,
    cc: 'rover38354@gmail.com', // Копия специалисту
    subject: 'Ваш персональный комплекс Цигун',
    text: `Здравствуйте!

Ваш персональный комплекс упражнений Цигун готов.

Комплекс включает ${exercises.length} упражнений:
${exerciseList}

PDF-файл с подробными инструкциями прикреплён к этому письму.

Рекомендации:
- Занимайтесь в спокойной обстановке
- Дышите глубоко и ровно
- Следите за своими ощущениями

С заботой о вашем здоровье,
RehabFlow`,
    attachments: [
      {
        filename: 'qigung-complex.pdf',
        content: pdfBuffer,
      },
    ],
  };

  // Отправка
  try {
    await transporter.sendMail(mailOptionsClient);
    console.log(`[Email] Письмо отправлено на ${clientEmail}`);
  } catch (error) {
    console.error('[Email] Ошибка отправки:', error);
    throw error;
  }
}

// Основной обработчик POST
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, age, goals, healthConditions } = body;

    // Валидация
    if (!name || !email || !age) {
      return NextResponse.json(
        { error: 'Заполните обязательные поля: имя, email, возраст' },
        { status: 400 }
      );
    }

    const clientData = { name, email, age, goals, healthConditions };

    // Шаг 1: Генерация комплекса через io.net
    console.log('[io.net] Начало генерации комплекса...');
    const exercises = await generateWithIoNet(createPrompt(clientData));
    console.log(`[io.net] Сгенерировано ${exercises.length} упражнений`);

    // Шаг 2: Генерация PDF
    console.log('[PDF] Генерация PDF...');
    const pdfBuffer = await generatePDF(clientData, exercises);
    console.log(`[PDF] Размер PDF: ${(pdfBuffer.length / 1024).toFixed(2)} KB`);

    // Шаг 3: Отправка email
    console.log('[Email] Отправка письма...');
    await sendEmail(pdfBuffer, email, exercises);

    return NextResponse.json({
      success: true,
      message: 'Комплекс сгенерирован и отправлен на email',
      exercisesCount: exercises.length,
      pdfSize: pdfBuffer.length,
    });

  } catch (error) {
    console.error('[API] Ошибка:', error);
    return NextResponse.json(
      { error: 'Не удалось создать комплекс. Попробуйте позже.' },
      { status: 500 }
    );
  }
}
