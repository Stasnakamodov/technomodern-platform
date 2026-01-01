// Локальные данные каталога для работы без Supabase
// Автогенерация на основе realistic-catalog-v2.json

import catalogData from '../data/realistic-catalog-v2.json'

// UUID генератор на основе seed
function generateUUID(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0')
  return `${hex.slice(0, 8)}-${hex.slice(0, 4)}-4${hex.slice(1, 4)}-8${hex.slice(1, 4)}-${hex.padEnd(12, '0').slice(0, 12)}`
}

// Создаем категории с UUID
function buildCategories() {
  const categories: LocalCategory[] = []
  let displayOrder = 0

  for (const cat of catalogData.categories) {
    const parentId = generateUUID(`cat-${cat.id}`)

    // Родительская категория
    categories.push({
      id: parentId,
      name: cat.name,
      slug: cat.id,
      icon: cat.icon,
      parent_id: null,
      level: 1,
      display_order: displayOrder++,
      product_count: 0,
      subcategories_count: cat.subcategories.length
    })

    // Подкатегории
    for (let i = 0; i < cat.subcategories.length; i++) {
      const subName = cat.subcategories[i]
      const subSlug = transliterate(subName)
      categories.push({
        id: generateUUID(`subcat-${cat.id}-${subSlug}`),
        name: subName,
        slug: subSlug,
        icon: null,
        parent_id: parentId,
        level: 2,
        display_order: i,
        product_count: 0,
        subcategories_count: 0
      })
    }
  }

  return categories
}

// Простая транслитерация для slug
function transliterate(text: string): string {
  const map: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
    'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya', ' ': '-'
  }
  return text.toLowerCase().split('').map(char => map[char] || char).join('')
}

// Создаем поставщиков
function buildSuppliers() {
  return catalogData.suppliers.map((s, i) => ({
    id: generateUUID(`supplier-${i}`),
    name: s.name,
    country: s.country,
    city: s.city,
    verified: s.verified,
    rating: s.rating,
    logo_url: null,
    created_at: new Date().toISOString()
  }))
}

// Создаем товары с правильными связями
function buildProducts(categories: LocalCategory[], suppliers: LocalSupplier[]) {
  const categoryMap = new Map<string, string>()

  // Маппинг категория+подкатегория -> category_id
  for (const cat of categories) {
    if (cat.level === 2) {
      // Находим родительскую категорию
      const parent = categories.find(c => c.id === cat.parent_id)
      if (parent) {
        categoryMap.set(`${parent.name}|${cat.name}`, cat.id)
      }
    }
  }

  const supplierMap = new Map(suppliers.map(s => [s.name, s.id]))

  const products: LocalProduct[] = catalogData.products.map((p) => {
    const categoryId = categoryMap.get(`${p.category}|${p.subcategory}`) ||
                       categories.find(c => c.name === p.category)?.id ||
                       categories[0].id

    const supplierId = supplierMap.get(p.supplier) || suppliers[0].id

    return {
      id: p.id.replace('prod-', '').padStart(8, '0') + '-0000-4000-8000-000000000000',
      name: p.name,
      description: p.description,
      price: p.price_rub,
      images: [p.image_url],
      sku: `SKU-${p.id.replace('prod-', '')}`,
      category_id: categoryId,
      supplier_id: supplierId,
      in_stock: p.in_stock,
      min_order: p.moq,
      created_at: p.created_at
    }
  })

  // Обновляем счетчики товаров в категориях
  for (const product of products) {
    const cat = categories.find(c => c.id === product.category_id)
    if (cat) {
      cat.product_count++
      // Обновляем и родительскую категорию
      if (cat.parent_id) {
        const parent = categories.find(c => c.id === cat.parent_id)
        if (parent) parent.product_count++
      }
    }
  }

  return products
}

// Типы
export interface LocalCategory {
  id: string
  name: string
  slug: string
  icon: string | null
  parent_id: string | null
  level: number
  display_order: number
  product_count: number
  subcategories_count: number
}

export interface LocalSupplier {
  id: string
  name: string
  country: string
  city: string
  verified: boolean
  rating: number
  logo_url: string | null
  created_at: string
}

export interface LocalProduct {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  sku: string
  category_id: string
  supplier_id: string
  in_stock: boolean
  min_order: number
  created_at: string
}

// Инициализация данных
const localCategories = buildCategories()
const localSuppliers = buildSuppliers()
const localProducts = buildProducts(localCategories, localSuppliers)

// Экспорт данных
export const LOCAL_CATEGORIES = localCategories
export const LOCAL_SUPPLIERS = localSuppliers
export const LOCAL_PRODUCTS = localProducts

// Вспомогательные функции для поиска
export function getCategoryById(id: string): LocalCategory | undefined {
  return LOCAL_CATEGORIES.find(c => c.id === id)
}

export function getSupplierById(id: string): LocalSupplier | undefined {
  return LOCAL_SUPPLIERS.find(s => s.id === id)
}

export function getCategoryBySlug(slug: string): LocalCategory | undefined {
  return LOCAL_CATEGORIES.find(c => c.slug === slug)
}
