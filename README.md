# Uyzo — веб-приложение (Next.js + Supabase)

Каркас маркетплейса объявлений: лента (недвижимость / товары / мастера) и страница объявления, данные берутся из вашей базы Supabase.

## Технологии
Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · Supabase.

## Переменные окружения
Нужны два значения из Supabase → Settings → API:

```
NEXT_PUBLIC_SUPABASE_URL=https://ВАШ-ПРОЕКТ.supabase.co
NEXT_PUBLIC_SUPABASE_KEY=sb_publishable_xxxxxxxx
```

Публичный (publishable) ключ безопасен для фронтенда. Секретный ключ (`sb_secret_…`) сюда НЕ вставляется.

## Как выложить на Vercel (без командной строки)
1. Залейте эту папку в новый репозиторий на GitHub (через кнопку **Add file → Upload files** на github.com), имя репозитория — `uyzo-app`.
2. На vercel.com → **Add New → Project** → импортируйте репозиторий `uyzo-app`.
3. На шаге настройки добавьте две переменные окружения (см. выше) — значения из Supabase.
4. Нажмите **Deploy**. Через ~1–2 минуты появится ссылка вида `uyzo-app.vercel.app`.

## Данные для показа
Если лента пустая — откройте Supabase → SQL Editor и выполните `seed.sql` (лежит в корне): он добавит демо-объявления по Ташкенту.

## Локальный запуск (по желанию, для разработчика)
```
npm install
cp .env.example .env.local   # и впишите значения
npm run dev                  # http://localhost:3000
```

## Что дальше по плану
Вход по SMS (Supabase Auth) · форма подачи объявления с загрузкой фото · AI-заполнение и индекс цены · Telegram Mini App · оплата продвижения (Payme/Click).
