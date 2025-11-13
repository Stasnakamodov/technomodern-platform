"use client"

import { useState, useEffect } from "react"
import CheckIcon from "./CheckIcon"

export default function BusinessSchemeSection() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const steps = [
    {
      country: "Россия",
      flag: "🇷🇺",
      title: "Продавец",
      subtitle: "Маркетплейсы",
      detail: "Ozon, Wildberries, Яндекс Маркет",
      description:
        "Продавец на российских маркетплейсах отправляет рубли через нашу платформу для оплаты зарубежного поставщика",
    },
    {
      country: "Киргизия",
      flag: "🇰🇬",
      title: "ТехноМодерн",
      subtitle: "Платежный агент",
      detail: "Конвертация и перевод",
      description:
        "ТехноМодерн конвертирует рубли и переводит средства поставщику через международные платежные системы (USDT, AliPay, WeChat)",
    },
    {
      country: "Китай",
      flag: "🇨🇳",
      title: "Поставщик",
      subtitle: "Производитель",
      detail: "Товары из Китая",
      description: "Китайский поставщик получает оплату и отправляет товар продавцу в России",
    },
  ]

  return (
    <section id="how-it-works" className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Как это работает</h2>
          <p className="text-muted-foreground text-lg">
            Помогаем селлерам маркетплейсов оплачивать зарубежных поставщиков
          </p>
        </div>

        {/* Interactive cubes */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 border-2 transition-all duration-500 ${
                activeStep === index
                  ? "bg-gradient-to-br from-primary/20 to-pink-500/20 border-primary shadow-lg shadow-primary/30 scale-105"
                  : "bg-card border-border hover:border-primary/50"
              }`}
            >
              <div className="text-center mb-4">
                <div className="text-5xl mb-3">{step.flag}</div>
                <div className="text-sm text-muted-foreground mb-1">{step.country}</div>
                <h3 className="font-bold text-xl mb-1">{step.title}</h3>
                <div className="text-sm text-primary font-medium">{step.subtitle}</div>
                <div className="text-xs text-muted-foreground mt-1">{step.detail}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic description */}
        <div className="bg-primary/5 rounded-xl p-6 mb-12 border border-primary/20 min-h-[100px] flex items-center justify-center">
          <p className="text-center text-muted-foreground transition-all duration-300">
            {steps[activeStep].description}
          </p>
        </div>

        {/* Business tier cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl p-6 border border-border">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                1
              </div>
              Малому бизнесу
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Удобные способы оплаты зарубежным поставщикам для продавцов Ozon, Wildberries и Яндекс Маркета
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckIcon />
                <span>Документальное сопровождение оплаты за товар / логистику</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon />
                <span>Переводы USDT - зачисление получателю за 15 минут</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon />
                <span>Переводы в Китай, AliPay, WeChat - зачисление получателю за 30 минут</span>
              </li>
            </ul>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                2
              </div>
              Среднему бизнесу
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Оплаты инвойсов с зарубежных компаний вашему поставщику
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckIcon />
                <span>Свифт подтверждение платежа (SWIFT)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon />
                <span>Агентский договор / Договор купли - продажи</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon />
                <span>Акт выполненных работ</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
