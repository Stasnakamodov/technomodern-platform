'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, ShoppingCart, X, Plus, Minus, Package, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import ProductCard from './components/ProductCard'
import type { Product, CartItem, Supplier } from '@/types/catalog.types'

// Тестовые данные товаров
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'IP-камера видеонаблюдения 4K',
    price: 89.99,
    description: 'Профессиональная IP-камера с разрешением 4K, ночным видением и защитой IP67',
    images: ['https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400'],
    category: 'Электроника',
    inStock: true,
    minOrder: 10,
    sku: 'CAM-4K-001',
    supplier_name: 'Tech Solutions China'
  },
  {
    id: '2',
    name: 'Офисный стул эргономичный',
    price: 125.50,
    description: 'Комфортное кресло с регулировкой высоты и поясничной поддержкой',
    images: ['https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400'],
    category: 'Мебель',
    inStock: true,
    minOrder: 20,
    sku: 'CHAIR-ERG-001',
    supplier_name: 'Furniture Plus'
  },
  {
    id: '3',
    name: 'Футболка хлопковая базовая',
    price: 4.99,
    description: '100% хлопок, высокое качество печати, различные размеры',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'],
    category: 'Одежда',
    inStock: true,
    minOrder: 100,
    sku: 'TSHIRT-001',
    supplier_name: 'Textile World'
  },
  {
    id: '4',
    name: 'Электродрель профессиональная 2000W',
    price: 156.00,
    description: 'Мощная дрель для профессионального использования',
    images: ['https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400'],
    category: 'Строительство',
    inStock: true,
    minOrder: 5,
    sku: 'DRILL-2000-001',
    supplier_name: 'Hardware Pro'
  }
]

export default function CatalogPage() {
  const [products] = useState<Product[]>(MOCK_PRODUCTS)
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('Все')

  // Загрузка корзины из localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('technomodern_cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  // Сохранение корзины в localStorage
  useEffect(() => {
    localStorage.setItem('technomodern_cart', JSON.stringify(cart))
  }, [cart])

  // Добавление товара в корзину
  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id)

    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1, total_price: (item.quantity + 1) * item.price }
          : item
      ))
    } else {
      const cartItem: CartItem = {
        id: product.id,
        name: product.name,
        supplier_name: product.supplier_name || 'Неизвестный поставщик',
        price: product.price,
        quantity: 1,
        total_price: product.price,
        currency: 'USD',
        image_url: product.images[0],
        sku: product.sku
      }
      setCart([...cart, cartItem])
    }
    setCartOpen(true)
  }

  // Изменение количества товара
  const updateQuantity = (itemId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === itemId) {
        const newQuantity = Math.max(1, item.quantity + delta)
        return { ...item, quantity: newQuantity, total_price: newQuantity * item.price }
      }
      return item
    }).filter(item => item.quantity > 0))
  }

  // Удаление товара из корзины
  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId))
  }

  // Подсчет суммы
  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.total_price, 0)
  }

  // Фильтрация товаров
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'Все' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['Все', ...Array.from(new Set(products.map(p => p.category)))]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                На главную
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Каталог товаров</h1>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Поиск товаров..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-gray-50 border-gray-200"
                />
              </div>
            </div>

            <Button
              onClick={() => setCartOpen(!cartOpen)}
              variant="outline"
              className="relative h-12 px-4"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Корзина
              {cart.length > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-purple-500 text-white">
                  {cart.length}
                </Badge>
              )}
            </Button>
          </div>

          {/* Категории */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {categories.map(category => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                className={selectedCategory === category
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Каталог товаров
          </h1>
          <p className="text-gray-600">
            Найдено {filteredProducts.length} товаров
          </p>
        </div>

        {/* Сетка товаров */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      </div>

      {/* Боковая панель корзины */}
      {cartOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setCartOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
            {/* Header корзины */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Корзина</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCartOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {cart.length} товаров
              </p>
            </div>

            {/* Список товаров */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <ShoppingCart className="h-16 w-16 mb-4" />
                  <p>Корзина пуста</p>
                </div>
              ) : (
                cart.map(item => (
                  <Card key={item.id} className="p-4">
                    <div className="flex gap-3">
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm text-gray-900 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-600 mb-2">
                          {item.supplier_name}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="h-7 w-7 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="h-7 w-7 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-2 text-sm font-bold text-purple-600">
                          ${item.total_price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>

            {/* Footer с итогом */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-200 space-y-4">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Итого:</span>
                  <span className="text-2xl text-purple-600">${getTotalPrice().toFixed(2)}</span>
                </div>
                <Button
                  className="w-full h-12 text-base bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  onClick={() => alert('Функция создания заказа будет доступна скоро!')}
                >
                  <Package className="h-5 w-5 mr-2" />
                  Оформить заказ
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
