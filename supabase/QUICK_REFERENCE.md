# 🚀 Быстрая справка - ТехноМодерн Catalog API

## 📌 Подключение

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://rbngpxwamfkunktxjtqh.supabase.co',
  'YOUR_ANON_KEY' // Получить в Dashboard → Settings → API
)
```

## 🔥 Частые операции

### Товары

```javascript
// Получить все товары с поставщиком
const { data } = await supabase
  .from('products')
  .select('*, supplier:suppliers(*)')
  .eq('in_stock', true)

// Поиск товаров
const { data } = await supabase
  .from('products')
  .select('*')
  .textSearch('name', 'iPhone', { config: 'russian' })

// Фильтр по цене
const { data } = await supabase
  .from('products')
  .select('*')
  .gte('price', 100)
  .lte('price', 1000)
```

### Категории

```javascript
// Верхний уровень
const { data } = await supabase
  .from('categories')
  .select('*')
  .eq('level', 1)

// С подкатегориями
const { data } = await supabase
  .from('categories')
  .select('*')
  .eq('parent_id', categoryId)
```

### Корзина

```javascript
// Добавить в корзину
await supabase.from('project_carts').insert({
  user_id: userId,
  product_id: productId,
  quantity: 2,
  price: 999.99,
  total_price: 1999.98
})

// Получить корзину
const { data } = await supabase
  .from('project_carts')
  .select('*, product:products(*)')
  .eq('user_id', userId)

// Обновить количество
await supabase
  .from('project_carts')
  .update({ quantity: 5, total_price: 4999.95 })
  .eq('user_id', userId)
  .eq('product_id', productId)
```

## 📊 Структура таблиц

### suppliers (10 полей)
```
id, name, description, country, logo_url,
verified, rating, total_orders, created_at, updated_at
```

### categories (10 полей)
```
id, name, slug, icon, parent_id, level,
display_order, product_count, created_at, updated_at
```

### products (17 полей)
```
id, supplier_id, category_id, name, description, sku,
price, currency, min_order, in_stock, images[],
specifications{}, tags[], views, orders,
created_at, updated_at
```

### project_carts (9 полей)
```
id, user_id, product_id, quantity,
price, total_price, currency, created_at, updated_at
```

## 🔗 Ссылки

- **Dashboard**: https://rbngpxwamfkunktxjtqh.supabase.co
- **Полная документация**: API_USAGE_GUIDE.md
- **Структура БД**: MIGRATION_SUCCESS_REPORT.md

## 💡 Советы

- Используйте `.select('*')` для всех полей
- Добавляйте `.limit(20)` для больших списков
- Включите `.eq('in_stock', true)` для товаров
- Фильтр `.eq('verified', true)` для проверенных поставщиков
- Full-text search работает только на русском (`config: 'russian'`)

---

**Проект:** ТехноМодерн | **Дата:** 2025-11-11
