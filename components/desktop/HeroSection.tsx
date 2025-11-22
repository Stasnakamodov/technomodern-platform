'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import HeaderSearch from "../header-search"
import { useState, useEffect, useRef } from "react"

export default function HeroSectionDesktop() {
  const [isSticky, setIsSticky] = useState(false)
  const [expandProgress, setExpandProgress] = useState(0)
  const searchRef = useRef<HTMLDivElement>(null)
  const initialTopRef = useRef<number | null>(null)

  useEffect(() => {
    // Запоминаем начальную позицию поисковой строки при загрузке
    const setInitialPosition = () => {
      if (searchRef.current && initialTopRef.current === null) {
        const rect = searchRef.current.getBoundingClientRect()
        initialTopRef.current = rect.top + window.scrollY
      }
    }

    // Устанавливаем начальную позицию после небольшой задержки для корректного рендера
    setTimeout(setInitialPosition, 100)

    const handleScroll = () => {
      if (initialTopRef.current === null) {
        setInitialPosition()
        return
      }

      const scrollY = window.scrollY

      // Точка, когда поисковая строка достигает верха экрана
      const stickyPoint = initialTopRef.current

      if (scrollY >= stickyPoint) {
        setIsSticky(true)
        // Прогресс расширения от 0 до 1 (за 300px скролла после прилипания)
        const scrollAfterSticky = scrollY - stickyPoint
        const progress = Math.min(scrollAfterSticky / 300, 1)
        setExpandProgress(progress)
      } else {
        setIsSticky(false)
        setExpandProgress(0)
      }
    }

    const handleResize = () => {
      // Пересчитываем позицию при изменении размера окна
      initialTopRef.current = null
      setInitialPosition()
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-6 py-24">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Desktop: все рамки видны */}
          <div className="absolute w-[2200px] h-[2200px] border-2 border-muted/25 rotate-45 rounded-[220px]" />
          <div className="absolute w-[1800px] h-[1800px] border-2 border-muted/20 rotate-45 rounded-[180px]" />
          <div className="absolute w-[1400px] h-[1400px] border-2 border-primary/15 rotate-45 rounded-[140px]" />
          <div className="absolute w-[1000px] h-[1000px] border-2 border-primary/20 rotate-45 rounded-[100px]" />
          <div className="absolute w-[600px] h-[600px] border-2 border-primary/25 rotate-45 rounded-[80px]" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-7xl font-bold leading-tight">
            Помогаем селлерам закупать у <span className="text-primary block">зарубежных поставщиков</span>
          </h1>

          <p className="text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Для продавцов на Ozon, Wildberries и Яндекс Маркете. +100500 товаров · Собственная B2B сеть · CRM система
          </p>

          <div className="flex flex-col items-center gap-6 pt-4 w-full max-w-2xl mx-auto">
            {/* Поисковая строка в hero - placeholder когда sticky */}
            <div
              ref={searchRef}
              className="w-full"
              style={{
                visibility: isSticky ? 'hidden' : 'visible',
                height: '56px'
              }}
            >
              <HeaderSearch />
            </div>
            <Link href="/catalog">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
                Создать заказ
              </Button>
            </Link>
          </div>

          {/* Fixed поисковая строка - появляется при скролле */}
          <div
            className="fixed top-0 left-0 right-0 z-40 px-6 py-3"
            style={{
              opacity: isSticky ? 1 : 0,
              pointerEvents: isSticky ? 'auto' : 'none',
              background: `rgba(255, 255, 255, ${0.8 + expandProgress * 0.2})`,
              backdropFilter: 'blur(12px)',
              boxShadow: `0 1px 3px rgba(0, 0, 0, ${0.1 + expandProgress * 0.05})`,
            }}
          >
            <div
              className="mx-auto"
              style={{
                maxWidth: `${672 + (expandProgress * 400)}px`,
              }}
            >
              <HeaderSearch />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
