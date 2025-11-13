# 📚 Руководство по использованию Catalog API

**Проект:** ТехноМодерн - B2B платформа
**База данных:** Supabase PostgreSQL
**Дата:** 2025-11-11

---

## 🔑 Подключение к Supabase

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rbngpxwamfkunktxjtqh.supabase.co'
const supabaseAnonKey = 'YOUR_ANON_KEY' // Получить в Supabase Dashboard
const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

## 📋 Основные операции

### 1. Работа с поставщиками (Suppliers)

#### Получить всех поставщиков
```javascript
const { data, error } = await supabase
  .from('suppliers')
  .select('*')
  .order('rating', { ascending: false })
```

#### Получить только проверенных поставщиков
```javascript
const { data, error } = await supabase
  .from('suppliers')
  .select('*')
  .eq('verified', true)
  .order('rating', { ascending: false })
```

#### Создать нового поставщика
```javascript
const { data, error } = await supabase
  .from('suppliers')
  .insert([
    {
      name: 'Shanghai Electronics Ltd',
      description: 'Крупнейший поставщик электроники',
      country: 'China',
      verified: true,
      rating: 4.85,
      logo_url: 'https://example.com/logo.png'
    }
  ])
  .select()
```

#### Обновить поставщика
```javascript
const { data, error } = await supabase
  .from('suppliers')
  .update({ rating: 4.90, total_orders: 150 })
  .eq('id', supplierId)
  .select()
```

---

### 2. Работа с категориями (Categories)

#### Получить все категории верхнего уровня
```javascript
const { data, error } = await supabase
  .from('categories')
  .select('*')
  .eq('level', 1)
  .order('display_order')
```

#### Получить категорию с подкатегориями (иерархия)
```javascript
// Сначала получаем родительскую категорию
const { data: parent } = await supabase
  .from('categories')
  .select('*')
  .eq('slug', 'electronics')
  .single()

// Затем её подкатегории
const { data: children } = await supabase
  .from('categories')
  .select('*')
  .eq('parent_id', parent.id)
  .order('display_order')
```

#### Создать категорию
```javascript
const { data, error } = await supabase
  .from('categories')
  .insert([
    {
      name: 'Электроника',
      slug: 'electronics',
      level: 1,
      icon: '📱',
      display_order: 0
    }
  ])
  .select()
```

#### Создать подкатегорию
```javascript
const { data, error } = await supabase
  .from('categories')
  .insert([
    {
      name: 'Смартфоны',
      slug: 'smartphones',
      level: 2,
      parent_id: parentCategoryId,
      display_order: 0
    }
  ])
  .select()
```

---

### 3. Работа с товарами (Products)

#### Получить все товары с информацией о поставщике и категории
```javascript
const { data, error } = await supabase
  .from('products')
  .select(`
    *,
    supplier:suppliers(*),
    category:categories(*)
  `)
  .eq('in_stock', true)
  .order('created_at', { ascending: false })
  .limit(20)
```

#### Поиск товаров по названию (Full-Text Search)
```javascript
const { data, error } = await supabase
  .from('products')
  .select('*')
  .textSearch('name', 'iPhone', {
    type: 'websearch',
    config: 'russian'
  })
```

#### Фильтр товаров по категории
```javascript
const { data, error } = await supabase
  .from('products')
  .select(`
    *,
    supplier:suppliers(name, rating, verified)
  `)
  .eq('category_id', categoryId)
  .eq('in_stock', true)
  .order('price', { ascending: true })
```

#### Фильтр по цене
```javascript
const { data, error } = await supabase
  .from('products')
  .select('*')
  .gte('price', 100)  // >= 100
  .lte('price', 1000) // <= 1000
  .order('price', { ascending: true })
```

#### Создать товар
```javascript
const { data, error } = await supabase
  .from('products')
  .insert([
    {
      supplier_id: supplierId,
      category_id: categoryId,
      name: 'iPhone 15 Pro Max',
      description: 'Флагманский смартфон Apple',
      sku: 'IPHONE-15-PRO-MAX-256GB',
      price: 999.99,
      currency: 'USD',
      min_order: 1,
      in_stock: true,
      images: [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg'
      ],
      specifications: {
        display: '6.7 inch',
        memory: '256GB',
        color: 'Titanium'
      },
      tags: ['apple', 'smartphone', 'premium']
    }
  ])
  .select()
```

#### Обновить просмотры товара
```javascript
const { data, error } = await supabase
  .rpc('increment_views', { product_id: productId })

// Или через UPDATE:
const { data: product } = await supabase
  .from('products')
  .select('views')
  .eq('id', productId)
  .single()

await supabase
  .from('products')
  .update({ views: product.views + 1 })
  .eq('id', productId)
```

---

### 4. Работа с корзиной (Project Carts)

#### Получить корзину пользователя
```javascript
const { data, error } = await supabase
  .from('project_carts')
  .select(`
    *,
    product:products(
      *,
      supplier:suppliers(name, verified)
    )
  `)
  .eq('user_id', userId)
```

#### Добавить товар в корзину
```javascript
const { data, error } = await supabase
  .from('project_carts')
  .insert([
    {
      user_id: userId,
      product_id: productId,
      quantity: 2,
      price: 999.99,
      total_price: 1999.98,
      currency: 'USD'
    }
  ])
  .select()
```

#### Обновить количество в корзине
```javascript
const newQuantity = 5
const price = 999.99

const { data, error } = await supabase
  .from('project_carts')
  .update({
    quantity: newQuantity,
    total_price: price * newQuantity
  })
  .eq('user_id', userId)
  .eq('product_id', productId)
  .select()
```

#### Удалить товар из корзины
```javascript
const { error } = await supabase
  .from('project_carts')
  .delete()
  .eq('user_id', userId)
  .eq('product_id', productId)
```

#### Очистить всю корзину
```javascript
const { error } = await supabase
  .from('project_carts')
  .delete()
  .eq('user_id', userId)
```

#### Получить общую сумму корзины
```javascript
const { data, error } = await supabase
  .from('project_carts')
  .select('total_price')
  .eq('user_id', userId)

const totalAmount = data?.reduce((sum, item) => sum + parseFloat(item.total_price), 0)
```

---

## 🔍 Продвинутые запросы

### Поиск с фильтрами
```javascript
const { data, error } = await supabase
  .from('products')
  .select(`
    *,
    supplier:suppliers(name, rating, verified),
    category:categories(name, slug)
  `)
  .eq('in_stock', true)
  .gte('price', minPrice)
  .lte('price', maxPrice)
  .contains('tags', ['smartphone']) // Поиск по тегам
  .order('created_at', { ascending: false })
  .limit(20)
  .range(0, 19) // Пагинация
```

### Подсчет количества товаров в категории
```javascript
const { count, error } = await supabase
  .from('products')
  .select('*', { count: 'exact', head: true })
  .eq('category_id', categoryId)
  .eq('in_stock', true)
```

### Получить популярные товары
```javascript
const { data, error } = await supabase
  .from('products')
  .select('*')
  .eq('in_stock', true)
  .order('views', { ascending: false })
  .limit(10)
```

### Получить товары с характеристиками (JSONB)
```javascript
const { data, error } = await supabase
  .from('products')
  .select('*')
  .contains('specifications', { color: 'Titanium' })
```

---

## 📊 Аналитика и статистика

### Топ поставщиков по рейтингу
```javascript
const { data, error } = await supabase
  .from('suppliers')
  .select('name, rating, total_orders')
  .eq('verified', true)
  .order('rating', { ascending: false })
  .limit(10)
```

### Категории с количеством товаров
```javascript
const { data, error } = await supabase
  .from('categories')
  .select(`
    *,
    products:products(count)
  `)
  .eq('level', 1)
  .order('product_count', { ascending: false })
```

---

## 🎯 Real-time подписки (опционально)

### Отслеживание изменений в товарах
```javascript
const channel = supabase
  .channel('products-changes')
  .on('postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'products'
    },
    (payload) => {
      console.log('Change detected:', payload)
    }
  )
  .subscribe()
```

### Отслеживание корзины пользователя
```javascript
const channel = supabase
  .channel(`cart-${userId}`)
  .on('postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'project_carts',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      console.log('Cart updated:', payload)
    }
  )
  .subscribe()
```

---

## 🔐 Row Level Security (для Production)

После включения RLS, нужно создать политики:

```sql
-- Разрешить всем читать товары
CREATE POLICY "Allow public read access" ON products
  FOR SELECT USING (true);

-- Разрешить пользователю управлять только своей корзиной
CREATE POLICY "Users can manage their cart" ON project_carts
  FOR ALL USING (auth.uid()::text = user_id);
```

---

## 💡 Полезные советы

1. **Используйте пагинацию** для больших списков товаров
2. **Кешируйте** запросы категорий (они редко меняются)
3. **Индексы** уже настроены для быстрого поиска
4. **Full-text search** работает на русском языке
5. **JSONB specifications** позволяет хранить любые характеристики
6. **Массивы images** и **tags** легко фильтруются через `contains()`

---

## 📞 Полезные ссылки

- [Supabase JS Client Docs](https://supabase.com/docs/reference/javascript)
- [PostgreSQL Full-Text Search](https://www.postgresql.org/docs/current/textsearch.html)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)

---

**Последнее обновление:** 2025-11-11
