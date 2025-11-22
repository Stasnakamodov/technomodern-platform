"use client"

import { CheckCircle2, Package, TrendingUp, Shield } from "lucide-react"
import { useState, useEffect, useRef } from "react"

function CurrencyRotator() {
  const currencies = ["юанях", "рублях", "долларах", "дирхамах"]
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentWord = currencies[currentIndex]

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Печатаем
        if (displayText.length < currentWord.length) {
          setDisplayText(currentWord.slice(0, displayText.length + 1))
        } else {
          // Ждем перед удалением
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        // Удаляем
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1))
        } else {
          // Переходим к следующему слову
          setIsDeleting(false)
          setCurrentIndex((prev) => (prev + 1) % currencies.length)
        }
      }
    }, isDeleting ? 50 : 100)

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentIndex, currencies])

  return (
    <span className="inline-block min-w-[100px]">
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  )
}

// Mobile carousel component with auto-scroll and swipe
function MobileStepsCarousel() {
  const [activeStep, setActiveStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isUserScrolling, setIsUserScrolling] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const autoPlayDuration = 4000 // 4 seconds per step

  // Auto-scroll functionality - blocked during user interaction
  useEffect(() => {
    if (isPaused || isUserScrolling) return

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveStep((step) => (step + 1) % steps.length)
          return 0
        }
        return prev + (100 / (autoPlayDuration / 50))
      })
    }, 50)

    return () => clearInterval(progressInterval)
  }, [isPaused, isUserScrolling])

  // Scroll to active step - only when auto-scrolling (not user scrolling)
  useEffect(() => {
    if (scrollRef.current && !isUserScrolling) {
      const cardWidth = scrollRef.current.offsetWidth
      scrollRef.current.scrollTo({
        left: activeStep * cardWidth,
        behavior: 'smooth'
      })
    }
  }, [activeStep, isUserScrolling])

  // Handle manual scroll with debounce
  const handleScroll = () => {
    if (!scrollRef.current) return

    // Clear previous timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    // Debounce: wait for scroll to completely stop
    scrollTimeoutRef.current = setTimeout(() => {
      if (scrollRef.current) {
        const cardWidth = scrollRef.current.offsetWidth
        const scrollPos = scrollRef.current.scrollLeft
        const newStep = Math.round(scrollPos / cardWidth)

        if (newStep >= 0 && newStep < steps.length) {
          setActiveStep(newStep)
          setProgress(0)
        }
      }
      // End user scrolling mode after scroll settles
      setIsUserScrolling(false)
    }, 150)
  }

  const goToStep = (index: number) => {
    setIsUserScrolling(false)
    setActiveStep(index)
    setProgress(0)
    setIsPaused(true)
    setTimeout(() => setIsPaused(false), 3000)
  }

  const handleTouchStart = () => {
    setIsPaused(true)
    setIsUserScrolling(true)
    // Clear any pending scroll timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
  }

  const handleTouchEnd = () => {
    // Resume auto-scroll after delay
    setTimeout(() => {
      if (!isUserScrolling) {
        setIsPaused(false)
      }
    }, 3000)
  }

  return (
    <div
      className="md:hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Progress bar */}
      <div className="flex gap-1 mb-4 px-4">
        {steps.map((_, index) => (
          <div key={index} className="flex-1 h-1 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-75"
              style={{
                width: index === activeStep ? `${progress}%` : index < activeStep ? '100%' : '0%'
              }}
            />
          </div>
        ))}
      </div>

      {/* Swipeable cards */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-full snap-center px-4"
          >
            <div className={`
              bg-card rounded-2xl p-6 border-2 transition-all duration-300
              ${index === activeStep ? 'border-primary shadow-lg shadow-primary/20' : 'border-border'}
            `}>
              {/* Step header */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  {step.icon}
                </div>
              </div>

              {/* Step content */}
              <h3 className="font-bold text-xl mb-2">{step.title}</h3>
              <p className="text-muted-foreground mb-4">{step.description}</p>

              {/* Time badge */}
              <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full text-sm">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
                </svg>
                <span className="text-primary font-medium">{step.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => goToStep(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === activeStep ? 'bg-primary w-6' : 'bg-border'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default function PresentationSection() {
  return (
    <section id="services" className="py-24 px-6 bg-background max-md:py-12 max-md:px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 max-md:mb-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 max-md:text-3xl max-md:mb-3">4 простых шага</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto max-md:text-base max-md:px-2">
            От заявки до получения. Весь процесс — онлайн.
          </p>
        </div>
        {/* </CHANGE> */}

        {/* Mobile carousel */}
        <MobileStepsCarousel />

        {/* Desktop steps - hidden on mobile */}
        <div className="mb-16 hidden md:block">
          <div className="relative">
            {/* Progress line */}
            <div
              className="absolute top-12 left-0 right-0 h-0.5 bg-border"
              style={{ left: "calc(12.5% + 2rem)", right: "calc(12.5% + 2rem)" }}
            />

            <div className="grid md:grid-cols-4 gap-8 relative">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  {/* Step circle */}
                  <div className="relative z-10 mb-6">
                    <div className="w-24 h-24 rounded-full bg-primary/10 border-4 border-background flex items-center justify-center mb-4">
                      <div className="text-3xl font-bold text-primary">{String(index + 1).padStart(2, "0")}</div>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>

                  {/* Step content */}
                  <div className="mt-4">
                    <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                    <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
                      </svg>
                      {step.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  {typeof feature.title === 'string' ? feature.title : feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const steps = [
  {
    title: "Данные компании",
    description: "Заполните карточку один раз",
    time: "5 мин",
    icon: <Package className="w-5 h-5 text-primary" />,
  },
  {
    title: "Спецификация товаров",
    description: "Выберите из каталога или загрузите",
    time: "10 мин",
    icon: <TrendingUp className="w-5 h-5 text-primary" />,
  },
  {
    title: "Пополнение агента",
    description: "Пополнение счета агента",
    time: "1 день",
    icon: <Shield className="w-5 h-5 text-primary" />,
  },
  {
    title: "Метод оплаты",
    description: "Выберите способ оплаты поставщику",
    time: "2 мин",
    icon: <CheckCircle2 className="w-5 h-5 text-primary" />,
  },
]
// </CHANGE>

const features = [
  {
    title: "Проверенные поставщики",
    description: "Работаем только с надёжными партнёрами",
  },
  {
    title: (
      <>
        Актуальные цены в <CurrencyRotator />
      </>
    ),
    description: "Обновляем ежедневно",
  },
  {
    title: "Электроника, Мебель, Одежда",
    description: "И ещё 15+ категорий товаров",
  },
]
// </CHANGE>
