"use client"

import { Banknote, ArrowRightLeft, MessageSquare, FileCheck } from "lucide-react"

const processes = [
  {
    icon: Banknote,
    title: "Прием денежных средств",
    description: "Принимаем платежи от покупателя в рублях на счет российской компании ООО \"ТЕХНОМОДЕРН\""
  },
  {
    icon: ArrowRightLeft,
    title: "Оплатим закупку",
    description: "Конвертируем и переводим средства поставщикам, соблюдая все правила валютного контроля"
  },
  {
    icon: MessageSquare,
    title: "Проинформируем поставщика",
    description: "Сообщаем поставщику о деталях заказа и данных грузополучателя"
  },
  {
    icon: FileCheck,
    title: "Подготовим документы \"под ключ\"",
    description: "Подтверждаем сделку и предоставляем полный комплект документов в соответствии с законодательством РФ и ЕАЭС"
  }
]

export default function AgentProcessSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-muted/20 to-background max-md:py-12">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16 max-md:mb-8">
          <h2 className="text-4xl font-bold mb-4 max-md:text-3xl max-md:mb-3">
            Как работает агент
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto max-md:text-base max-md:px-2">
            Наша компания, выполняя функции агента, берёт на себя весь процесс сделки
          </p>
        </div>

        {/* Process Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-md:gap-4">
          {processes.map((process, index) => {
            const Icon = process.icon
            return (
              <div
                key={index}
                className="relative bg-card rounded-2xl p-6 border-2 border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 max-md:p-4"
              >
                {/* Step number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm max-md:w-7 max-md:h-7 max-md:text-xs">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 max-md:w-12 max-md:h-12 max-md:mb-3">
                  <Icon className="w-7 h-7 text-primary max-md:w-6 max-md:h-6" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold mb-2 max-md:text-base">
                  {process.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-md:text-xs">
                  {process.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Bottom text */}
        <div className="mt-12 text-center max-md:mt-8">
          <p className="text-muted-foreground max-w-2xl mx-auto max-md:text-sm max-md:px-2">
            Мы осуществляем все финансовые операции, включая прием средств от покупателя и обеспечение оплаты поставщику
          </p>
        </div>
      </div>
    </section>
  )
}
