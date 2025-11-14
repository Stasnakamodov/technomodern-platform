// Типы для каталога ТехноМодерн

export interface Product {
  id: string
  name: string
  price: number
  description: string
  images: string[]
  specifications?: Record<string, string>
  category: string
  category_id?: string // UUID категории из БД
  inStock: boolean
  minOrder: number
  sku?: string
  supplier_name?: string
}

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

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  subcategories?: Category[]
  products_count?: number
}

// Типы для корзины в БД (будущая интеграция)
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
