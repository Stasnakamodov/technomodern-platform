"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle, Send, Menu, X } from "lucide-react"
import { useState } from "react"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  // Загружаем контакты из env с fallback значениями
  const telegramUrl = process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/technomodern_support"
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "79991234567"
  const whatsappUrl = `https://wa.me/${whatsappNumber}`

  return (
    <header className="absolute top-0 left-0 right-0 z-50 px-8 py-6 max-md:px-4 max-md:py-4">
      <nav className="max-w-7xl mx-auto flex items-center justify-between gap-4 max-md:gap-2">
        {/* Logo */}
        <div className="text-2xl md:text-3xl font-bold flex-shrink-0 max-md:text-xl">
          <span className="text-foreground">Техно</span>
          <span className="text-primary">Модерн</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 bg-white/80 backdrop-blur-sm border border-border rounded-full px-2 py-2 shadow-sm">
          <a href="/catalog" className="text-base text-muted-foreground hover:text-foreground transition-colors font-medium px-5 py-2.5 rounded-full hover:bg-primary/10 whitespace-nowrap">
            Каталог товаров
          </a>
          <a href="#services" className="text-base text-muted-foreground hover:text-foreground transition-colors px-5 py-2.5 rounded-full hover:bg-primary/10 whitespace-nowrap">
            Услуги
          </a>
          <a href="#calculator" className="text-base text-muted-foreground hover:text-foreground transition-colors px-5 py-2.5 rounded-full hover:bg-primary/10 whitespace-nowrap">
            Калькулятор
          </a>
        </div>

        {/* Desktop Contact section */}
        <div className="hidden md:flex items-center gap-4 flex-shrink-0">
          <Button size="default" className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 md:px-6 md:py-5 text-sm md:text-base">
            Связаться с нами
          </Button>

          {/* Social media icons */}
          <div className="flex items-center gap-3">
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

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-[#0088cc] hover:bg-[#0088cc]/90 flex items-center justify-center transition-all"
            aria-label="Telegram"
          >
            <Send className="w-4 h-4 text-white" />
          </a>
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Меню"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border shadow-lg">
          <nav className="flex flex-col py-4">
            <a
              href="/catalog"
              className="px-8 py-3 text-base text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Каталог товаров
            </a>
            <a
              href="#services"
              className="px-8 py-3 text-base text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Услуги
            </a>
            <a
              href="#calculator"
              className="px-8 py-3 text-base text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Калькулятор
            </a>
            <div className="px-8 py-4 flex gap-3">
              <Button
                size="default"
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Связаться с нами
              </Button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#25D366]/90 flex items-center justify-center transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 text-white" />
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
