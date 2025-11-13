'use client'

import type { Product } from '@/types/catalog.types'

/**
 * Упрощённая карточка товара для отладки
 * Минимум стилей, максимум видимости
 */
export default function SimpleProductCard({ product }: { product: Product }) {
  return (
    <div
      style={{
        border: '2px solid #e11d48',
        padding: '16px',
        backgroundColor: '#fef2f2',
        borderRadius: '8px',
        minHeight: '200px'
      }}
    >
      <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
        {product.name}
      </h3>
      <p style={{ color: '#666', marginBottom: '8px' }}>
        {product.supplier_name}
      </p>
      <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#9333ea' }}>
        {product.price.toLocaleString('ru-RU')} ₽
      </p>
      <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
        MOQ: {product.minOrder} шт
      </p>
      {product.images && product.images[0] && (
        <img
          src={product.images[0]}
          alt={product.name}
          style={{
            width: '100%',
            height: '150px',
            objectFit: 'cover',
            marginTop: '12px',
            borderRadius: '4px'
          }}
        />
      )}
    </div>
  )
}
