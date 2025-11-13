import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Smartphone, Sofa, Shirt, Hammer } from "lucide-react"
import Image from "next/image"
import { supabase } from "@/lib/supabase"

async function getCatalogStats() {
  // Получаем общее количество товаров
  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('in_stock', true)

  // Получаем категории верхнего уровня с количеством товаров
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug, icon, product_count')
    .eq('level', 1)
    .order('display_order', { ascending: true })

  return { totalProducts: totalProducts || 0, categories: categories || [] }
}

export default async function CatalogSection() {
  const { totalProducts, categories: dbCategories } = await getCatalogStats()

  // Мапим категории из БД на иконки и изображения
  const categoryMap: Record<string, { icon: JSX.Element; image: string; tags: string[] }> = {
    'electronics': {
      icon: <Smartphone className="w-10 h-10 text-primary" />,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bf1f8985-d5ec-498d-b3a3-92cf2664e47f-J5QzF7yzEr8rHengA3WsxPCUd3w44e.png",
      tags: ["Смартфоны", "Ноутбуки", "Наушники"]
    },
    'furniture': {
      icon: <Sofa className="w-10 h-10 text-primary" />,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-K6xBoMEnG3LiOudSyAXgEhpXepelZb.png",
      tags: ["Офисная мебель", "Мягкая мебель", "Спальня"]
    },
    'clothing': {
      icon: <Shirt className="w-10 h-10 text-primary" />,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-L1C9EvLDqT7Ls41tq5CasY0a5XrH6k.png",
      tags: ["Верхняя одежда", "Обувь", "Джинсы"]
    },
    'construction': {
      icon: <Hammer className="w-10 h-10 text-primary" />,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-KBszHhTKI6EVsEIy6RGpZcjWsHoFsC.png",
      tags: ["Электроинструменты", "Освещение", "Умный дом"]
    }
  }

  // Берем первые 4 категории для отображения
  const displayCategories = dbCategories.slice(0, 4).map(cat => ({
    name: cat.name,
    count: `${cat.product_count} товаров`,
    slug: cat.slug,
    icon: categoryMap[cat.slug]?.icon || <Smartphone className="w-10 h-10 text-primary" />,
    image: categoryMap[cat.slug]?.image || '',
    tags: categoryMap[cat.slug]?.tags || []
  }))

  return (
    <section id="catalog" className="py-24 px-6 bg-gradient-to-br from-background to-primary/5">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {totalProducts} товаров от проверенных <span className="text-primary">поставщиков</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Выбирайте товары из нашего каталога или добавляйте своих поставщиков. Все цены актуальны, все поставщики
            проверены.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {displayCategories.map((category, index) => (
            <Link key={index} href="/catalog">
              <Card className="group overflow-hidden hover:border-primary/50 transition-all hover:shadow-xl cursor-pointer">
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
                {/* </CHANGE> */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold">{category.name}</h3>
                    <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-muted-foreground mb-4">{category.count}</p>
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
