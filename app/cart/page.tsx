'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ShoppingCart,
  Package,
  Plus,
  Minus,
  Trash2,
  CheckCircle,
  Loader2,
  User,
  Phone,
  Mail,
  MessageSquare
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from '@/hooks/useCart'
import { checkoutAction } from '@/actions/cart'
import { toast } from 'sonner'

export default function CartPage() {
  const router = useRouter()
  const {
    items,
    totalItems,
    totalPrice,
    isEmpty,
    telegramUser,
    changeQuantity,
    removeFromCart,
    clearCart,
  } = useCart()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: telegramUser?.firstName || '',
    phone: '',
    email: '',
    message: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Укажите ваше имя')
      return
    }

    if (!formData.phone.trim()) {
      toast.error('Укажите номер телефона')
      return
    }

    // Validate phone format
    const phoneRegex = /^[\d\s\-+()]{10,}$/
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      toast.error('Проверьте формат номера телефона')
      return
    }

    setIsSubmitting(true)

    try {
      // If no telegram user, use a guest ID based on timestamp
      const userId = telegramUser?.id?.toString() || `guest_${Date.now()}`

      const result = await checkoutAction({
        telegramUserId: userId,
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: formData.email || undefined,
        message: formData.message || undefined,
      })

      if (result.error) {
        toast.error(result.error)
        return
      }

      setOrderId(result.orderId || null)
      setOrderSuccess(true)
      clearCart()
      toast.success('Заказ успешно оформлен!')
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('Произошла ошибка при оформлении заказа')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Success state
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <Card className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Заказ оформлен!
            </h1>
            {orderId && (
              <p className="text-gray-600 mb-4">
                Номер заказа: <span className="font-mono">{orderId.slice(0, 8)}</span>
              </p>
            )}
            <p className="text-gray-600 mb-6">
              Мы свяжемся с вами в ближайшее время для подтверждения заказа.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/catalog">
                <Button variant="outline">
                  <Package className="h-4 w-4 mr-2" />
                  Вернуться в каталог
                </Button>
              </Link>
              <Link href="/">
                <Button>
                  На главную
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // Empty cart
  if (isEmpty) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <Card className="p-8 text-center">
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Корзина пуста
            </h1>
            <p className="text-gray-600 mb-6">
              Добавьте товары из каталога для оформления заказа
            </p>
            <Link href="/catalog">
              <Button>
                <Package className="h-4 w-4 mr-2" />
                Перейти в каталог
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>В каталог</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Оформление заказа</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Товары ({totalItems})
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Очистить
              </Button>
            </div>

            {items.map(item => (
              <Card key={item.id} className="p-4">
                <div className="flex gap-4">
                  {item.image_url && (
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {item.name}
                    </h3>
                    {item.supplier_name && (
                      <p className="text-sm text-gray-500 mt-0.5">
                        {item.supplier_name}
                      </p>
                    )}
                    {item.sku && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        Артикул: {item.sku}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => changeQuantity(item.id, -1)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => changeQuantity(item.id, 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mt-2 text-right">
                      <span className="font-bold text-gray-900">
                        {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                      </span>
                      {item.quantity > 1 && (
                        <span className="text-sm text-gray-500 ml-2">
                          ({item.price.toLocaleString('ru-RU')} × {item.quantity})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Form */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Контактные данные
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Имя *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ваше имя"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Телефон *
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+7 (999) 123-45-67"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Комментарий
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Дополнительная информация к заказу"
                    rows={3}
                    className="mt-1"
                  />
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Итого:</span>
                    <span className="text-xl text-gray-900">
                      {totalPrice.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {totalItems} {totalItems === 1 ? 'товар' : totalItems < 5 ? 'товара' : 'товаров'}
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 text-base bg-gray-900 hover:bg-gray-800 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Оформление...
                    </>
                  ) : (
                    <>
                      <Package className="h-5 w-5 mr-2" />
                      Оформить заказ
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Нажимая кнопку, вы соглашаетесь с условиями обработки персональных данных
                </p>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
