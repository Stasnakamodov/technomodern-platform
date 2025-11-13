"use client"

import { CheckCircle2, Package, TrendingUp, Shield } from "lucide-react"
import { useState, useEffect } from "react"

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

export default function PresentationSection() {
  return (
    <section id="services" className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">4 простых шага</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            От заявки до получения. Весь процесс — онлайн.
          </p>
        </div>
        {/* </CHANGE> */}

        <div className="mb-16">
          <div className="relative">
            {/* Progress line */}
            <div
              className="absolute top-12 left-0 right-0 h-0.5 bg-border hidden md:block"
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
