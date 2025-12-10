import { NextRequest, NextResponse } from 'next/server'
import { getProducts, getProductsDirect, getProductsByCategoryTree } from '@/lib/catalog'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const categoryId = searchParams.get('category_id') || undefined
    const parentCategoryId = searchParams.get('parent_category_id') || undefined
    const search = searchParams.get('search') || undefined
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100) // Max 100
    // Поддержка обоих форматов: camelCase (sortBy) и snake_case (sort_by)
    const sortBy = (searchParams.get('sortBy') || searchParams.get('sort_by') || 'created_at') as 'price' | 'name' | 'created_at'
    const sortOrder = (searchParams.get('sortOrder') || searchParams.get('sort_order') || 'desc') as 'asc' | 'desc'

    let result

    // Если передан parent_category_id - ищем по всему дереву
    if (parentCategoryId) {
      result = await getProductsByCategoryTree(parentCategoryId, {
        search,
        page,
        limit,
        sortBy,
        sortOrder
      })
    } else {
      // Пробуем RPC функцию, fallback на прямой запрос
      try {
        result = await getProducts({
          categoryId,
          search,
          page,
          limit,
          sortBy,
          sortOrder
        })
      } catch {
        result = await getProductsDirect({
          categoryId,
          search,
          page,
          limit,
          sortBy,
          sortOrder
        })
      }
    }

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
