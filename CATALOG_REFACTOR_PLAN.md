# План рефакторинга каталога

## Текущие проблемы:
1. Все 2400+ товаров грузятся в память клиента
2. Фильтрация на клиенте (JavaScript)
3. Нет триггеров для счётчиков категорий
4. Нет soft delete
5. Выбор категории по имени, не по ID
6. Нет серверной пагинации

## Новая архитектура:

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                 │
├─────────────────────────────────────────────────────────────────┤
│  app/catalog/page.tsx (Server Component)                        │
│    ├─ Начальная загрузка: первые 20 товаров + категории        │
│    └─ SEO metadata                                              │
│                                                                 │
│  components/CatalogClient.tsx (Client Component)                │
│    ├─ URL state: ?category=xxx&search=yyy&page=1               │
│    ├─ Infinite scroll / Load more                               │
│    └─ Оптимистичные обновления                                  │
│                                                                 │
│  components/CategorySidebar.tsx                                 │
│    └─ Категории с реальными счётчиками                         │
│                                                                 │
│  components/ProductGrid.tsx                                     │
│    └─ Виртуализированный список (react-window)                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API LAYER                                │
├─────────────────────────────────────────────────────────────────┤
│  app/api/catalog/products/route.ts                              │
│    GET ?category_id=xxx&search=yyy&page=1&limit=20&sort=price  │
│    Returns: { products: [], total: number, hasMore: boolean }   │
│                                                                 │
│  app/api/catalog/categories/route.ts                            │
│    GET - все категории с актуальными счётчиками                │
│                                                                 │
│  app/api/catalog/products/[id]/route.ts                         │
│    GET - один товар                                             │
│    PATCH - обновление (админ)                                   │
│    DELETE - soft delete (админ)                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATABASE                                 │
├─────────────────────────────────────────────────────────────────┤
│  products                                                       │
│    + deleted_at TIMESTAMPTZ (soft delete)                       │
│    + search_vector TSVECTOR (полнотекстовый поиск)             │
│                                                                 │
│  categories                                                     │
│    product_count - обновляется триггером автоматически         │
│                                                                 │
│  TRIGGERS:                                                      │
│    - trg_products_search_vector (обновление поискового вектора)│
│    - trg_category_product_count (пересчёт при INSERT/UPDATE/DELETE)
│    - trg_soft_delete_update_count (при soft delete)            │
│                                                                 │
│  INDEXES:                                                       │
│    - idx_products_category_deleted (category_id, deleted_at)   │
│    - idx_products_search (search_vector с GIN)                 │
│    - idx_products_price (для сортировки)                       │
└─────────────────────────────────────────────────────────────────┘
```

## Файлы для создания/изменения:

### База данных (миграция):
- `supabase/migrations/006_catalog_refactor.sql`

### API:
- `app/api/catalog/products/route.ts` - список товаров
- `app/api/catalog/categories/route.ts` - категории
- `lib/catalog.ts` - серверные функции для работы с каталогом

### Фронтенд:
- `app/catalog/page.tsx` - Server Component (переписать)
- `app/catalog/components/CatalogClient.tsx` - Client Component (новый)
- `app/catalog/components/CategorySidebar.tsx` - боковая панель (переписать)
- `app/catalog/components/ProductGrid.tsx` - сетка товаров (новый)

### Типы:
- `types/catalog.types.ts` - обновить типы

## Порядок выполнения:
1. Миграция БД (триггеры, индексы, soft delete)
2. API routes
3. Серверные функции
4. Фронтенд компоненты
5. Тестирование
