# RehabFlow - Интерактивное приложение для реабилитации

Приложение для создания персональных программ реабилитации после инсульта, инфаркта, травм и других состояний.

## Возможности

- 📋 Подробная анкета пациента (имя, возраст, рост, вес)
- 🏥 Множественный выбор диагнозов с возможностью описания
- ⏱ Определение времени с момента события
- 💊 Выбор симптомов и проблем
- 🩺 Учет хронических заболеваний и противопоказаний
- 📊 Прогресс-бар с градиентом от красного к зеленому
- 📱 Интеграция с Telegram ботом @cigunrehab_bot
- 💳 Возможность оплаты методички (299 ₽)
- 🤖 Автоматическая отправка данных в Telegram канал

## Установка

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd rehabflow
```

2. Установите зависимости:
```bash
npm install
# или
pnpm install
```

3. Создайте файл `.env.local` на основе `.env.example`:
```bash
cp .env.example .env.local
```

4. Заполните переменные окружения в `.env.local`:
```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

## Настройка Telegram бота

### 1. Создание бота

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте команду `/newbot`
3. Следуйте инструкциям для создания бота
4. Сохраните полученный токен в `.env.local` как `TELEGRAM_BOT_TOKEN`

### 2. Получение Chat ID

1. Создайте канал или группу для получения уведомлений
2. Добавьте вашего бота в канал/группу как администратора
3. Отправьте любое сообщение в канал
4. Откройте в браузере: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
5. Найдите `chat.id` в ответе и сохраните его в `.env.local` как `TELEGRAM_CHAT_ID`

## Запуск приложения

### Режим разработки:
```bash
npm run dev
# или
pnpm dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

### Production сборка:
```bash
npm run build
npm start
```

## Структура проекта

```
rehabflow/
├── app/
│   ├── page.tsx              # Главная страница
│   ├── question0/            # Анкета пациента
│   ├── question1/            # Выбор диагнозов
│   ├── question2/            # Время с момента события
│   ├── question3/            # Симптомы
│   ├── question4/            # Формат занятий
│   ├── question5/            # Контактные данные
│   ├── question6/            # Хронические заболевания
│   ├── result/               # Страница результата
│   └── api/
│       ├── send-to-telegram/ # API для отправки в Telegram
│       └── submit-recommendation/
├── components/
│   ├── ProgressBar.tsx       # Прогресс-бар с градиентом
│   └── ui/                   # UI компоненты
├── stores/
│   └── useAnswersStore.ts    # Zustand store для данных
└── utils/
    └── getRecommendation.ts  # Логика подбора рекомендаций
```

## Интеграция с Telegram ботом

Приложение интегрировано с [@cigunrehab_bot](https://t.me/cigunrehab_bot). 

При выборе формата "Самостоятельно по методичке":
1. Пользователь заполняет анкету
2. Данные отправляются в Telegram канал
3. Пользователь перенаправляется в бот
4. Бот генерирует персональную программу упражнений
5. Пользователь может скачать методичку бесплатно или купить за 299 ₽

## Контакты

- Телефон: +7 953 790 20 10
- Telegram: [@cigunrehab](https://t.me/cigunrehab)
- Бот: [@cigunrehab_bot](https://t.me/cigunrehab_bot)

## Технологии

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Zustand (state management)
- Shadcn/ui (UI components)
- Framer Motion (animations)

## Лицензия

Proprietary - Все права защищены
