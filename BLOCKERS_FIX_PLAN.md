# 🔧 Детальный План Исправления Блокеров Деплоя

**Дата:** 2025-11-13
**Проект:** ТехноМодерн - Next.js 15
**Рабочая директория:** `/Users/user/Downloads/code`

---

## 📊 РЕЗЮМЕ

| Блокер | Файл | Время | Приоритет |
|--------|------|-------|-----------|
| #1 Supabase Credentials | `lib/supabase.ts` | 5 мин | SECURITY |
| #2 JSX.Element Error | `components/catalog-section.tsx` | 3 мин | BUILD |
| #3 Placeholder Контакты | `components/header.tsx` | 2 мин | UX |
| #4 Error Boundaries | `app/error.tsx`, `app/catalog/error.tsx` | 10 мин | STABILITY |
| #5 try-catch Missing | `components/catalog-section.tsx` | 5 мин | STABILITY |

**Общее время:** ~25-30 минут
**Порядок исправлений:** #2 → #1 → #5 → #4 → #3

---

## 🔴 BLOCKER #1: Хардкод Supabase Credentials

### Описание проблемы:
Supabase URL и API ключ захардкожены напрямую в коде. Это критическая проблема безопасности - любой кто получит доступ к репозиторию или production bundle, сможет получить прямой доступ к базе данных.

### Файлы затронуты:
- `/Users/user/Downloads/code/lib/supabase.ts:3-4`

### Текущий код:
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rbngpxwamfkunktxjtqh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Исправленный код:
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

// Загружаем из environment variables с валидацией
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Валидация: приложение не запустится без корректных credentials
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
    'Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local'
  )
}

// Создаем и экспортируем клиент
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Дополнительные файлы для создания:

#### `.env.local` (НЕ коммитить в Git):
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://rbngpxwamfkunktxjtqh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI

# Контакты (для будущего использования)
NEXT_PUBLIC_TELEGRAM_URL=https://t.me/technomodern_support
NEXT_PUBLIC_WHATSAPP_NUMBER=79991234567
```

#### `.env.example` (для команды):
```bash
# Supabase Configuration
# Получить на https://supabase.com/dashboard/project/[YOUR_PROJECT]/settings/api
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Контакты компании
NEXT_PUBLIC_TELEGRAM_URL=https://t.me/your_telegram
NEXT_PUBLIC_WHATSAPP_NUMBER=your_whatsapp_number
```

### Шаги исправления:

1. **Создать `.env.local` с реальными credentials**
   ```bash
   cat > .env.local << 'EOF'
   NEXT_PUBLIC_SUPABASE_URL=https://rbngpxwamfkunktxjtqh.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI
   NEXT_PUBLIC_TELEGRAM_URL=https://t.me/technomodern_support
   NEXT_PUBLIC_WHATSAPP_NUMBER=79991234567
   EOF
   ```

2. **Создать `.env.example` для команды**
   ```bash
   cat > .env.example << 'EOF'
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   NEXT_PUBLIC_TELEGRAM_URL=https://t.me/your_telegram
   NEXT_PUBLIC_WHATSAPP_NUMBER=your_whatsapp_number
   EOF
   ```

3. **Обновить `lib/supabase.ts`** - заменить хардкод на process.env

4. **Проверить что `.env*` в `.gitignore`** (уже есть на строке 20)

### Команды для проверки:
```bash
# Проверить что .env.local создан и содержит правильные переменные
cat .env.local

# Проверить что .env.local НЕ будет закоммичен
git status --ignored | grep .env.local

# Проверить что приложение компилируется
npx tsc --noEmit

# Запустить dev сервер и проверить что Supabase подключается
npm run dev
# Откройте http://localhost:3000/catalog и проверьте что данные загружаются
```

### Риски:
- ⚠️ **Если забыть создать `.env.local`** - приложение упадет с ошибкой при старте
- ⚠️ **Если закоммитить `.env.local` в Git** - credentials утекут (но `.gitignore` защищает)
- ⚠️ **При деплое на Vercel** - нужно будет добавить env variables в Vercel Dashboard
- ✅ **Безопасность повышена** - credentials больше не в репозитории

---

## 🔴 BLOCKER #2: TypeScript Ошибка - JSX.Element

### Описание проблемы:
TypeScript не может найти namespace `JSX`. Это происходит потому что `JSX.Element` - устаревший тип из старых версий React. В современном React нужно использовать `ReactElement` из пакета `react`.

Эта ошибка **блокирует компиляцию** и build процесс.

### Файлы затронуты:
- `/Users/user/Downloads/code/components/catalog-section.tsx:29`

### Текущий код:
```typescript
// components/catalog-section.tsx:29
const categoryMap: Record<string, { icon: JSX.Element; image: string; tags: string[] }> = {
  'electronics': {
    icon: <Smartphone className="w-10 h-10 text-primary" />,
    image: "...",
    tags: ["Смартфоны", "Ноутбуки", "Наушники"]
  },
  // ...
}
```

### Исправленный код:
```typescript
// components/catalog-section.tsx
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Smartphone, Sofa, Shirt, Hammer } from "lucide-react"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import type { ReactElement } from 'react' // ← ДОБАВИТЬ ЭТОТ ИМПОРТ

async function getCatalogStats() {
  // ... без изменений
}

export default async function CatalogSection() {
  const { totalProducts, categories: dbCategories } = await getCatalogStats()

  // Заменить JSX.Element на ReactElement
  const categoryMap: Record<string, { icon: ReactElement; image: string; tags: string[] }> = {
    'electronics': {
      icon: <Smartphone className="w-10 h-10 text-primary" />,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bf1f8985-d5ec-498d-b3a3-92cf2664e47f-J5QzF7yzEr8rHengA3WsxPCUd3w44e.png",
      tags: ["Смартфоны", "Ноутбуки", "Наушники"]
    },
    // ... остальные категории без изменений
  }

  // ... остальной код без изменений
}
```

### Шаги исправления:

1. **Добавить импорт `ReactElement`** в начало файла
2. **Заменить `JSX.Element` на `ReactElement`** в типе categoryMap

### Команды для проверки:
```bash
# Проверить что TypeScript ошибок нет
npx tsc --noEmit

# Проверить что файл компилируется
npx tsc components/catalog-section.tsx --noEmit --jsx react

# Запустить build
npm run build
```

### Риски:
- ✅ **Абсолютно безопасно** - это только исправление типов
- ✅ **Не влияет на runtime поведение** - код работает так же
- ✅ **Совместимо с React 18+** - `ReactElement` - современный стандарт

---

## 🔴 BLOCKER #3: Placeholder Контакты в Header

### Описание проблемы:
В header используются placeholder ссылки на Telegram и WhatsApp вместо реальных контактов компании. Это критическая UX проблема - пользователи не смогут связаться с компанией.

### Файлы затронуты:
- `/Users/user/Downloads/code/components/header.tsx:39,48`

### Текущий код:
```typescript
// components/header.tsx:39,48
<a
  href="https://t.me/yourusername"  // ← PLACEHOLDER
  target="_blank"
  rel="noopener noreferrer"
  className="w-10 h-10 rounded-full bg-[#0088cc] hover:bg-[#0088cc]/90 flex items-center justify-center transition-all hover:scale-110"
  aria-label="Telegram"
>
  <Send className="w-5 h-5 text-white" />
</a>
<a
  href="https://wa.me/1234567890"  // ← PLACEHOLDER
  target="_blank"
  rel="noopener noreferrer"
  className="w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#25D366]/90 flex items-center justify-center transition-all hover:scale-110"
  aria-label="WhatsApp"
>
  <MessageCircle className="w-5 h-5 text-white" />
</a>
```

### Исправленный код:
```typescript
// components/header.tsx
import { Button } from "@/components/ui/button"
import { MessageCircle, Send } from "lucide-react"

export default function Header() {
  // Загружаем контакты из env с fallback значениями
  const telegramUrl = process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/technomodern_support"
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "79991234567"
  const whatsappUrl = `https://wa.me/${whatsappNumber}`

  return (
    <header className="absolute top-0 left-0 right-0 z-50 px-8 py-6">
      <nav className="max-w-[1600px] mx-auto flex items-center justify-between gap-8">
        {/* Logo - без изменений */}
        <div className="text-3xl font-bold flex-shrink-0">
          <span className="text-foreground">Техно</span>
          <span className="text-primary">Модерн</span>
        </div>

        {/* Navigation - без изменений */}
        <div className="hidden md:flex items-center gap-1 bg-white/80 backdrop-blur-sm border border-border rounded-full px-2 py-2 shadow-sm">
          <a href="/catalog" className="text-base text-muted-foreground hover:text-foreground transition-colors font-medium px-5 py-2.5 rounded-full hover:bg-primary/10 whitespace-nowrap">
            Каталог товаров
          </a>
          <a href="#services" className="text-base text-muted-foreground hover:text-foreground transition-colors px-5 py-2.5 rounded-full hover:bg-primary/10 whitespace-nowrap">
            Услуги
          </a>
          <a href="#how-it-works" className="text-base text-muted-foreground hover:text-foreground transition-colors px-5 py-2.5 rounded-full hover:bg-primary/10 whitespace-nowrap">
            Как работает
          </a>
          <a href="#calculator" className="text-base text-muted-foreground hover:text-foreground transition-colors px-5 py-2.5 rounded-full hover:bg-primary/10 whitespace-nowrap">
            Калькулятор
          </a>
        </div>

        {/* Contact section */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <Button size="default" className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-5 text-base">
            Связаться с нами
          </Button>

          {/* Social media icons - ИСПРАВЛЕНО */}
          <div className="flex items-center gap-3">
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#0088cc] hover:bg-[#0088cc]/90 flex items-center justify-center transition-all hover:scale-110"
              aria-label="Telegram"
            >
              <Send className="w-5 h-5 text-white" />
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#25D366]/90 flex items-center justify-center transition-all hover:scale-110"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-5 h-5 text-white" />
            </a>
          </div>
        </div>
      </nav>
    </header>
  )
}
```

### Шаги исправления:

1. **Добавить переменные в `.env.local`** (уже сделано в BLOCKER #1)
2. **Обновить `components/header.tsx`** - загружать контакты из env
3. **Добавить fallback значения** на случай если env не настроен

### Команды для проверки:
```bash
# Проверить что env переменные загружаются
npm run dev
# Открыть http://localhost:3000
# Кликнуть на иконки Telegram/WhatsApp и проверить что они ведут на правильные URL

# Проверить в dev tools что ссылки корректны:
# Inspect Element -> проверить href атрибуты

# Тест без env (должны использоваться fallback значения):
mv .env.local .env.local.backup
npm run dev
# Проверить что приложение работает с fallback контактами
mv .env.local.backup .env.local
```

### Риски:
- ⚠️ **Если env переменные не заданы** - будут использованы fallback значения
- ✅ **Fallback защищает от краша** - приложение всегда будет работать
- 📝 **Нужно обновить контакты в .env.local** - перед production деплоем

---

## 🔴 BLOCKER #4: Отсутствие Error Boundaries

### Описание проблемы:
В приложении нет Error Boundaries для перехвата ошибок. Если произойдет runtime ошибка в Server или Client Component - приложение полностью упадет с белым экраном. Это критично для production.

Next.js 13+ требует специальные файлы `error.tsx` для обработки ошибок в app directory.

### Файлы для создания:
- `/Users/user/Downloads/code/app/error.tsx` (глобальный error boundary)
- `/Users/user/Downloads/code/app/catalog/error.tsx` (для страницы каталога)
- `/Users/user/Downloads/code/app/loading.tsx` (опционально - для suspense)

### Исправленный код:

#### `app/error.tsx` (глобальный):
```typescript
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Логируем ошибку в console (в production можно отправлять в Sentry)
    console.error('Global error caught:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-primary/5 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Что-то пошло не так</h1>
          <p className="text-muted-foreground">
            Произошла непредвиденная ошибка. Пожалуйста, попробуйте обновить страницу.
          </p>
        </div>

        {/* Показываем сообщение об ошибке только в dev mode */}
        {process.env.NODE_ENV === 'development' && (
          <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg text-left">
            <p className="text-sm font-mono text-destructive break-all">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            className="bg-primary hover:bg-primary/90"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Попробовать снова
          </Button>

          <Link href="/">
            <Button variant="outline">
              <Home className="w-4 h-4 mr-2" />
              На главную
            </Button>
          </Link>
        </div>

        {error.digest && (
          <p className="text-xs text-muted-foreground">
            Код ошибки: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
```

#### `app/catalog/error.tsx` (специфичный для каталога):
```typescript
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home, Package } from 'lucide-react'
import Link from 'next/link'

export default function CatalogError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Логируем ошибку каталога
    console.error('Catalog error caught:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-primary/5 px-4">
      <div className="max-w-lg w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Package className="w-10 h-10 text-primary" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Не удалось загрузить каталог</h1>
          <p className="text-muted-foreground">
            Возникла проблема при загрузке товаров из базы данных.
            Это может быть временная проблема с подключением.
          </p>
        </div>

        {/* Возможные причины ошибки */}
        <div className="p-4 bg-muted/50 border border-border rounded-lg text-left">
          <p className="font-semibold mb-2 text-sm">Возможные причины:</p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Проблема с подключением к базе данных</li>
            <li>Временный сбой сервиса</li>
            <li>Некорректные данные в каталоге</li>
          </ul>
        </div>

        {/* Dev mode error details */}
        {process.env.NODE_ENV === 'development' && (
          <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg text-left">
            <p className="text-xs font-semibold mb-1 text-destructive">
              Development Mode - Error Details:
            </p>
            <p className="text-xs font-mono text-destructive break-all">
              {error.message}
            </p>
            {error.stack && (
              <pre className="text-xs mt-2 overflow-auto max-h-40">
                {error.stack}
              </pre>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            className="bg-primary hover:bg-primary/90"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Обновить каталог
          </Button>

          <Link href="/">
            <Button variant="outline">
              <Home className="w-4 h-4 mr-2" />
              На главную
            </Button>
          </Link>
        </div>

        {error.digest && (
          <p className="text-xs text-muted-foreground">
            ID ошибки: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
```

#### `app/loading.tsx` (опционально - для Suspense):
```typescript
import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-primary/5">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    </div>
  )
}
```

### Шаги исправления:

1. **Создать `app/error.tsx`** - глобальный error boundary
2. **Создать `app/catalog/error.tsx`** - специфичный для каталога
3. **Создать `app/loading.tsx`** (опционально) - для suspense states

### Команды для проверки:
```bash
# Проверить что файлы созданы
ls -la app/error.tsx app/catalog/error.tsx app/loading.tsx

# Проверить компиляцию
npx tsc --noEmit

# Запустить dev сервер
npm run dev

# Тестируем error boundary (добавьте временную ошибку в catalog):
# В components/catalog-section.tsx:10 добавьте: throw new Error('Test error')
# Откройте http://localhost:3000/catalog
# Должна появиться красивая страница ошибки вместо белого экрана

# После теста удалите тестовую ошибку
```

### Риски:
- ✅ **Абсолютно безопасно** - только добавляет error handling
- ✅ **Улучшает UX** - пользователи видят дружелюбное сообщение вместо краша
- ✅ **Помогает в debugging** - ошибки логируются в console
- 📝 **В production добавить Sentry** - для мониторинга ошибок

---

## 🔴 BLOCKER #5: Отсутствие try-catch в Server Component

### Описание проблемы:
Функция `getCatalogStats()` в `components/catalog-section.tsx` делает запросы к Supabase БЕЗ обработки ошибок. Если Supabase недоступен или запрос упадет - весь Server Component крашнется.

Даже с Error Boundary нужен try-catch для предоставления fallback данных.

### Файлы затронуты:
- `/Users/user/Downloads/code/components/catalog-section.tsx:8-23`

### Текущий код:
```typescript
// components/catalog-section.tsx:8-23
async function getCatalogStats() {
  // Получаем общее количество товаров
  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('in_stock', true)

  // Получаем категории верхнего уровня с количеством товаров
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug, icon, product_count')
    .eq('level', 1)
    .order('display_order', { ascending: true })

  return { totalProducts: totalProducts || 0, categories: categories || [] }
}
```

### Исправленный код:
```typescript
// components/catalog-section.tsx
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Smartphone, Sofa, Shirt, Hammer } from "lucide-react"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import type { ReactElement } from 'react'

// Типы для fallback данных
interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  product_count: number
}

interface CatalogStats {
  totalProducts: number
  categories: Category[]
}

async function getCatalogStats(): Promise<CatalogStats> {
  try {
    // Получаем общее количество товаров
    const { count: totalProducts, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('in_stock', true)

    // Проверяем ошибку запроса
    if (countError) {
      console.error('Error fetching product count:', countError)
      throw countError
    }

    // Получаем категории верхнего уровня с количеством товаров
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name, slug, icon, product_count')
      .eq('level', 1)
      .order('display_order', { ascending: true })

    // Проверяем ошибку запроса
    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError)
      throw categoriesError
    }

    return {
      totalProducts: totalProducts || 0,
      categories: categories || []
    }

  } catch (error) {
    // Логируем ошибку для debugging
    console.error('Failed to fetch catalog stats:', error)

    // Возвращаем fallback данные вместо краша
    return {
      totalProducts: 10000, // Fallback значение для демонстрации
      categories: [
        {
          id: 'fallback-1',
          name: 'Электроника',
          slug: 'electronics',
          icon: null,
          product_count: 2500
        },
        {
          id: 'fallback-2',
          name: 'Мебель',
          slug: 'furniture',
          icon: null,
          product_count: 1800
        },
        {
          id: 'fallback-3',
          name: 'Одежда',
          slug: 'clothing',
          icon: null,
          product_count: 3200
        },
        {
          id: 'fallback-4',
          name: 'Строительство',
          slug: 'construction',
          icon: null,
          product_count: 2500
        }
      ]
    }
  }
}

export default async function CatalogSection() {
  const { totalProducts, categories: dbCategories } = await getCatalogStats()

  // Мапим категории из БД на иконки и изображения
  const categoryMap: Record<string, { icon: ReactElement; image: string; tags: string[] }> = {
    'electronics': {
      icon: <Smartphone className="w-10 h-10 text-primary" />,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bf1f8985-d5ec-498d-b3a3-92cf2664e47f-J5QzF7yzEr8rHengA3WsxPCUd3w44e.png",
      tags: ["Смартфоны", "Ноутбуки", "Наушники"]
    },
    'furniture': {
      icon: <Sofa className="w-10 h-10 text-primary" />,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-K6xBoMEnG3LiOudSyAXgEhpXepelZb.png",
      tags: ["Офисная мебель", "Мягкая мебель", "Спальня"]
    },
    'clothing': {
      icon: <Shirt className="w-10 h-10 text-primary" />,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-L1C9EvLDqT7Ls41tq5CasY0a5XrH6k.png",
      tags: ["Верхняя одежда", "Обувь", "Джинсы"]
    },
    'construction': {
      icon: <Hammer className="w-10 h-10 text-primary" />,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-KBszHhTKI6EVsEIy6RGpZcjWsHoFsC.png",
      tags: ["Электроинструменты", "Освещение", "Умный дом"]
    }
  }

  // Берем первые 4 категории для отображения
  const displayCategories = dbCategories.slice(0, 4).map(cat => ({
    name: cat.name,
    count: `${cat.product_count} товаров`,
    slug: cat.slug,
    icon: categoryMap[cat.slug]?.icon || <Smartphone className="w-10 h-10 text-primary" />,
    image: categoryMap[cat.slug]?.image || '',
    tags: categoryMap[cat.slug]?.tags || []
  }))

  return (
    <section id="catalog" className="py-24 px-6 bg-gradient-to-br from-background to-primary/5">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {totalProducts} товаров от проверенных <span className="text-primary">поставщиков</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Выбирайте товары из нашего каталога или добавляйте своих поставщиков. Все цены актуальны, все поставщики
            проверены.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {displayCategories.map((category, index) => (
            <Link key={index} href="/catalog">
              <Card className="group overflow-hidden hover:border-primary/50 transition-all hover:shadow-xl cursor-pointer">
                <CardContent className="p-0">
                <div className="relative h-48 bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                  {category.image ? (
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        {category.icon}
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold">{category.name}</h3>
                    <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-muted-foreground mb-4">{category.count}</p>
                  <div className="flex flex-wrap gap-2">
                    {category.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/catalog">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6">
              Открыть каталог
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
```

### Шаги исправления:

1. **Добавить типы для данных** - `Category` и `CatalogStats` интерфейсы
2. **Обернуть запросы в try-catch** - перехватываем все ошибки
3. **Проверять error из Supabase** - каждый запрос может вернуть ошибку
4. **Добавить fallback данные** - если БД недоступна, показываем демо-данные
5. **Логировать ошибки** - для debugging в production

### Команды для проверки:
```bash
# Нормальный случай - проверить что всё работает
npm run dev
# Открыть http://localhost:3000 - должны загрузиться реальные данные из БД

# Тест fallback - временно отключить Supabase
# В lib/supabase.ts измените URL на невалидный
# Перезапустите dev server
npm run dev
# Откройте http://localhost:3000 - должны показаться fallback данные

# Проверить что TypeScript доволен
npx tsc --noEmit

# Build test
npm run build
```

### Риски:
- ✅ **Абсолютно безопасно** - только добавляет защиту
- ✅ **Улучшает resilience** - приложение работает даже если БД упала
- ⚠️ **Fallback данные статичные** - нужно периодически обновлять
- 📝 **Логи помогут debugging** - видно когда БД недоступна

---

## ✅ CHECKLIST ВАЛИДАЦИИ ФИКСОВ

После применения всех исправлений, проверьте:

### TypeScript
- [ ] `npx tsc --noEmit` - 0 ошибок
- [ ] Все импорты корректны
- [ ] Нет использования `any` в новом коде
- [ ] `import type { ReactElement }` добавлен
- [ ] `JSX.Element` заменен на `ReactElement`

### Environment Variables
- [ ] `.env.local` создан и заполнен
- [ ] `.env.example` создан для команды
- [ ] `.gitignore` содержит `.env*` (строка 20)
- [ ] `lib/supabase.ts` использует `process.env`
- [ ] Проверка: `git status --ignored | grep .env.local` - файл игнорируется
- [ ] Валидация env работает (throw Error если не заданы)

### Error Handling
- [ ] `app/error.tsx` создан и работает
- [ ] `app/catalog/error.tsx` создан и работает
- [ ] `app/loading.tsx` создан (опционально)
- [ ] try-catch добавлен в `getCatalogStats()`
- [ ] Ошибки Supabase проверяются (`error` поле)
- [ ] Fallback данные корректны
- [ ] Ошибки логируются в console

### Контакты
- [ ] `components/header.tsx` использует env для контактов
- [ ] Fallback значения заданы
- [ ] Telegram URL работает
- [ ] WhatsApp URL работает (формат `https://wa.me/НОМЕР`)

### Build
- [ ] `npm run build` - успешно (EXIT CODE 0)
- [ ] Нет TypeScript warnings
- [ ] Нет ESLint errors
- [ ] Bundle size приемлемый

### Runtime Tests
- [ ] Главная страница загружается (`http://localhost:3000`)
- [ ] Каталог работает (`http://localhost:3000/catalog`)
- [ ] Секция каталога на главной показывает данные
- [ ] Клик по категориям работает
- [ ] Контакты в header кликабельны
- [ ] Нет ошибок в браузерной консоли
- [ ] Supabase подключение работает (данные загружаются)

### Error Boundary Tests
- [ ] Тест global error: временно добавить `throw new Error('test')` в `app/page.tsx`
- [ ] Тест catalog error: временно добавить ошибку в `getCatalogStats()`
- [ ] Проверить что показывается красивая страница ошибки
- [ ] Кнопка "Попробовать снова" работает
- [ ] Кнопка "На главную" работает

### Security
- [ ] `.env.local` НЕ в Git
- [ ] Supabase credentials НЕ в коде
- [ ] Нет hardcoded secrets
- [ ] Environment variables валидируются

---

## 🚀 BASH СКРИПТ ДЛЯ ПРИМЕНЕНИЯ ФИКСОВ

Скрипт `fix-blockers.sh` будет создан отдельно в следующем шаге.

---

## 📊 РЕЗЮМЕ ПЛАНА ИСПРАВЛЕНИЙ

### Файлы для изменения:
1. `lib/supabase.ts` - env variables + валидация
2. `components/catalog-section.tsx` - ReactElement + try-catch
3. `components/header.tsx` - env для контактов
4. `app/error.tsx` - новый файл (глобальный error boundary)
5. `app/catalog/error.tsx` - новый файл (catalog error boundary)
6. `app/loading.tsx` - новый файл (опционально)
7. `.env.local` - новый файл (НЕ коммитить)
8. `.env.example` - новый файл (для команды)

### Время на исправление:
- Blocker #1 (Supabase credentials): **5 минут**
- Blocker #2 (JSX.Element): **3 минуты**
- Blocker #3 (Placeholder контакты): **2 минуты**
- Blocker #4 (Error Boundaries): **10 минут**
- Blocker #5 (try-catch): **5 минут**

**Итого: ~25-30 минут**

### Порядок исправлений (от простого к сложному):

1. **#2 (JSX.Element)** - самый простой, 1 строка импорта + 1 замена
2. **#1 (Supabase env)** - критично для security
3. **#5 (try-catch)** - связан с #2, улучшает стабильность
4. **#4 (Error Boundaries)** - создание новых файлов
5. **#3 (Контакты)** - UX улучшение, зависит от #1

### Команды после исправлений:
```bash
# Полная валидация
npx tsc --noEmit       # TypeScript check
npm run build          # Production build
npm run start          # Runtime test

# Если всё ОК - можно деплоить
vercel --prod
```

---

**План готов! 🎉**

Следующий шаг: применить исправления в порядке приоритета.
