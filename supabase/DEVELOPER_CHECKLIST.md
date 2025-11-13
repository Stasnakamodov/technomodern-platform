# ✅ Чек-лист разработчика - ТехноМодерн Catalog

Используйте этот чек-лист для быстрой интеграции Supabase в ваш проект.

---

## 🚀 Шаг 1: Установка и настройка

### Установка пакетов
```bash
npm install @supabase/supabase-js
# или
yarn add @supabase/supabase-js
```

- [ ] Установлен `@supabase/supabase-js`

### Настройка переменных окружения
```bash
cp supabase/.env.example .env.local
```

Или создайте `.env.local` вручную:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://rbngpxwamfkunktxjtqh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

- [ ] Создан `.env.local` файл
- [ ] Добавлены SUPABASE_URL и ANON_KEY
- [ ] Добавлен SERVICE_ROLE_KEY (опционально, только для сервера)

---

## 📦 Шаг 2: Копирование готового кода

### Вариант 1: Копирование готовых функций
```bash
# Скопируйте файлы подключения в ваш проект
cp supabase/examples/client-connection.js src/lib/supabase/
cp supabase/examples/server-connection.js src/lib/supabase/
```

- [ ] Скопирован `client-connection.js`
- [ ] Скопирован `server-connection.js` (если нужны админские функции)

### Вариант 2: Использование готовых React компонентов
```bash
cp supabase/examples/react-example.jsx src/components/catalog/
```

- [ ] Скопированы React компоненты

---

## 🧪 Шаг 3: Тестирование подключения

### Тест 1: Получение товаров (клиент)
```javascript
import { getAllProducts } from '@/lib/supabase/client-connection'

const products = await getAllProducts()
console.log('Найдено товаров:', products?.length)
```

- [ ] Тест получения товаров пройден
- [ ] Данные корректно загружаются

### Тест 2: Поиск товаров
```javascript
import { searchProducts } from '@/lib/supabase/client-connection'

const results = await searchProducts('iPhone')
console.log('Результаты поиска:', results)
```

- [ ] Поиск работает
- [ ] Full-text search возвращает результаты

### Тест 3: Работа с корзиной
```javascript
import { addToCart, getUserCart } from '@/lib/supabase/client-connection'

await addToCart('user-123', productId, 1, 999.99)
const cart = await getUserCart('user-123')
console.log('В корзине:', cart?.length, 'товаров')
```

- [ ] Добавление в корзину работает
- [ ] Получение корзины работает

---

## 🔐 Шаг 4: Настройка безопасности (Production)

### Включение Row Level Security
Выполните в Supabase SQL Editor:

```sql
-- Включить RLS на всех таблицах
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_carts ENABLE ROW LEVEL SECURITY;
```

- [ ] RLS включен на всех таблицах

### Создание политик доступа

```sql
-- Разрешить всем читать товары
CREATE POLICY "Allow public read products" ON products
  FOR SELECT USING (true);

-- Разрешить всем читать категории
CREATE POLICY "Allow public read categories" ON categories
  FOR SELECT USING (true);

-- Разрешить всем читать поставщиков
CREATE POLICY "Allow public read suppliers" ON suppliers
  FOR SELECT USING (true);

-- Разрешить пользователю управлять своей корзиной
CREATE POLICY "Users manage own cart" ON project_carts
  FOR ALL USING (auth.uid()::text = user_id);
```

- [ ] Созданы политики для чтения товаров
- [ ] Созданы политики для чтения категорий
- [ ] Созданы политики для корзины

---

## 📊 Шаг 5: Наполнение данными

### Импорт категорий
```javascript
import { bulkCreateCategories } from '@/lib/supabase/server-connection'

const categories = [
  { name: 'Электроника', slug: 'electronics', level: 1 },
  { name: 'Одежда', slug: 'clothing', level: 1 },
  // ...
]

await bulkCreateCategories(categories)
```

- [ ] Импортированы основные категории
- [ ] Созданы подкатегории

### Импорт поставщиков
```javascript
import { createSupplier } from '@/lib/supabase/server-connection'

const suppliers = [
  {
    name: 'Shanghai Electronics Ltd',
    country: 'China',
    verified: true,
    rating: 4.85
  },
  // ...
]

for (const supplier of suppliers) {
  await createSupplier(supplier)
}
```

- [ ] Добавлены проверенные поставщики
- [ ] Установлены рейтинги

### Импорт товаров
```javascript
import { bulkImportProducts } from '@/lib/supabase/server-connection'

const products = [
  {
    supplier_id: '...',
    category_id: '...',
    name: 'iPhone 15 Pro Max',
    price: 999.99,
    // ...
  },
  // ...
]

await bulkImportProducts(products)
```

- [ ] Загружен каталог товаров
- [ ] Проверена корректность данных

---

## 🎨 Шаг 6: Интеграция UI компонентов

### Список товаров
```jsx
import { ProductList } from '@/components/catalog'

export default function CatalogPage() {
  return <ProductList />
}
```

- [ ] Интегрирован компонент списка товаров
- [ ] Товары отображаются корректно

### Корзина
```jsx
import { ShoppingCart } from '@/components/catalog'

export default function CartPage() {
  const userId = 'user-123' // Получить из auth
  return <ShoppingCart userId={userId} />
}
```

- [ ] Интегрирована корзина
- [ ] Корзина синхронизируется с БД

### Поиск
```jsx
import { ProductSearch } from '@/components/catalog'

export default function Header() {
  return (
    <header>
      <ProductSearch />
    </header>
  )
}
```

- [ ] Интегрирован поиск
- [ ] Поиск возвращает результаты

---

## ⚡ Шаг 7: Оптимизация

### Кеширование
```javascript
// Кешировать категории (редко меняются)
const categories = await fetch('/api/categories', {
  next: { revalidate: 3600 } // 1 час
})
```

- [ ] Настроено кеширование категорий
- [ ] Настроено кеширование статических данных

### Пагинация
```javascript
const { data } = await supabase
  .from('products')
  .select('*')
  .range(0, 19) // Первые 20
  .limit(20)
```

- [ ] Добавлена пагинация товаров
- [ ] Реализована "бесконечная прокрутка" или кнопки навигации

### Мониторинг
- [ ] Настроен мониторинг медленных запросов
- [ ] Добавлен error tracking (Sentry, etc.)

---

## 🔄 Шаг 8: Real-time функции (опционально)

### Подписка на изменения товаров
```javascript
import { subscribeToProducts } from '@/lib/supabase/client-connection'

const channel = subscribeToProducts((payload) => {
  console.log('Товар изменен:', payload)
  // Обновить UI
})

// Отписаться при размонтировании
return () => supabase.removeChannel(channel)
```

- [ ] Настроены real-time подписки
- [ ] UI обновляется автоматически

---

## 📝 Шаг 9: Документация

### Внутренняя документация
- [ ] Создана документация API для команды
- [ ] Добавлены комментарии в код
- [ ] Описаны основные компоненты

### README проекта
- [ ] Добавлена информация о Supabase в README
- [ ] Описан процесс деплоя
- [ ] Добавлены инструкции для новых разработчиков

---

## 🚢 Шаг 10: Деплой в Production

### Pre-deploy чеклист
- [ ] Все тесты пройдены
- [ ] RLS включен и настроен
- [ ] Service Role Key не используется в клиенте
- [ ] Переменные окружения настроены в production
- [ ] Настроен мониторинг и логирование

### После деплоя
- [ ] Проверено подключение к БД
- [ ] Протестированы основные функции
- [ ] Проверена производительность
- [ ] Настроены бэкапы БД

---

## 📚 Полезные ссылки

- **Документация проекта:**
  - [README.md](./README.md)
  - [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
  - [API_USAGE_GUIDE.md](./API_USAGE_GUIDE.md)

- **Примеры кода:**
  - [examples/README.md](./examples/README.md)
  - [examples/client-connection.js](./examples/client-connection.js)
  - [examples/react-example.jsx](./examples/react-example.jsx)

- **Внешние ресурсы:**
  - [Supabase Dashboard](https://rbngpxwamfkunktxjtqh.supabase.co)
  - [Supabase Docs](https://supabase.com/docs)
  - [PostgreSQL Full-Text Search](https://www.postgresql.org/docs/current/textsearch.html)

---

## ✅ Финальный чеклист

- [ ] Все тесты пройдены
- [ ] Данные загружены в БД
- [ ] UI компоненты интегрированы
- [ ] Безопасность настроена
- [ ] Оптимизация выполнена
- [ ] Документация готова
- [ ] Готово к production деплою

---

**Статус:** [ ] В процессе  [ ] ✅ Готово

**Дата начала:** _____________
**Дата завершения:** _____________

---

**Проект:** ТехноМодерн
**Дата создания чеклиста:** 2025-11-11
