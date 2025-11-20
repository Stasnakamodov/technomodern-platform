"use client"

import { useState, useRef } from "react"
import { Send, Package, MessageCircle, Phone, Mail, User, Link as LinkIcon, Upload, X, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function OrderFormSection() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [productImage, setProductImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    customer_telegram: "",
    product_name: "",
    product_url: "",
    quantity: "1",
    target_price: "",
    message: "",
    marketplace: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Проверка размера (макс 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Файл слишком большой",
          description: "Максимальный размер изображения: 10MB",
        })
        return
      }

      // Проверка типа файла
      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Неверный тип файла",
          description: "Пожалуйста, загрузите изображение",
        })
        return
      }

      setProductImage(file)

      // Создание превью
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setProductImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Конвертируем изображение в base64 если оно есть
      let productImageBase64 = null
      if (productImage) {
        const reader = new FileReader()
        productImageBase64 = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => {
            const result = reader.result as string
            // Удаляем префикс "data:image/...;base64,"
            const base64 = result.split(',')[1]
            resolve(base64)
          }
          reader.onerror = reject
          reader.readAsDataURL(productImage)
        })
      }

      const response = await fetch('/api/orders/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          quantity: parseInt(formData.quantity) || 1,
          target_price: formData.target_price ? parseFloat(formData.target_price) : undefined,
          product_image: productImageBase64,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "✅ Заявка отправлена!",
          description: "Мы получили вашу заявку и скоро свяжемся с вами.",
        })

        // Очистка формы
        setFormData({
          customer_name: "",
          customer_phone: "",
          customer_email: "",
          customer_telegram: "",
          product_name: "",
          product_url: "",
          quantity: "1",
          target_price: "",
          message: "",
          marketplace: "",
        })
        handleRemoveImage()
      } else {
        toast({
          variant: "destructive",
          title: "❌ Ошибка отправки",
          description: data.error || "Не удалось отправить заявку. Попробуйте позже.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "❌ Ошибка",
        description: "Произошла ошибка при отправке заявки.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="order" className="py-20 px-4 bg-gradient-to-b from-muted/20 to-background max-md:py-12">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12 max-md:mb-8">
          <h2 className="text-4xl font-bold mb-4 max-md:text-3xl max-md:mb-3">
            Оставьте заявку
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto max-md:text-base max-md:px-2">
            Заполните форму и мы свяжемся с вами в ближайшее время для обсуждения деталей
          </p>
        </div>

        {/* Form Card */}
        <Card className="p-8 shadow-lg max-md:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Контактная информация */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Контактная информация
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer_name">
                    Ваше имя <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="customer_name"
                    name="customer_name"
                    placeholder="Иван Иванов"
                    value={formData.customer_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer_phone">
                    Телефон <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="customer_phone"
                    name="customer_phone"
                    type="tel"
                    placeholder="+7 999 123 45 67"
                    value={formData.customer_phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer_email">Email</Label>
                  <Input
                    id="customer_email"
                    name="customer_email"
                    type="email"
                    placeholder="example@mail.com"
                    value={formData.customer_email}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer_telegram">Telegram</Label>
                  <Input
                    id="customer_telegram"
                    name="customer_telegram"
                    placeholder="@username"
                    value={formData.customer_telegram}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Информация о товаре */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Информация о товаре
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product_name">Название товара</Label>
                  <Input
                    id="product_name"
                    name="product_name"
                    placeholder="Например: Смартфон iPhone 15 Pro"
                    value={formData.product_name}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product_url">Ссылка на товар</Label>
                  <Input
                    id="product_url"
                    name="product_url"
                    type="url"
                    placeholder="https://www.alibaba.com/product/..."
                    value={formData.product_url}
                    onChange={handleChange}
                  />
                </div>

                {/* Загрузка фото товара */}
                <div className="space-y-2">
                  <Label>Фото товара</Label>
                  <div className="flex flex-col gap-3">
                    {imagePreview ? (
                      // Превью загруженного изображения
                      <div className="relative inline-block">
                        <div className="relative w-full h-40 rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
                          <img
                            src={imagePreview}
                            alt="Превью товара"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      // Кнопка загрузки
                      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary/50 hover:bg-gray-50 transition-all group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-10 h-10 text-gray-400 group-hover:text-primary transition-colors mb-2" />
                          <p className="text-sm text-gray-600 font-medium mb-1">
                            Нажмите для загрузки фото
                          </p>
                          <p className="text-xs text-gray-400">
                            PNG, JPG или WEBP до 10MB
                          </p>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Загрузите фото товара, если у вас нет ссылки
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="marketplace">Площадка</Label>
                    <Input
                      id="marketplace"
                      name="marketplace"
                      placeholder="Alibaba, 1688, Taobao"
                      value={formData.marketplace}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Количество</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="1"
                      placeholder="1"
                      value={formData.quantity}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="target_price">Целевая цена (₽)</Label>
                    <Input
                      id="target_price"
                      name="target_price"
                      type="number"
                      step="0.01"
                      placeholder="10000"
                      value={formData.target_price}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Дополнительная информация */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                Дополнительная информация
              </h3>

              <div className="space-y-2">
                <Label htmlFor="message">Комментарий</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Опишите ваши требования к товару, желаемые сроки доставки и другие детали..."
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full md:w-auto px-8"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>Отправка...</>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Отправить заявку
                </>
              )}
            </Button>

            <p className="text-sm text-muted-foreground">
              <span className="text-red-500">*</span> — обязательные поля
            </p>
          </form>
        </Card>

        {/* Additional info */}
        <div className="mt-8 text-center text-sm text-muted-foreground max-md:mt-6">
          <p>
            Отправляя заявку, вы соглашаетесь с обработкой персональных данных
          </p>
          <p className="mt-2">
            Мы ответим вам в течение 24 часов
          </p>
        </div>
      </div>
    </section>
  )
}
