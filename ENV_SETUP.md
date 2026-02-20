# Инструкция по настройке переменных окружения

## Для локальной разработки (.env.local)

1. Скопируйте `.env.example` в `.env.local`
2. Заполните значения:

```env
# io.net API Key для Kimi K2
# Получите на https://io.net/
IO_NET_API_KEY=ваш_ключ_здесь

# Email для отправки PDF
# Gmail аккаунт для отправки писем
EMAIL_USER=rover38354@gmail.com
EMAIL_PASSWORD=ваш_app_password
```

### Как получить IO_NET_API_KEY:
1. Зарегистрируйтесь на https://io.net/
2. Перейдите в раздел API Keys
3. Создайте новый ключ
4. Скопируйте и вставьте в `.env.local`

### Как получить App Password для Gmail:
1. Зайдите в https://myaccount.google.com/
2. Выберите "Безопасность" (Security)
3. Включите "Двухэтапную аутентификацию" (если не включена)
4. Вернитесь назад и выберите "Пароли приложений" (App Passwords)
5. Выберите приложение "Mail" и устройство "Other"
6. Скопируйте 16-значный пароль
7. Вставьте в `.env.local` без пробелов

---

## Для продакшена (Vercel)

1. Зайдите в https://vercel.com/dashboard
2. Выберите проект `rehabflow`
3. Перейдите в Settings → Environment Variables
4. Добавьте переменные:

| Название | Значение | Окружение |
|----------|----------|-----------|
| `IO_NET_API_KEY` | ваш ключ io.net | Production, Preview, Development |
| `EMAIL_USER` | rover38354@gmail.com | Production, Preview, Development |
| `EMAIL_PASSWORD` | app password от Gmail | Production, Preview, Development |
| `TELEGRAM_BOT_TOKEN` | токен бота | Production, Preview, Development |
| `TELEGRAM_CHAT_ID` | ID чата | Production, Preview, Development |

5. Нажмите "Save"
6. Сделайте новый деплой для применения изменений

---

## Проверка работы

После настройки переменных:

1. Запустите локально: `npm run dev`
2. Пройдите анкету
3. На странице результата нажмите "Сгенерировать полный комплекс (299₽)"
4. Проверьте email — должно прийти письмо с PDF

---

## Структура переменных

```
TELEGRAM_BOT_TOKEN     → Токен Telegram бота (@BotFather)
TELEGRAM_CHAT_ID       → ID чата для уведомлений
IO_NET_API_KEY         → Ключ API io.net для Kimi K2
EMAIL_USER             → Gmail для отправки писем
EMAIL_PASSWORD         → App Password от Gmail
```
