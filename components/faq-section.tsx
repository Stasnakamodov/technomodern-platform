"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, X } from "lucide-react"

const faqs = [
  {
    question: "Кто такой агент и как вы можете представлять интересы иностранного поставщика?",
    answer:
      "Наша компания является официальным агентом иностранного поставщика на основании агентского контракта, что закреплено в ст. 1005 ГК РФ. Мы работаем на упрощенной системе налогообложения — УСН (глава 26.2 НК РФ), что позволяет нам оптимально выстроить работу с российскими клиентами, заключать договоры, принимать платежи и проводить расчеты с поставщиком в полном соответствии с законодательством РФ.",
  },
  {
    question: "Нужно ли мне открывать валютные счета для работы с вами?",
    answer:
      "Нет, не нужно! Вы оплачиваете товар в рублях на счет нашей российской компании (агента), а мы обеспечиваем законные расчеты с иностранным поставщиком. Все валютные риски и взаимодействие с системой валютного контроля берет на себя агент согласно ФЗ-173 «О валютном регулировании и валютном контроле» и Инструкции ЦБ РФ 181-И. Это существенно упрощает документооборот и снижает банковские риски и издержки.",
  },
  {
    question: "Как обеспечивается законность платежей и безопасность расчетов?",
    answer:
      "Все операции проходят валютный контроль с присвоением соответствующего кода валютной операции согласно ФЗ-173 и Инструкции ЦБ РФ 181-И, что гарантирует законность и безопасность каждой сделки. Каждая операция документально подтверждена и соответствует требованиям валютного законодательства РФ.",
  },
  {
    question: "В чем преимущество и законность поставки через страны ЕАЭС?",
    answer:
      "Передача товара в странах Таможенного союза полностью соответствует статьям 146 и 147 Налогового кодекса РФ (место реализации товара) и Таможенному кодексу ЕАЭС. Согласно НК РФ, НДС не возникает, так как товар передается за пределами РФ, а именно на территории стран ЕАЭС. При этом мы, работая на УСН (глава 26.2 НК РФ), обеспечиваем прозрачность всех операций.",
  },
  {
    question: "Какие документы гарантируют правовую защиту сделки?",
    answer:
      "В соответствии с требованиями Гражданского кодекса РФ (ст. 161) и Федерального закона «О бухгалтерском учете» (статья 9), мы предоставляем полный пакет документов: договор поставки (ст. 454 ГК РФ), спецификацию товара, инвойс от иностранного поставщика, акты приема-передачи товара (ст. 456 ГК РФ) и акт выполненных работ агента. Все документы соответствуют требованиям валютного законодательства (ФЗ-173).",
  },
  {
    question: "Какие налоговые последствия могут возникнуть при такой работе?",
    answer:
      "При данной схеме работы НДС не возникает, так как согласно Налоговому кодексу РФ (ст. 146 и 147) местом реализации товара является территория стран ЕАЭС, где товар передается клиенту. Это подтверждается документами и соответствует положениям Таможенного кодекса ЕАЭС. Вы получаете все необходимые документы для бухгалтерии и налоговой отчетности.",
  },
  {
    question: "Как долго занимает перевод денег поставщику?",
    answer:
      "После получения оплаты от вас в рублях, мы оперативно обеспечиваем исполнение финансовых обязательств перед иностранным поставщиком. Сроки зависят от способа оплаты и валютного контроля, но обычно процесс занимает от нескольких часов до 1-2 рабочих дней. Все операции проводятся в строгом соответствии с требованиями валютного законодательства.",
  },
  {
    question: "Какие комиссии взимаются за ваши услуги?",
    answer:
      "Комиссия зависит от объема сделки, способа оплаты и дополнительных услуг. Мы работаем прозрачно — все условия и размер комиссии фиксируются в договоре до начала сотрудничества. Обычно комиссия составляет от 2% до 3% от суммы сделки и включает все финансовые операции, валютный контроль и полный пакет документов.",
  },
  {
    question: "Несете ли вы ответственность за качество и доставку товара?",
    answer:
      "Важно понимать, что наша компания выполняет функции платежного агента. Согласно условиям договора, мы осуществляем финансовые операции и предоставляем документарное сопровождение, но не осуществляем транспортно-логистических и таможенных услуг. Мы не несем ответственность за качество, доставку и сохранность товара — эти вопросы решаются напрямую между вами и поставщиком.",
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", contact: "", message: "" })

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    alert("Спасибо! Мы свяжемся с вами в ближайшее время.")
    setIsModalOpen(false)
    setFormData({ name: "", contact: "", message: "" })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <section id="faq" className="py-24 px-4 bg-gradient-to-b from-background to-muted/20 max-md:py-12 max-md:px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 max-md:mb-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 max-md:text-3xl max-md:mb-3">Юридические и финансовые вопросы</h2>
          <p className="text-muted-foreground text-lg max-md:text-base max-md:px-2">Подробные ответы с обоснованием по законодательству РФ</p>
        </div>

        <div className="space-y-4 max-md:space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-2 border-border rounded-2xl overflow-hidden bg-card transition-all hover:shadow-lg hover:border-primary/50"
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors hover:bg-muted/50 max-md:px-4 max-md:py-4"
              >
                <span className="font-semibold text-lg pr-4 max-md:text-base max-md:pr-2">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 max-md:w-4 max-md:h-4 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-[600px]" : "max-h-0"
                }`}
              >
                <div className="px-6 pb-5 pt-2 text-muted-foreground leading-relaxed text-base max-md:px-4 max-md:text-sm">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center max-md:mt-8">
          <p className="text-muted-foreground mb-4 max-md:text-sm max-md:px-2">Не нашли ответ на свой вопрос?</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl hover:shadow-lg transition-all hover:scale-105 max-md:px-6 max-md:py-2.5 max-md:text-sm"
          >
            Связаться с нами
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-bold mb-2">Свяжитесь с нами</h3>
            <p className="text-gray-600 mb-6">Оставьте свои контакты, и мы свяжемся с вами в ближайшее время</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Имя
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background"
                  placeholder="Ваше имя"
                />
              </div>

              <div>
                <label htmlFor="contact" className="block text-sm font-medium mb-2">
                  Email или телефон
                </label>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background"
                  placeholder="example@mail.com или +7 (999) 123-45-67"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Сообщение
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none bg-background"
                  placeholder="Расскажите о вашем вопросе..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl hover:shadow-lg transition-all hover:scale-105"
              >
                Отправить
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
