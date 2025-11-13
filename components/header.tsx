import { Button } from "@/components/ui/button"
import { MessageCircle, Send } from "lucide-react"

export default function Header() {
  // Загружаем контакты из env с fallback значениями
  const telegramUrl = process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/technomodern_support"
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "79991234567"
  const whatsappUrl = `https://wa.me/${whatsappNumber}`

  return (
    <header className="absolute top-0 left-0 right-0 z-50 px-8 py-6">
      <nav className="max-w-[1600px] mx-auto flex items-center justify-between gap-8">
        {/* Logo */}
        <div className="text-3xl font-bold flex-shrink-0">
          <span className="text-foreground">Техно</span>
          <span className="text-primary">Модерн</span>
        </div>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-1 bg-white/80 backdrop-blur-sm border border-border rounded-full px-2 py-2 shadow-sm">
          <a href="/catalog" className="text-base text-muted-foreground hover:text-foreground transition-colors font-medium px-5 py-2.5 rounded-full hover:bg-primary/10 whitespace-nowrap">
            Каталог товаров
          </a>
          <a href="#services" className="text-base text-muted-foreground hover:text-foreground transition-colors px-5 py-2.5 rounded-full hover:bg-primary/10 whitespace-nowrap">
            Услуги
          </a>
          <a href="#how-it-works" className="text-base text-muted-foreground hover:text-foreground transition-colors px-5 py-2.5 rounded-full hover:bg-primary/10 whitespace-nowrap">
            Как работает
          </a>
          <a href="#calculator" className="text-base text-muted-foreground hover:text-foreground transition-colors px-5 py-2.5 rounded-full hover:bg-primary/10 whitespace-nowrap">
            Калькулятор
          </a>
        </div>

        {/* Contact section */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <Button size="default" className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-5 text-base">
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
      </nav>
    </header>
  )
}
