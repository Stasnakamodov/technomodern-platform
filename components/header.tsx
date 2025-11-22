"use client"

import { Button } from "@/components/ui/button"
import { Send, Menu, X } from "lucide-react"
import { useState } from "react"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Загружаем контакты из env с fallback значениями
  const telegramUrl = process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/technomodern_support"

  return (
    <header className="relative z-50 px-8 py-6 max-md:px-4 max-md:py-3 bg-white border-b border-gray-200/20 shadow-sm">
      <nav className="max-w-7xl mx-auto flex items-center justify-between max-md:gap-2">
        {/* Logo */}
        <div className="text-2xl md:text-3xl font-bold flex-shrink-0 max-md:text-lg">
          <span className="text-foreground whitespace-nowrap">Техно</span>
          <span className="text-primary whitespace-nowrap">Модерн</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-center">
          <nav className="flex items-center gap-2 bg-gray-100/80 rounded-xl px-3 py-1.5">
            <a
              href="/catalog"
              className="px-9 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all"
            >
              Каталог
            </a>
            <a
              href="#services"
              className="px-9 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all"
            >
              Услуги
            </a>
            <a
              href="#calculator"
              className="px-9 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all"
            >
              Калькулятор
            </a>
            <a
              href="#order"
              className="px-9 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all"
            >
              Контакты
            </a>
          </nav>
        </div>

        {/* Desktop Contact section */}
        <div className="hidden md:flex items-center flex-shrink-0 ml-auto pl-6">
          <a href="#order">
            <Button size="default" className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 md:px-6 md:py-5 text-sm md:text-base">
              Связаться с нами
            </Button>
          </a>

          {/* Social media icons */}
          <div className="flex items-center ml-3">
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#0088cc] hover:bg-[#0088cc]/90 flex items-center justify-center transition-all hover:scale-110"
              aria-label="Telegram"
            >
              <Send className="w-5 h-5 text-white" />
            </a>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-1">
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-full bg-[#0088cc] hover:bg-[#0088cc]/90 flex items-center justify-center transition-all active:scale-95"
            aria-label="Telegram"
          >
            <Send className="w-4 h-4 text-white" />
          </a>
          <Button
            variant="ghost"
            size="icon"
            className="w-11 h-11"
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
            <div className="px-8 py-4">
              <a href="#order" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  size="default"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Связаться с нами
                </Button>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
