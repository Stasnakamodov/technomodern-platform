import { NextResponse } from 'next/server'
import { getCategories } from '@/lib/catalog'

export async function GET() {
  try {
    const categories = await getCategories()

    return NextResponse.json({ categories }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
