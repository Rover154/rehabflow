import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';

// Инициализация OpenAI-compatible клиента для io.net
const openai = new OpenAI({
  apiKey: process.env.IO_NET_API_KEY,
  baseURL: 'https://api.intelligence.io.solutions/api/v1',
});

// Маппинг упражнений на изображения из книги
const exerciseImageMap: Record<string, string> = {
  'разминка': 'image001.png',
  'дыхание': 'image002.png',
  'подъем': 'image003.png',
  'опускание': 'image004.png',
  'вращение': 'image005.png',
  'наклон': 'image006.png',
  'поворот': 'image007.png',
  'выпад': 'image008.png',
  'стойка': 'image009.png',
  'баланс': 'image010.png',
};

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

    // Формируем промт для генерации полного комплекса
    const diagnosisMap: Record<string, string> = {
      stroke: 'Инсульт',
      infarct: 'Инфаркт',
      trauma: 'Травма',
      stress: 'Стресс/нервное перенапряжение',
      other: 'Другое',
    };

    const symptomMap: Record<string, string> = {
      pain: 'Боль',
      stiffness: 'Скованность движений',
      weakness: 'Слабость',
      dizziness: 'Головокружение',
      fatigue: 'Быстрая утомляемость',
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
Составь ПОЛНЫЙ персональный комплекс из 10-15 упражнений цигун для реабилитации.

ТРЕБОВАНИЯ К КОМПЛЕКСУ:
1. Учитывай все диагнозы и противопоказания
2. Начинай с разминки (2-3 упражнения)
3. Основная часть (6-8 упражнений)
4. Завершение (2-3 упражнения)
5. Для каждого упражнения укажи:
   - Название на русском и китайском
   - Исходное положение
   - Пошаговое выполнение (3-5 шагов)
   - Дыхание
   - Количество повторений
   - Время выполнения
   - Эффект от упражнения
   - Противопоказания

ДОСТУПНЫЕ ТИПЫ УПРАЖНЕНИЙ (используй эти названия для подбора изображений):
- Разминка, Дыхание, Подъем рук, Опускание рук
- Вращение плечами, Наклон вперед, Поворот корпуса
- Выпад, Стойка всадника, Баланс на одной ноге
- Подъем на носки, Перекаты, Хлопки
- Массаж живота, Поглаживание лица

ФОРМАТ ОТВЕТА (строго JSON):
{
  "complex_name": "Название комплекса",
  "exercises": [
    {
      "name_ru": "Название на русском (используй типы из списка выше)",
      "name_cn": "Название на китайском",
      "position": "Исходное положение",
      "steps": ["шаг 1", "шаг 2", "шаг 3"],
      "breathing": "Описание дыхания",
      "repetitions": "Количество повторений",
      "duration": "Время выполнения",
      "effect": "Эффект от упражнения",
      "contraindications": "Противопоказания"
    }
  ],
  "recommendations": "Общие рекомендации по практике",
  "warnings": "Предупреждения безопасности"
}`;

    // Генерируем комплекс через io.net API
    const completion = await openai.chat.completions.create({
      model: 'moonshotai/Kimi-K2-Instruct-0905',
      messages: [
        { role: 'system', content: 'Ты профессиональный инструктор цигун. Отвечай ТОЛЬКО в формате JSON без дополнительного текста.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 4000,
      temperature: 0.7,
      top_p: 0.9,
    });

    const responseText = completion.choices[0].message.content || '';
    
    // Парсим JSON ответ
    let complexData;
    try {
      // Очищаем ответ от возможных маркеров кода
      const cleanJson = responseText.replace(/```json\s*|\s*```/g, '').trim();
      complexData = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('Ошибка парсинга JSON:', parseError);
      return NextResponse.json(
        { error: 'Ошибка генерации комплекса' },
        { status: 500 }
      );
    }

    // Генерируем PDF
    const pdfBuffer = await generatePDF(complexData, name);

    // Отправляем email с PDF
    await sendEmailWithPDF({
      to: email || 'rover38354@gmail.com',
      subject: `Ваш персональный комплекс цигун для ${name || 'пациента'}`,
      complexData,
      pdfBuffer,
    });

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

      // Пытаемся найти изображение для упражнения
      const imageName = findExerciseImage(exercise.name_ru);
      if (imageName) {
        try {
          const imagePath = path.join(process.cwd(), 'app', 'cigun', 'img', imageName);
          if (fs.existsSync(imagePath)) {
            doc.image(imagePath, { 
              fit: [400, 200], 
              align: 'center',
              valign: 'center'
            });
            doc.moveDown(0.5);
          }
        } catch (err) {
          console.error(`Ошибка загрузки изображения ${imageName}:`, err);
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
      .text('\n\n---\nСгенерировано автоматически на основе книги "300 вопросов о цигун"', { align: 'center' });

    doc.end();
  });
}

// Функция поиска изображения для упражнения
function findExerciseImage(exerciseName: string): string | null {
  if (!exerciseName) return null;
  
  const nameLower = exerciseName.toLowerCase();
  
  // Ищем совпадения по ключевым словам
  for (const [keyword, imageName] of Object.entries(exerciseImageMap)) {
    if (nameLower.includes(keyword)) {
      return imageName;
    }
  }
  
  // Если не нашли, возвращаем первое изображение по умолчанию
  return 'image001.png';
}

async function sendEmailWithPDF(options: {
  to: string;
  subject: string;
  complexData: any;
  pdfBuffer: Buffer;
}) {
  const { to, subject, complexData, pdfBuffer } = options;

  // Создаём транспорт для отправки email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Формируем HTML письмо
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

  // Отправляем письмо
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
