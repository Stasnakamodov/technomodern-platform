# 🚀 Инструкция по деплою на Vercel

## 📋 Предварительные требования

Репозиторий: https://github.com/Stasnakamodov/technomodern-platform (приватный)

## 🎯 Способ 1: Деплой через Vercel Dashboard (Рекомендуется)

### Шаг 1: Подключение к Vercel

1. Откройте https://vercel.com/login
2. Войдите через GitHub
3. Нажмите **"Add New..."** → **"Project"**
4. В списке репозиториев найдите **technomodern-platform**
   - Если не видите репозиторий, нажмите **"Adjust GitHub App Permissions"** и разрешите доступ к приватному репозиторию

### Шаг 2: Настройка проекта

1. **Framework Preset**: Next.js (должен определиться автоматически)
2. **Root Directory**: `./` (корень проекта)
3. **Build Command**: `npm run build` (по умолчанию)
4. **Output Directory**: `.next` (по умолчанию)

### Шаг 3: Environment Variables

Добавьте следующие переменные окружения:

```
NEXT_PUBLIC_SUPABASE_URL=https://rbngpxwamfkunktxjtqh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI
NEXT_PUBLIC_TELEGRAM_URL=https://t.me/technomodern_support
NEXT_PUBLIC_WHATSAPP_NUMBER=79991234567
UNSPLASH_ACCESS_KEY=hqFoDoRVmIBT9YnswQsPEyfwwC2MBMggezWakuIfz3M
PEXELS_API_KEY=5jjdYAJtucoGUjLZMMQQMyHpyxios2sTTNXlj3UNFSzC8UTkoXxGQj2G
```

**Как добавить:**
- Для каждой переменной: вставьте **Name** (например, `NEXT_PUBLIC_SUPABASE_URL`) и **Value**
- Нажимайте **Add** после каждой переменной
- Убедитесь что все 6 переменных добавлены

### Шаг 4: Деплой

1. Нажмите **"Deploy"**
2. Дождитесь завершения сборки (обычно 2-3 минуты)
3. После успешного деплоя получите URL вида: `https://technomodern-platform.vercel.app`

---

## 🎯 Способ 2: Деплой через Vercel CLI

### Установка CLI

```bash
npm install -g vercel
```

Если есть проблемы с правами:

```bash
sudo chown -R $(whoami) "/Users/$(whoami)/.npm"
npm install -g vercel
```

### Логин

```bash
vercel login
```

### Деплой проекта

```bash
# В корневой директории проекта
vercel

# При первом деплое ответьте на вопросы:
# ? Set up and deploy? [Y/n] Y
# ? Which scope? (выберите ваш аккаунт)
# ? Link to existing project? [y/N] N
# ? What's your project's name? technomodern-platform
# ? In which directory is your code located? ./

# Добавьте environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add NEXT_PUBLIC_TELEGRAM_URL
vercel env add NEXT_PUBLIC_WHATSAPP_NUMBER
vercel env add UNSPLASH_ACCESS_KEY
vercel env add PEXELS_API_KEY

# Production деплой
vercel --prod
```

---

## ✅ Проверка после деплоя

### 1. Главная страница
- Откройте URL деплоя
- Проверьте что хедер загружается
- Проверьте что секции отображаются корректно

### 2. Каталог
- Перейдите на `/catalog`
- Проверьте что категории загружаются из Supabase
- Проверьте что товары отображаются
- Проверьте что изображения загружаются

### 3. Контакты
- Проверьте что кнопка Telegram открывает правильную ссылку
- Проверьте что кнопка WhatsApp работает

### 4. Проверка Build Logs
В Vercel Dashboard → Project → Deployments → Latest → View Function Logs

Убедитесь что нет ошибок:
- ✅ Build успешен
- ✅ Нет TypeScript ошибок
- ✅ Нет Runtime ошибок

---

## 🔧 Troubleshooting

### Проблема: Build failed

**Решение:**
1. Проверьте что все зависимости установлены в `package.json`
2. Проверьте что TypeScript не выдает ошибок:
   ```bash
   npm run build
   ```

### Проблема: Каталог не загружается

**Решение:**
1. Проверьте что переменные `NEXT_PUBLIC_SUPABASE_URL` и `NEXT_PUBLIC_SUPABASE_ANON_KEY` установлены
2. Проверьте что Supabase база данных доступна
3. Проверьте что Row Level Security (RLS) политики настроены правильно

### Проблема: Изображения не загружаются

**Решение:**
1. Проверьте что в Supabase таблице `products` есть колонка `image_url`
2. Проверьте что ссылки на изображения валидны (Unsplash/Pexels)

---

## 📊 Команды после деплоя

```bash
# Посмотреть список деплоев
vercel ls

# Посмотреть логи production
vercel logs

# Удалить деплой
vercel rm <deployment-url>

# Посмотреть переменные окружения
vercel env ls
```

---

## 🎉 Готово!

После успешного деплоя вы получите:
- Production URL: `https://technomodern-platform.vercel.app`
- Автоматические деплои при пуше в `main` ветку
- Preview деплои для каждого Pull Request
- HTTPS из коробки
- CDN для статики
- Edge Functions для API routes

