import { supabaseServer } from './supabase-server'

// ============================================
// ТИПЫ (экспортируются для использования везде)
// ============================================

export interface ProductFilters {
  categoryId?: string
  search?: string
  page?: number
  limit?: number
  sortBy?: 'price' | 'name' | 'created_at'
  sortOrder?: 'asc' | 'desc'
}

export interface ProductResult {
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

export interface ProductsResponse {
  products: ProductResult[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  parent_id: string | null
  level: number
  product_count: number
  subcategories_count: number
}

// ============================================
// УТИЛИТЫ
// ============================================

// Санитизация поискового запроса для безопасности
function sanitizeSearchQuery(query: string | undefined): string | null {
  if (!query) return null
  // Удаляем потенциально опасные символы для SQL/PostgREST
  return query
    .trim()
    .slice(0, 100) // Ограничиваем длину
    .replace(/[%_\\]/g, '\\$&') // Экранируем специальные символы LIKE
}

// Валидация UUID
function isValidUUID(id: string | undefined): boolean {
  if (!id) return false
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(id)
}

// Маппинг продукта из БД в результат
function mapProductResult(p: any): ProductResult {
  return {
    id: p.id,
    name: p.name,
    description: p.description || '',
    price: p.price,
    images: p.images || [],
    sku: p.sku,
    category_id: p.category_id,
    category_name: p.category_name || p.categories?.name || 'Без категории',
    supplier_id: p.supplier_id,
    supplier_name: p.supplier_name || p.suppliers?.name || 'Неизвестный поставщик',
    in_stock: p.in_stock,
    min_order: p.min_order || 1,
    created_at: p.created_at
  }
}

// ============================================
// ОСНОВНЫЕ ФУНКЦИИ
// ============================================

// Получение товаров через RPC (безопасно, параметризованный запрос)
async function fetchProductsRPC(filters: ProductFilters): Promise<ProductsResponse> {
  const {
    categoryId,
    search,
    page = 1,
    limit = 20,
    sortBy = 'created_at',
    sortOrder = 'desc'
  } = filters

  // Валидация categoryId если передан
  if (categoryId && !isValidUUID(categoryId)) {
    throw new Error('Invalid category ID format')
  }

  const { data, error } = await supabaseServer.rpc('search_products', {
    search_query: sanitizeSearchQuery(search),
    cat_id: categoryId || null,
    page_num: Math.max(1, page),
    page_size: Math.min(100, Math.max(1, limit)), // Ограничение 1-100
    sort_by: sortBy,
    sort_order: sortOrder
  })

  if (error) {
    console.error('Error fetching products via RPC:', error)
    throw new Error(`Failed to fetch products: ${error.message}`)
  }

  const products = data || []
  const total = products.length > 0 ? Number(products[0].total_count) : 0
  const hasMore = page * limit < total

  return {
    products: products.map(mapProductResult),
    total,
    page,
    limit,
    hasMore
  }
}

// Fallback: прямой запрос (с безопасными фильтрами)
async function fetchProductsDirect(filters: ProductFilters): Promise<ProductsResponse> {
  const {
    categoryId,
    search,
    page = 1,
    limit = 20,
    sortBy = 'created_at',
    sortOrder = 'desc'
  } = filters

  const offset = (page - 1) * limit
  const sanitizedSearch = sanitizeSearchQuery(search)

  let query = supabaseServer
    .from('products')
    .select(`
      id,
      name,
      description,
      price,
      images,
      sku,
      category_id,
      supplier_id,
      in_stock,
      min_order,
      created_at,
      deleted_at,
      categories!inner(name),
      suppliers(name)
    `, { count: 'exact' })
    .eq('in_stock', true)
    .is('deleted_at', null)

  // Фильтр по категории (безопасно через eq)
  if (categoryId && isValidUUID(categoryId)) {
    query = query.eq('category_id', categoryId)
  }

  // Поиск - безопасный способ через textSearch или отдельные ilike
  if (sanitizedSearch) {
    // Используем безопасный способ построения фильтра
    query = query.or(
      `name.ilike.%${sanitizedSearch}%,description.ilike.%${sanitizedSearch}%,sku.ilike.%${sanitizedSearch}%`
    )
  }

  // Сортировка
  query = query.order(sortBy, { ascending: sortOrder === 'asc' })

  // Пагинация
  query = query.range(offset, offset + limit - 1)

  let { data, error, count } = await query

  // Если ошибка с deleted_at — пробуем без неё (до миграции)
  if (error && error.message.includes('deleted_at')) {
    const fallbackQuery = supabaseServer
      .from('products')
      .select(`
        id,
        name,
        description,
        price,
        images,
        sku,
        category_id,
        supplier_id,
        in_stock,
        min_order,
        created_at,
        categories!inner(name),
        suppliers(name)
      `, { count: 'exact' })
      .eq('in_stock', true)

    let finalQuery = fallbackQuery

    if (categoryId && isValidUUID(categoryId)) {
      finalQuery = finalQuery.eq('category_id', categoryId)
    }

    if (sanitizedSearch) {
      finalQuery = finalQuery.or(
        `name.ilike.%${sanitizedSearch}%,description.ilike.%${sanitizedSearch}%,sku.ilike.%${sanitizedSearch}%`
      )
    }

    finalQuery = finalQuery.order(sortBy, { ascending: sortOrder === 'asc' })
    finalQuery = finalQuery.range(offset, offset + limit - 1)

    const result = await finalQuery
    data = result.data as typeof data
    error = result.error
    count = result.count
  }

  if (error) {
    console.error('Error fetching products directly:', error)
    throw new Error(`Failed to fetch products: ${error.message}`)
  }

  const total = count || 0
  const hasMore = page * limit < total

  return {
    products: (data || []).map(mapProductResult),
    total,
    page,
    limit,
    hasMore
  }
}

// ============================================
// КЭШИРОВАННЫЕ ФУНКЦИИ
// ============================================

// Получение категорий (без кэша - данные всегда свежие)
// Кэширование происходит на уровне API route с Cache-Control header
async function fetchCategoriesFromDB(): Promise<Category[]> {
  // Пробуем RPC - считает реальное количество товаров
  const { data: rpcData, error: rpcError } = await supabaseServer.rpc('get_categories_with_counts')

  if (!rpcError && rpcData) {
    return rpcData
  }

  // Fallback: прямой запрос
  const { data, error } = await supabaseServer
    .from('categories')
    .select('id, name, slug, icon, parent_id, level, product_count')
    .order('level')
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    throw new Error(`Failed to fetch categories: ${error.message}`)
  }

  // Добавляем subcategories_count
  const categories = data || []
  return categories.map(cat => ({
    ...cat,
    subcategories_count: categories.filter(c => c.parent_id === cat.id).length
  }))
}

// ============================================
// ЭКСПОРТИРУЕМЫЕ ФУНКЦИИ
// ============================================

// Получение товаров с серверной фильтрацией и пагинацией
export async function getProducts(filters: ProductFilters): Promise<ProductsResponse> {
  return fetchProductsRPC(filters)
}

// Fallback функция для прямых запросов
export async function getProductsDirect(filters: ProductFilters): Promise<ProductsResponse> {
  return fetchProductsDirect(filters)
}

// Получение категорий (свежие данные из БД)
export async function getCategories(): Promise<Category[]> {
  return fetchCategoriesFromDB()
}

// Получение одного товара
export async function getProduct(id: string): Promise<ProductResult | null> {
  if (!isValidUUID(id)) {
    return null
  }

  const { data, error } = await supabaseServer
    .from('products')
    .select(`
      id,
      name,
      description,
      price,
      images,
      sku,
      category_id,
      supplier_id,
      in_stock,
      min_order,
      created_at,
      categories(name),
      suppliers(name)
    `)
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (error || !data) {
    return null
  }

  return mapProductResult(data)
}

// Soft delete товара
export async function deleteProduct(id: string): Promise<boolean> {
  if (!isValidUUID(id)) {
    return false
  }

  const { data, error } = await supabaseServer.rpc('soft_delete_product', {
    product_id: id
  })

  if (error) {
    // Fallback: прямой UPDATE
    const { error: updateError } = await supabaseServer
      .from('products')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .is('deleted_at', null)

    return !updateError
  }

  return data === true
}

// Восстановление товара
export async function restoreProduct(id: string): Promise<boolean> {
  if (!isValidUUID(id)) {
    return false
  }

  const { data, error } = await supabaseServer.rpc('restore_product', {
    product_id: id
  })

  if (error) {
    // Fallback
    const { error: updateError } = await supabaseServer
      .from('products')
      .update({ deleted_at: null })
      .eq('id', id)
      .not('deleted_at', 'is', null)

    return !updateError
  }

  return data === true
}

// Получение товаров по ID категории (включая подкатегории) через RPC
// Один запрос вместо N+1
export async function getProductsByCategoryTree(
  categoryId: string,
  filters: Omit<ProductFilters, 'categoryId'>
): Promise<ProductsResponse> {
  if (!isValidUUID(categoryId)) {
    throw new Error('Invalid category ID format')
  }

  const {
    search,
    page = 1,
    limit = 20,
    sortBy = 'created_at',
    sortOrder = 'desc'
  } = filters

  // Пробуем RPC (один запрос)
  const { data: rpcData, error: rpcError } = await supabaseServer.rpc('get_products_by_category_tree', {
    parent_cat_id: categoryId,
    search_query: sanitizeSearchQuery(search),
    page_num: Math.max(1, page),
    page_size: Math.min(100, Math.max(1, limit)),
    sort_by: sortBy,
    sort_order: sortOrder
  })

  if (!rpcError && rpcData) {
    const products = rpcData || []
    const total = products.length > 0 ? Number(products[0].total_count) : 0

    return {
      products: products.map(mapProductResult),
      total,
      page,
      limit,
      hasMore: page * limit < total
    }
  }

  // Fallback: N+1 запрос (если RPC не существует)
  console.warn('RPC get_products_by_category_tree not available, using fallback')

  // Получаем все подкатегории
  const { data: subcategories } = await supabaseServer
    .from('categories')
    .select('id')
    .eq('parent_id', categoryId)

  const categoryIds = [categoryId, ...(subcategories?.map(s => s.id) || [])]

  const offset = (page - 1) * limit
  const sanitizedSearch = sanitizeSearchQuery(search)

  let query = supabaseServer
    .from('products')
    .select(`
      id,
      name,
      description,
      price,
      images,
      sku,
      category_id,
      supplier_id,
      in_stock,
      min_order,
      created_at,
      categories(name),
      suppliers(name)
    `, { count: 'exact' })
    .is('deleted_at', null)
    .eq('in_stock', true)
    .in('category_id', categoryIds)

  if (sanitizedSearch) {
    query = query.or(
      `name.ilike.%${sanitizedSearch}%,description.ilike.%${sanitizedSearch}%`
    )
  }

  query = query.order(sortBy, { ascending: sortOrder === 'asc' })
  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) {
    throw new Error(`Failed to fetch products: ${error.message}`)
  }

  const total = count || 0

  return {
    products: (data || []).map(mapProductResult),
    total,
    page,
    limit,
    hasMore: page * limit < total
  }
}
