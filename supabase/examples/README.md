# 📚 Примеры использования Supabase API

Готовые примеры кода для работы с каталогом ТехноМодерн.

## 📁 Файлы

### 1. `client-connection.js`
Клиентское подключение для браузера / React / Next.js

**Включает:**
- Настройку Supabase клиента с Anon Key
- 10 готовых функций для работы с каталогом
- Real-time подписки на изменения
- Примеры поиска, фильтрации, работы с корзиной

**Использование:**
```javascript
import { supabase, getAllProducts, addToCart } from './client-connection'

// Получить товары
const products = await getAllProducts()

// Добавить в корзину
await addToCart('user-123', productId, 2, 999.99)
```

---

### 2. `server-connection.js`
Серверное подключение с Service Role Key (полный доступ)

**Включает:**
- Административные функции
- Массовый импорт данных
- Статистика и аналитика
- Очистка старых данных

**⚠️ ВАЖНО:** Используйте ТОЛЬКО на сервере! Service Role Key дает полный доступ к БД.

**Использование:**
```javascript
import { supabaseAdmin, createSupplier, bulkImportProducts } from './server-connection'

// Создать поставщика (только на сервере!)
const supplier = await createSupplier({
  name: 'Shanghai Electronics',
  verified: true,
  rating: 4.85
})

// Массовый импорт товаров
const products = await bulkImportProducts([...])
```

---

### 3. `react-example.jsx`
Полный пример React приложения

**Включает:**
- Компонент списка товаров
- Карточка товара
- Корзина с real-time обновлением
- Поиск по каталогу
- Навигация по категориям

**Использование:**
```jsx
import CatalogApp from './react-example'

function App() {
  return <CatalogApp />
}
```

---

## 🚀 Быстрый старт

### Установка зависимостей

```bash
npm install @supabase/supabase-js
# или
yarn add @supabase/supabase-js
```

### Настройка переменных окружения

Создайте файл `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://rbngpxwamfkunktxjtqh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Импорт и использование

```javascript
// В клиентском коде
import { supabase, getAllProducts } from '@/lib/supabase/client-connection'

export default function ProductsPage() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    getAllProducts().then(setProducts)
  }, [])

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  )
}
```

```javascript
// В API route (Next.js)
import { supabaseAdmin, createSupplier } from '@/lib/supabase/server-connection'

export default async function handler(req, res) {
  const supplier = await createSupplier(req.body)
  res.json(supplier)
}
```

---

## 📖 Примеры операций

### Получить товары с фильтрами

```javascript
const { data } = await supabase
  .from('products')
  .select('*, supplier:suppliers(*)')
  .eq('in_stock', true)
  .gte('price', 100)
  .lte('price', 1000)
  .order('price', { ascending: true })
```

### Поиск по названию (Full-Text Search)

```javascript
const { data } = await supabase
  .from('products')
  .select('*')
  .textSearch('name', 'iPhone', { config: 'russian' })
```

### Работа с корзиной

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
```

### Real-time подписки

```javascript
// Подписка на изменения товаров
const channel = supabase
  .channel('products-changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'products'
  }, (payload) => {
    console.log('Изменение:', payload)
  })
  .subscribe()

// Отписаться
supabase.removeChannel(channel)
```

---

## 🔐 Безопасность

### Клиентский код (Anon Key)
- ✅ Используйте в браузере / React / Next.js клиенте
- ✅ Безопасно для публичного доступа
- ⚠️ Ограничен политиками RLS (когда включены)

### Серверный код (Service Role Key)
- ❌ НЕ используйте в браузере
- ✅ Используйте ТОЛЬКО в API routes / Server-side
- ⚠️ Полный доступ к базе данных без ограничений

---

## 💡 Полезные советы

1. **Используйте `.select()` с вложенными связями** для получения данных поставщиков и категорий
2. **Добавляйте `.limit()`** для больших списков
3. **Используйте `.textSearch()` с config: 'russian'** для поиска на русском
4. **Real-time подписки** помогают синхронизировать данные между клиентами
5. **Service Role Key** используйте только для админских операций на сервере

---

## 📞 Дополнительные ресурсы

- [Supabase JS Client Docs](https://supabase.com/docs/reference/javascript)
- [Quick Reference](../QUICK_REFERENCE.md)
- [API Usage Guide](../API_USAGE_GUIDE.md)

---

**Проект:** ТехноМодерн
**Дата:** 2025-11-11
