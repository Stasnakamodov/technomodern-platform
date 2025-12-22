# ВНИМАНИЕ: Общая база данных Supabase

## Критическая информация

Supabase проект `rbngpxwamfkunktxjtqh` используется **ДВУМЯ** независимыми приложениями:

| Проект | Схема | Описание |
|--------|-------|----------|
| **Техномодер** | `public` | E-commerce платформа (этот проект) |
| **Козырный Crypto** | `kozyrny` | Crypto/Education платформа |

---

## Таблицы Техномодера (схема `public`) - МОЖНО ИЗМЕНЯТЬ

```
public.products
public.categories
public.suppliers
public.product_suppliers
public.orders
public.project_carts
public.admin_users
public.bot_states
```

## Таблицы Козырного (схема `kozyrny`) - ЗАПРЕЩЕНО ТРОГАТЬ

```
kozyrny.users
kozyrny.education_modules
kozyrny.education_lessons
kozyrny.lesson_tests
kozyrny.user_lesson_progress
kozyrny.test_results
kozyrny.achievements
kozyrny.trading_signals
kozyrny.crypto_news
```

---

## Правила безопасности

### При написании миграций:

```sql
-- ✅ ПРАВИЛЬНО - явно указывай схему
CREATE TABLE public.new_table (...);
DROP TABLE public.old_table;
ALTER TABLE public.products ADD COLUMN ...;

-- ❌ НЕПРАВИЛЬНО - без схемы опасно!
CREATE TABLE new_table (...);
DROP TABLE old_table;
```

### При работе с Supabase MCP:

```sql
-- ✅ ПРАВИЛЬНО
SELECT * FROM public.products;
INSERT INTO public.orders (...) VALUES (...);

-- ❌ ОПАСНО - может затронуть чужую схему
DROP TABLE users;  -- Какую именно?!
```

---

## Общие ресурсы (осторожно!)

| Ресурс | Риск | Рекомендация |
|--------|------|--------------|
| `auth.users` | 🔴 Высокий | Используем разные auth или prefix |
| Storage buckets | 🟡 Средний | Называть с префиксом: `technomodern-*` |
| Edge Functions | 🟡 Средний | Называть с префиксом: `tm-*` |
| Extensions | 🟢 Низкий | Общие, но безопасные |

---

## Подключение

```env
# Техномодер использует эти credentials
NEXT_PUBLIC_SUPABASE_URL=https://rbngpxwamfkunktxjtqh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI
```

```bash
# Для DDL операций (psql)
PGPASSWORD='SeWc@sm#Um5vez8' psql "postgresql://postgres.rbngpxwamfkunktxjtqh:SeWc%40sm%23Um5vez8@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

---

## Чек-лист перед миграцией

- [ ] Все таблицы указаны с префиксом `public.`
- [ ] Нет DROP/ALTER без явной схемы
- [ ] Нет упоминания `kozyrny.*`
- [ ] Storage buckets названы с `technomodern-` или `tm-`
- [ ] Edge functions названы с `tm-` префиксом

---

## Контакты

При вопросах о схеме `kozyrny` - обращаться к команде Козырного.
Этот проект (Техномодер) работает ТОЛЬКО со схемой `public`.
