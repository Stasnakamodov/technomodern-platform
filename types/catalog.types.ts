// ============================================
// ТИПЫ ДЛЯ КАТАЛОГА ТЕХНОМОДЕРН
// Единственный источник истины для типов
// ============================================

// ============================================
// ПРОДУКТЫ
// ============================================

// Тип продукта из API (snake_case - как в БД)
export interface ProductFromAPI {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  sku: string | null
  category_id: string
  category_name: string
  supplier_id: string
  supplier_name: string
  in_stock: boolean
  min_order: number
  created_at: string
}

// Тип продукта для UI компонентов (camelCase)
export interface Product {
  id: string
  name: string
  price: number
  description: string
  images: string[]
  specifications?: Record<string, string>
  category: string
  category_id?: string
  inStock: boolean
  minOrder: number
  sku?: string
  supplier_name?: string
}

// Функция конвертации API -> UI
export function apiProductToUI(product: ProductFromAPI): Product {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    description: product.description,
    images: product.images,
    category: product.category_name,
    category_id: product.category_id,
    inStock: product.in_stock,
    minOrder: product.min_order,
    sku: product.sku || undefined,
    supplier_name: product.supplier_name
  }
}

// Ответ API для списка продуктов
export interface ProductsAPIResponse {
  products: ProductFromAPI[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// ============================================
// КАТЕГОРИИ
// ============================================

// Тип категории из API
export interface CategoryFromAPI {
  id: string
  name: string
  slug: string
  icon: string | null
  parent_id: string | null
  level: number
  product_count: number
  subcategories_count?: number
}

// Алиас для совместимости (категория одинаковая в API и UI)
export type Category = CategoryFromAPI

// ============================================
// ФИЛЬТРЫ И СОРТИРОВКА
// ============================================

export type SortBy = 'price' | 'name' | 'created_at'
export type SortOrder = 'asc' | 'desc'

export interface ProductFilters {
  categoryId?: string
  search?: string
  page?: number
  limit?: number
  sortBy?: SortBy
  sortOrder?: SortOrder
}

// ============================================
// КОРЗИНА
// ============================================

export interface CartItem {
  id: string
  name: string
  supplier_name: string
  price: number
  quantity: number
  total_price: number
  currency: string
  image_url?: string
  sku?: string
}

export interface Cart {
  items: CartItem[]
  supplier?: Supplier
  total_amount: number
  currency: string
}

// ============================================
// ПОСТАВЩИКИ
// ============================================

export interface Supplier {
  id: string
  name: string
  company_name: string
  category: string
  country: string
  city: string
  description: string
  logo_url?: string

  // Контактная информация
  email: string
  phone: string
  website?: string
  contact_person: string

  // Бизнес-профиль
  min_order: string
  response_time: string
  employees: string
  established: string
  certifications: string[]
  specialties?: string[]

  // Платежи
  payment_methods: string[]
  payment_method?: string
  bank_name?: string
  bank_account?: string
  swift_code?: string
  crypto_address?: string

  // Товары
  products?: Product[]

  // Мета
  verified?: boolean
  rating?: number
  reviews_count?: number
  created_at?: string
  updated_at?: string
}

// ============================================
// КОРЗИНА В БД (будущая интеграция)
// ============================================

export interface ProjectCart {
  id: string
  user_id: string
  supplier_id?: string
  supplier_type?: 'verified' | 'user'
  supplier_name: string
  supplier_data?: Supplier
  cart_items: { items: CartItem[] }
  total_amount: number
  currency: string
  status: 'active' | 'converted' | 'expired'
  created_at: string
  updated_at: string
  converted_to_project_id?: string
  expires_at: string
}

// ============================================
// PROPS ДЛЯ КОМПОНЕНТОВ
// ============================================

export interface CatalogClientProps {
  initialProducts: ProductFromAPI[]
  initialCategories: CategoryFromAPI[]
  initialTotal: number
  initialHasMore: boolean
  initialSortBy?: SortBy
  initialSortOrder?: SortOrder
}
