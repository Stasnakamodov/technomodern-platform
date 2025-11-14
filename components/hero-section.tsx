import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-6 py-24 overflow-hidden max-md:px-4 max-md:py-16">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Desktop: все рамки видны | Mobile: большие скрыты */}
          <div className="absolute w-[2200px] h-[2200px] border-2 border-muted/25 rotate-45 rounded-[220px] max-md:hidden" />
          <div className="absolute w-[1800px] h-[1800px] border-2 border-muted/20 rotate-45 rounded-[180px] max-md:hidden" />
          <div className="absolute w-[1400px] h-[1400px] border-2 border-primary/15 rotate-45 rounded-[140px] max-lg:hidden" />

          {/* Desktop: фиксированные размеры | Mobile: относительные размеры */}
          <div className="absolute w-[1000px] h-[1000px] border-2 border-primary/20 rotate-45 rounded-[100px] max-md:w-[150vw] max-md:h-[150vw]" />
          <div className="absolute w-[600px] h-[600px] border-2 border-primary/25 rotate-45 rounded-[80px] max-md:w-[100vw] max-md:h-[100vw]" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 max-md:space-y-6">
          <h1 className="text-7xl font-bold leading-tight max-md:text-4xl max-md:leading-tight max-md:px-2">
            Помогаем селлерам закупать у <span className="text-primary block max-md:inline">зарубежных поставщиков</span>
          </h1>

          <p className="text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed max-md:text-lg max-md:px-2">
            Для продавцов на Ozon, Wildberries и Яндекс Маркете. +100500 товаров · Собственная B2B сеть · CRM система
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-md:px-4 max-md:w-full">
            <Link href="/catalog" className="max-md:w-full">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 max-md:w-full max-md:text-base">
                Открыть каталог
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/catalog" className="max-md:w-full">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent max-md:w-full max-md:text-base">
                Создать заказ
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
