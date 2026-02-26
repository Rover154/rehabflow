# RehabApp - Персональная программа реабилитации

Интерактивное веб-приложение для сбора анкеты пациента и формирования персональной программы реабилитации.

## 🚀 Быстрый старт

```bash
npm install
npm run dev
```

## 📦 Сборка для production

```bash
npm run build
```

## 🔧 Переменные окружения

Скопируйте `.env.example` в `.env.local` и заполните:

```env
# Telegram Bot Token
VITE_TELEGRAM_BOT_TOKEN=your_bot_token_here

# Telegram Chat ID
VITE_TELEGRAM_CHAT_ID=@cigunrehab

# Email для отправки через SMTP
EMAIL_USER=r-t-c@narod.ru
EMAIL_PASSWORD=your_password_here
```

## 🌐 Деплой на Vercel

1. Запушите проект на GitHub
2. Подключите репозиторий в [Vercel](https://vercel.com/new)
3. Добавьте переменные окружения в Vercel Dashboard
4. Деплой произойдёт автоматически

## 📁 Структура проекта

```
rehab-app/
├── api/
│   └── send-email.ts       # Vercel Serverless Function
├── src/
│   ├── components/
│   │   ├── Step1Welcome.tsx
│   │   ├── Step2PersonalInfo.tsx
│   │   ├── Step3Condition.tsx
│   │   ├── Step4TimeFrame.tsx
│   │   ├── Step5Specifics.tsx
│   │   ├── Step6Contraindications.tsx
│   │   ├── Step7Format.tsx
│   │   ├── Step8Contact.tsx
│   │   ├── Step9Result.tsx
│   │   └── FormComponents.tsx
│   ├── utils/
│   │   ├── cn.ts
│   │   └── validate.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── vercel.json
└── package.json
```

## 📱 Экраны приложения

1. **Приветствие** - заголовок и кнопка начала
2. **Личная информация** - имя, возраст, рост, вес
3. **Ситуация** - инсульт, инфаркт, травма, хроническое, другое
4. **Время** - сколько времени прошло с момента события
5. **Детали** - симптомы в зависимости от ситуации
6. **Хронические заболевания** - гипертония, астма, диабет, другое
7. **Формат занятий** - самостоятельно, онлайн, лично, не знаю
8. **Контакты** - телефон, email, согласие
9. **Результат** - кнопка покупки методички и Telegram бот

## 🎨 Дизайн

- Бело-зелёная цветовая схема
- Адаптивный дизайн (ПК, планшет, смартфон)
- Зелёные кнопки с белым текстом
