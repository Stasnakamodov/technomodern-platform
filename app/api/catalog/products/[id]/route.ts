import { NextRequest, NextResponse } from 'next/server'
import { getProduct, deleteProduct, restoreProduct } from '@/lib/catalog'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/catalog/products/[id]
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const product = await getProduct(id)

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// DELETE /api/catalog/products/[id] - soft delete
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const success = await deleteProduct(id)

    if (!success) {
      return NextResponse.json(
        { error: 'Product not found or already deleted' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message: 'Product deleted' })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}

// PATCH /api/catalog/products/[id] - restore or update
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()

    // Если restore=true - восстанавливаем удалённый товар
    if (body.restore === true) {
      const success = await restoreProduct(id)

      if (!success) {
        return NextResponse.json(
          { error: 'Product not found or not deleted' },
          { status: 404 }
        )
      }

      return NextResponse.json({ success: true, message: 'Product restored' })
    }

    // TODO: Обновление товара
    return NextResponse.json(
      { error: 'Update not implemented' },
      { status: 501 }
    )
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}
