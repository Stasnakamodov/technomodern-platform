// Типы для данных каталога из JSON

declare module '*/realistic-catalog-v2.json' {
  interface Category {
    id: string
    name: string
    icon: string
    subcategories: string[]
  }

  interface Supplier {
    name: string
    country: string
    city: string
    verified: boolean
    rating: number
  }

  interface Product {
    id: string
    name: string
    category: string
    subcategory: string
    description: string
    price_1688_cny: number
    price_rub: number
    margin_percent: number
    supplier: string
    supplier_city: string
    supplier_verified: boolean
    supplier_rating: number
    moq: number
    in_stock: boolean
    image_url: string
    specifications: Record<string, string>
    created_at: string
  }

  interface CatalogData {
    generated_at: string
    total_products: number
    categories: Category[]
    suppliers: Supplier[]
    products: Product[]
  }

  const data: CatalogData
  export default data
}
