'use client'

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronRight, ChevronLeft, Smartphone, Sofa, Shirt, Hammer, Sparkles, Dumbbell } from "lucide-react"
import Image from "next/image"
import { useRef, useState, useEffect } from "react"
import type { ReactElement } from 'react'

// Типы для fallback данных
interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  product_count: number
}

interface CatalogStats {
  totalProducts: number
  categories: Category[]
}

async function getCatalogStats(): Promise<CatalogStats> {
  try {
    // Получаем общее количество товаров
    const { count: totalProducts, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('in_stock', true)

    // Проверяем ошибку запроса
    if (countError) {
      console.error('Error fetching product count:', countError)
      throw countError
    }

    // Получаем категории верхнего уровня с количеством товаров
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name, slug, icon, product_count')
      .eq('level', 1)
      .order('display_order', { ascending: true })

    // Проверяем ошибку запроса
    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError)
      throw categoriesError
    }

    return {
      totalProducts: totalProducts || 0,
      categories: categories || []
    }

  } catch (error) {
    // Логируем ошибку для debugging
    console.error('Failed to fetch catalog stats:', error)

    // Возвращаем fallback данные вместо краша
    return {
      totalProducts: 10000,
      categories: [
        {
          id: 'fallback-1',
          name: 'Электроника',
          slug: 'electronics',
          icon: null,
          product_count: 2500
        },
        {
          id: 'fallback-2',
          name: 'Мебель',
          slug: 'furniture',
          icon: null,
          product_count: 1800
        },
        {
          id: 'fallback-3',
          name: 'Одежда',
          slug: 'clothing',
          icon: null,
          product_count: 3200
        },
        {
          id: 'fallback-4',
          name: 'Строительство',
          slug: 'construction',
          icon: null,
          product_count: 2500
        },
        {
          id: 'fallback-5',
          name: 'Красота и здоровье',
          slug: 'beauty',
          icon: null,
          product_count: 1200
        },
        {
          id: 'fallback-6',
          name: 'Спорт и отдых',
          slug: 'sports',
          icon: null,
          product_count: 1500
        }
      ]
    }
  }
}

export default function CatalogSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [canScrollLeft, setCanScrollLeft] = useState(false)

  // Статические данные для категорий
  const totalProducts = 259

  // Мапим категории из БД на иконки и изображения
  const categoryMap: Record<string, { icon: ReactElement; image: string; tags: string[] }> = {
    'electronics': {
      icon: <Smartphone className="w-10 h-10 text-primary" />,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bf1f8985-d5ec-498d-b3a3-92cf2664e47f-J5QzF7yzEr8rHengA3WsxPCUd3w44e.png",
      tags: ["Смартфоны", "Ноутбуки", "Наушники"]
    },
    'clothing': {
      icon: <Shirt className="w-10 h-10 text-primary" />,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-L1C9EvLDqT7Ls41tq5CasY0a5XrH6k.png",
      tags: ["Верхняя одежда", "Обувь", "Джинсы"]
    },
    'furniture': {
      icon: <Sofa className="w-10 h-10 text-primary" />,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-K6xBoMEnG3LiOudSyAXgEhpXepelZb.png",
      tags: ["Офисная мебель", "Мягкая мебель", "Спальня"]
    },
    'construction': {
      icon: <Hammer className="w-10 h-10 text-primary" />,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-KBszHhTKI6EVsEIy6RGpZcjWsHoFsC.png",
      tags: ["Электроинструменты", "Освещение", "Умный дом"]
    },
    'beauty': {
      icon: <Sparkles className="w-10 h-10 text-primary" />,
      image: "/images/beauty.jpg",
      tags: ["Косметика", "Уход за кожей", "Парфюмерия"]
    },
    'sports': {
      icon: <Dumbbell className="w-10 h-10 text-primary" />,
      image: "/images/sports.jpg",
      tags: ["Тренажеры", "Спортивная одежда", "Инвентарь"]
    }
  }

  // Все 6 категорий для отображения
  const displayCategories = [
    { name: 'Электроника', slug: 'electronics', product_count: 76 },
    { name: 'Одежда', slug: 'clothing', product_count: 75 },
    { name: 'Мебель', slug: 'furniture', product_count: 60 },
    { name: 'Строительство', slug: 'construction', product_count: 48 },
    { name: 'Красота и здоровье', slug: 'beauty', product_count: 28 },
    { name: 'Спорт и отдых', slug: 'sports', product_count: 38 }
  ].map(cat => ({
    name: cat.name,
    count: `${cat.product_count} товаров`,
    slug: cat.slug,
    icon: categoryMap[cat.slug]?.icon || <Smartphone className="w-10 h-10 text-primary" />,
    image: categoryMap[cat.slug]?.image || '',
    tags: categoryMap[cat.slug]?.tags || []
  }))

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
      setCanScrollLeft(scrollLeft > 10)
    }
  }

  useEffect(() => {
    checkScrollability()
    window.addEventListener('resize', checkScrollability)
    return () => window.removeEventListener('resize', checkScrollability)
  }, [])

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' })
      setTimeout(checkScrollability, 400)
    }
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' })
      setTimeout(checkScrollability, 400)
    }
  }

  return (
    <section id="catalog" className="py-24 px-6 bg-gradient-to-br from-background to-primary/5 max-md:py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 max-md:mb-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Товары от проверенных <span className="text-primary">поставщиков</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Выбирайте товары из нашего каталога или добавляйте своих поставщиков. Все цены актуальны, все поставщики
            проверены.
          </p>
        </div>

        <div className="relative">
          {/* Контейнер карусели */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4"
            onScroll={checkScrollability}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {displayCategories.map((category, index) => (
              <Link key={index} href={`/catalog?category=${encodeURIComponent(category.name)}`} className="flex-shrink-0 w-[280px] md:w-[300px]">
                <Card className="group overflow-hidden hover:border-primary/50 transition-all hover:shadow-xl cursor-pointer h-full">
                  <CardContent className="p-0">
                  <div className="relative h-48 bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                    {category.image ? (
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                          {category.icon}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold">{category.name}</h3>
                      <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {category.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              </Link>
            ))}
          </div>

          {/* Стрелка слева */}
          {canScrollLeft && (
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
              aria-label="Показать предыдущие категории"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
          )}

          {/* Стрелка справа */}
          {canScrollRight && (
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
              aria-label="Показать больше категорий"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          )}
        </div>

        <div className="mt-12 text-center">
          <Link href="/catalog">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6">
              Открыть каталог
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
