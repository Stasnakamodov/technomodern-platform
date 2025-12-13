import Script from 'next/script'

export const metadata = {
  title: 'TechnoModern - Каталог',
  description: 'Каталог товаров TechnoModern',
  // Telegram Mini App требует правильный viewport
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover', // Важно для safe areas на iOS
  },
  // Цвет темы для браузера
  themeColor: '#ffffff',
}

export default function TelegramAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="beforeInteractive"
      />
      {/*
        Дополнительные мета-теги для Telegram Mini Apps:
        - viewport-fit=cover для поддержки safe areas
        - web-app-capable для PWA режима
      */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      {children}
    </>
  )
}
