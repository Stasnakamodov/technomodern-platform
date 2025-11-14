"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, X } from "lucide-react"

const faqs = [
  {
    question: "Как долго занимает перевод денег поставщику?",
    answer:
      "Перевод через USDT занимает 15 минут, через AliPay и WeChat - до 30 минут. Все операции проводятся в рабочее время.",
  },
  {
    question: "Какие комиссии взимаются за услуги?",
    answer:
      "Комиссия зависит от способа оплаты: USDT - 2%, AliPay - 2.5%, WeChat - 2.5%. Комиссия включает конвертацию валюты и перевод средств.",
  },
  {
    question: "Нужно ли мне регистрировать компанию в Киргизии?",
    answer:
      "Нет, регистрация не требуется. Мы выступаем в качестве платежного агента, и вы работаете со своей российской компанией.",
  },
  {
    question: "Какие документы нужны для начала работы?",
    answer:
      "Для малого бизнеса достаточно договора на оплату товара. Для среднего бизнеса потребуется SWIFT подтверждение платежа, агентский договор и акт выполненных работ.",
  },
  {
    question: "Какие способы оплаты вы поддерживаете?",
    answer:
      "Мы поддерживаем переводы в USDT, AliPay и WeChat. Все способы позволяют быстро и безопасно переводить средства поставщикам в Китае.",
  },
  {
    question: "Работаете ли вы с крупными компаниями?",
    answer:
      "Да, мы работаем как с малым, так и со средним бизнесом. Для крупных компаний предоставляем дополнительные услуги, включая SWIFT платежи и полное документальное сопровождение.",
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
    <section id="faq" className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Часто задаваемые вопросы</h2>
          <p className="text-gray-600 text-lg">Ответы на популярные вопросы о работе с ТехноМодерн</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-2xl overflow-hidden bg-white transition-all hover:shadow-lg"
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors hover:bg-gray-50"
              >
                <span className="font-semibold text-lg pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-violet-600 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-6 pb-5 pt-2 text-gray-600 leading-relaxed">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Не нашли ответ на свой вопрос?</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-3 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all hover:scale-105"
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
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Имя
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent"
                  placeholder="Ваше имя"
                />
              </div>

              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
                  Email или телефон
                </label>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent"
                  placeholder="example@mail.com или +7 (999) 123-45-67"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Сообщение
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent resize-none"
                  placeholder="Расскажите о вашем вопросе..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all hover:scale-105"
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
