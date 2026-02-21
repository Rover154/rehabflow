import * as fs from 'fs';
import * as path from 'path';
import iconv from 'iconv-lite';

export interface CigunExercise {
  id: number;
  question: string;
  answer: string;
  image?: string;
}

/**
 * Парсит HTML файл книги цигун в кодировке windows-1251
 * и извлекает вопрос и ответ
 */
export function parseCigunFile(filePath: string): CigunExercise | null {
  try {
    // Читаем файл как бинарный буфер
    const buffer = fs.readFileSync(filePath);
    
    // Декодируем из windows-1251 в UTF-8
    const content = iconv.decode(buffer, 'win1251');
    
    // Извлекаем заголовок (вопрос) из тега h1 class="zag1"
    const h1Match = content.match(/<h1[^>]*class="zag1"[^>]*>([\s\S]*?)<\/h1>/i);
    const question = h1Match ? cleanHtml(h1Match[1]) : '';
    
    // Извлекаем весь текст из div class="Section1" после заголовка
    const sectionMatch = content.match(/<div[^>]*class="Section1"[^>]*>([\s\S]*?)<\/div>/i);
    let answer = '';
    
    if (sectionMatch) {
      // Удаляем h1 и h2 из ответа
      let sectionContent = sectionMatch[1]
        .replace(/<h1[^>]*>[\s\S]*?<\/h1>/gi, '')
        .replace(/<h2[^>]*>[\s\S]*?<\/h2>/gi, '');
      
      answer = cleanHtml(sectionContent);
    }
    
    // Пытаемся найти номер упражнения из имени файла
    const fileName = path.basename(filePath, '.html');
    const id = parseInt(fileName, 10) || 0;
    
    // Пытаемся найти связанное изображение
    const imageFileName = `image${String(id).padStart(3, '0')}.gif`;
    const imagePath = path.join(path.dirname(filePath), 'img', imageFileName);
    let image: string | undefined;
    
    if (fs.existsSync(imagePath)) {
      image = imagePath;
    }
    
    return {
      id,
      question,
      answer,
      image
    };
  } catch (error) {
    console.error(`Ошибка парсинга файла ${filePath}:`, error);
    return null;
  }
}

/**
 * Очищает HTML теги из строки
 */
function cleanHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Загружает все упражнения из книги цигун
 */
export function loadCigunBook(bookDir: string): CigunExercise[] {
  const exercises: CigunExercise[] = [];
  
  try {
    const files = fs.readdirSync(bookDir);
    
    for (const file of files) {
      if (/^\d{3}\.html$/.test(file)) {
        const filePath = path.join(bookDir, file);
        const exercise = parseCigunFile(filePath);
        
        if (exercise && (exercise.question || exercise.answer)) {
          exercises.push(exercise);
        }
      }
    }
    
    // Сортируем по ID
    exercises.sort((a, b) => a.id - b.id);
    
    console.log(`Загружено ${exercises.length} упражнений из книги цигун`);
    
    return exercises;
  } catch (error) {
    console.error('Ошибка загрузки книги цигун:', error);
    return [];
  }
}

/**
 * Находит релевантные упражнения для диагноза и симптомов
 */
export function findRelevantExercises(
  exercises: CigunExercise[],
  diagnoses: string[],
  symptoms: string[]
): CigunExercise[] {
  const keywords: Record<string, string[]> = {
    stroke: ['инсульт', 'мозг', 'голов', 'парали', 'восстановл'],
    infarct: ['инфаркт', 'сердц', 'кардио'],
    trauma: ['травм', 'поврежд', 'перелом', 'ушиб'],
    stress: ['стресс', 'нерв', 'тревог', 'беспокойств', 'псих'],
    pain: ['боль', 'болев'],
    stiffness: ['скован', 'тугоподвиж', 'жестк'],
    weakness: ['слаб', 'вял', 'истощ'],
    dizziness: ['головокруж', 'головокружение'],
    fatigue: ['утомл', 'устал', 'утомляем'],
    sleep: ['сон', 'бессон', 'нарушени'],
    anxiety: ['тревог', 'беспокойств', 'тревожность'],
  };
  
  const searchKeywords = [
    ...diagnoses.flatMap(d => keywords[d] || []),
    ...symptoms.flatMap(s => keywords[s] || [])
  ];
  
  if (searchKeywords.length === 0) {
    // Возвращаем первые 15 упражнений по умолчанию
    return exercises.slice(0, 15);
  }
  
  const relevant = exercises.filter(exercise => {
    const text = `${exercise.question} ${exercise.answer}`.toLowerCase();
    return searchKeywords.some(keyword => 
      text.includes(keyword.toLowerCase())
    );
  });
  
  // Если нашли мало релевантных, добавляем еще из начала книги
  if (relevant.length < 10) {
    const remaining = exercises
      .filter(e => !relevant.find(r => r.id === e.id))
      .slice(0, 15 - relevant.length);
    return [...relevant, ...remaining];
  }
  
  return relevant.slice(0, 15);
}

/**
 * Получает базовый URL для изображений в зависимости от окружения
 */
export function getImageBaseUrl(): string {
  // В production используем абсолютный URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/cigun/img`;
}
