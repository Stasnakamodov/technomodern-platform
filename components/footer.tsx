"use client"

import { Send, MessageCircle, Mail, Phone } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  const telegramUrl = process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/technomodern_support"
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "79991234567"
  const whatsappUrl = `https://wa.me/${whatsappNumber}`

  return (
    <footer className="bg-gradient-to-b from-background to-muted/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-12 max-md:px-4 max-md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-md:gap-6">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <div className="text-2xl font-bold mb-4 max-md:text-xl max-md:mb-3">
              <span className="text-foreground">Техно</span>
              <span className="text-primary">Модерн</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4 max-md:text-xs">
              Платежный агент для международных сделок. Помогаем селлерам закупать товары у зарубежных поставщиков.
            </p>
            <div className="flex gap-3">
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#0088cc] hover:bg-[#0088cc]/90 flex items-center justify-center transition-all hover:scale-110"
                aria-label="Telegram"
              >
                <Send className="w-5 h-5 text-white" />
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#25D366]/90 flex items-center justify-center transition-all hover:scale-110"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-base mb-4 max-md:text-sm max-md:mb-3">Навигация</h3>
            <ul className="space-y-2 text-sm text-muted-foreground max-md:text-xs max-md:space-y-1.5">
              <li>
                <Link href="/catalog" className="hover:text-primary transition-colors">
                  Каталог товаров
                </Link>
              </li>
              <li>
                <a href="#services" className="hover:text-primary transition-colors">
                  Услуги
                </a>
              </li>
              <li>
                <a href="#calculator" className="hover:text-primary transition-colors">
                  Калькулятор валют
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-primary transition-colors">
                  Частые вопросы
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-base mb-4 max-md:text-sm max-md:mb-3">Услуги</h3>
            <ul className="space-y-2 text-sm text-muted-foreground max-md:text-xs max-md:space-y-1.5">
              <li>Международные платежи</li>
              <li>Документарное сопровождение</li>
              <li>Поиск поставщиков</li>
              <li>Юридическая поддержка</li>
              <li>Каталог товаров</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-base mb-4 max-md:text-sm max-md:mb-3">Контакты</h3>
            <ul className="space-y-3 text-sm text-muted-foreground max-md:text-xs max-md:space-y-2">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                <a href="mailto:info@techno-modern.ru" className="hover:text-primary transition-colors">
                  info@techno-modern.ru
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                <a href={`tel:+${whatsappNumber}`} className="hover:text-primary transition-colors">
                  +7 (999) 123-45-67
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-6 max-md:mt-6 max-md:pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground max-md:text-xs">
            <p>© {new Date().getFullYear()} ТехноМодерн. Все права защищены.</p>
            <div className="flex gap-6 max-md:gap-4">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Политика конфиденциальности
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Условия использования
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
