# 🏢 ТехноМодерн - Платформа для работы с китайскими поставщиками

Next.js 15 платформа для импорта товаров из Китая с интеграцией каталога через Supabase.

## 🚀 Быстрый старт

### Локальная разработка

1. **Клонируйте репозиторий:**
```bash
git clone https://github.com/Stasnakamodov/technomodern-platform.git
cd technomodern-platform
```

2. **Установите зависимости:**
```bash
npm install
```

3. **Настройте переменные окружения:**
```bash
cp .env.example .env.local
```

Отредактируйте `.env.local` и добавьте реальные значения:
- Supabase credentials (получите на https://supabase.com)
- Контактные данные (Telegram, WhatsApp)
- API ключи для изображений (опционально)

4. **Запустите dev сервер:**
```bash
npm run dev
```

Откройте http://localhost:3000

## 📦 Production Build

```bash
npm run build
npm start
```

## 🌐 Деплой на Vercel

Подробная инструкция в файле [DEPLOYMENT_INSTRUCTIONS.md](./DEPLOYMENT_INSTRUCTIONS.md)

**Быстрый деплой через Dashboard:**

1. Подключите репозиторий на https://vercel.com
2. Добавьте environment variables из `.env.local`
3. Нажмите Deploy

## 🗂 Структура проекта

```
technomodern-platform/
├── app/                    # Next.js 15 App Router
│   ├── catalog/           # Страница каталога
│   ├── page.tsx           # Главная страница
│   └── layout.tsx         # Основной layout
├── components/            # React компоненты
│   ├── catalog-section.tsx
│   ├── header.tsx
│   └── ui/               # shadcn/ui компоненты
├── lib/                   # Утилиты
│   ├── supabase.ts       # Supabase клиент
│   └── utils.ts
├── public/               # Статические файлы
├── supabase/            # Supabase миграции
│   └── migrations/
├── .env.example         # Шаблон переменных окружения
└── DEPLOYMENT_INSTRUCTIONS.md
```

## 🔧 Технологический стек

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel
- **Language:** TypeScript

## 📊 Основные функции

- ✅ Каталог товаров с категориями (Supabase)
- ✅ Адаптивный дизайн (mobile-first)
- ✅ Интеграция с маркетплейсами (Alibaba, Ozon, Wildberries и др.)
- ✅ Калькулятор стоимости товаров
- ✅ FAQ секция
- ✅ Контактные формы (Telegram, WhatsApp)
- ✅ Server-side рендеринг для SEO

## 🔐 Environment Variables

Необходимые переменные окружения (см. `.env.example`):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Контакты
NEXT_PUBLIC_TELEGRAM_URL=https://t.me/your_username
NEXT_PUBLIC_WHATSAPP_NUMBER=79991234567

# Опционально (для изображений)
UNSPLASH_ACCESS_KEY=your_key
PEXELS_API_KEY=your_key
```

## 📈 Supabase Schema

Таблицы базы данных:

### `categories`
- `id` (uuid, primary key)
- `name` (text)
- `slug` (text, unique)
- `description` (text)

### `products`
- `id` (uuid, primary key)
- `category_id` (uuid, foreign key)
- `name` (text)
- `description` (text)
- `price` (numeric)
- `image_url` (text)

Миграции находятся в `supabase/migrations/`

## 🧪 Тестирование

```bash
# Type checking
npm run type-check

# Build test
npm run build
```

## 📝 Лицензия

Приватный проект

## 👥 Контакты

- Telegram: [@technomodern_support](https://t.me/technomodern_support)
- WhatsApp: +7 999 123 45 67

---

**Статус:** ✅ Production Ready

Все блокеры исправлены. Build успешен. Готов к деплою.
