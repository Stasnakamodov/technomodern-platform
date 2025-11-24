# Проблема с применением миграции orders

## Что пробовал
- ✅ psql через pooler (ports 5432, 6543)
  ❌ Результат: "Tenant or user not found"

- ✅ Direct connection к db.PROJECT_REF.supabase.co
  ❌ Результат: DNS не резолвится

- ✅ Supabase SDK через REST API
  ❌ Результат: PostgREST не поддерживает DDL

- ✅ Supabase CLI
  ❌ Результат: Требует `supabase login`

## Проблема
Credentials для PostgreSQL подключения некорректны или неполные.
Текущий пароль: `SeWc@sm#Um5vez8` - возможно это НЕ database password.

## РЕШЕНИЯ

### ✅ Вариант 1: Supabase Dashboard (САМЫЙ ПРОСТОЙ)

1. Открой: https://supabase.com/dashboard/project/rbngpxwamfkunktxjtqh/sql/new
2. Скопируй всё содержимое файла `supabase/migrations/004_create_orders_table.sql`
3. Вставь в SQL Editor
4. Нажми **RUN**
5. Проверь что таблица создана: `SELECT COUNT(*) FROM orders;` (должно вернуть 1)

### ✅ Вариант 2: Получить правильные PostgreSQL credentials

1. Открой: https://supabase.com/dashboard/project/rbngpxwamfkunktxjtqh/settings/database
2. Найди секцию **Connection String**
3. Скопируй **Session Pooler** connection string:
   ```
   postgres://postgres.rbngpxwamfkunktxjtqh:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
   ```
4. Замени `[YOUR-PASSWORD]` на РЕАЛЬНЫЙ database password из Dashboard
5. Примени миграцию:
   ```bash
   psql "ваш_connection_string" -f supabase/migrations/004_create_orders_table.sql
   ```

### ✅ Вариант 3: Supabase CLI (если есть access token)

```bash
# Login (понадобится access token с dashboard)
supabase login

# Link проект
supabase link --project-ref rbngpxwamfkunktxjtqh

# Применить миграции
supabase db push
```

## Рекомендация
Используй **Вариант 1** (Dashboard) - это займёт 30 секунд и точно сработает.

## После применения миграции
Проверь что таблица создана:
```sql
SELECT COUNT(*) FROM orders;
-- Должно вернуть: 1
```

Затем можно переходить к настройке TELEGRAM_CHAT_ID в .env.local
