'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import MobileHeaderSearch from "./HeaderSearch"
import { useState, useEffect, useRef } from "react"

export default function HeroSectionMobile() {
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
    <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4 py-16 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Mobile: только относительные размеры для адаптивности */}
          <div
            className="absolute w-[150vw] h-[150vw] border-2 border-primary/20 rotate-45 rounded-[100px]"
            style={{ willChange: 'transform' }}
          />
          <div
            className="absolute w-[100vw] h-[100vw] border-2 border-primary/25 rotate-45 rounded-[80px]"
            style={{ willChange: 'transform' }}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <h1 className="text-3xl font-bold leading-tight px-4">
            Закупки у{' '}
            <span className="text-primary">зарубежных поставщиков</span>
          </h1>

          <p className="text-base text-muted-foreground max-w-sm mx-auto leading-relaxed px-4">
            Для селлеров Ozon, Wildberries и Яндекс Маркет
          </p>

          <div className="flex flex-col items-center gap-4 pt-2 px-4 w-full max-w-md mx-auto">
            {/* Поисковая строка в hero - placeholder когда sticky */}
            <div
              ref={searchRef}
              className="w-full"
              style={{
                visibility: isSticky ? 'hidden' : 'visible',
                height: '56px'
              }}
            >
              <MobileHeaderSearch />
            </div>
            <Link href="/catalog" className="w-full">
              <Button size="lg" variant="outline" className="text-lg px-8 py-7 bg-transparent w-full font-semibold">
                Смотреть каталог
              </Button>
            </Link>
          </div>

          {/* Fixed поисковая строка - iOS Safari style с полупрозрачным фоном */}
          <div
            className="fixed top-0 left-0 right-0 z-40 px-3 py-2 transition-all duration-300 ease-out"
            style={{
              transform: isSticky ? 'translate3d(0, 0, 0)' : 'translate3d(0, -100%, 0)',
              opacity: isSticky ? 1 : 0,
              pointerEvents: isSticky ? 'auto' : 'none',
              background: 'rgba(255, 255, 255, 0.72)',
              backdropFilter: 'saturate(180%) blur(20px)',
              WebkitBackdropFilter: 'saturate(180%) blur(20px)',
              borderBottom: '0.5px solid rgba(0, 0, 0, 0.08)',
              willChange: 'transform, opacity',
            }}
          >
            <div className="mx-auto">
              <MobileHeaderSearch isSticky={true} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
