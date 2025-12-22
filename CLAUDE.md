# Инструкции для Claude Code - Проект Техномодер

## КРИТИЧНО: Общая база Supabase

**Supabase `rbngpxwamfkunktxjtqh` делится между ДВУМЯ проектами!**

### Моя схема: `public`
```
public.products, public.categories, public.suppliers
public.product_suppliers, public.orders, public.project_carts
public.admin_users, public.bot_states
```

### ЗАПРЕТНАЯ схема: `kozyrny` (Козырный Crypto Platform)
```
kozyrny.users, kozyrny.education_modules, kozyrny.education_lessons
kozyrny.lesson_tests, kozyrny.user_lesson_progress, kozyrny.test_results
kozyrny.achievements, kozyrny.trading_signals, kozyrny.crypto_news
```

### Правила SQL:
```sql
-- ВСЕГДА указывай схему явно!
CREATE TABLE public.xxx (...);
ALTER TABLE public.products ...;
SELECT * FROM public.categories;

-- НИКОГДА не делай так:
DROP TABLE users;  -- Опасно! Какая схема?
```

---

## Подключение к Supabase

```
URL: https://rbngpxwamfkunktxjtqh.supabase.co
ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI
```

---

## Деплой

- **Продакшен**: https://techno-modern.ru
- **VPS**: 82.146.62.235 (root / Pizda333)
- **PM2**: `pm2 restart technomodern`
- **Git**: `main` branch → auto-deploy

---

## Структура проекта

- `/app` - Next.js App Router pages
- `/components` - React компоненты
- `/lib` - Утилиты, Supabase клиент
- `/supabase/migrations` - SQL миграции
- `/public/images` - Статические изображения
