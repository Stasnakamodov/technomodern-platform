import Script from 'next/script'

export const metadata = {
  title: 'TechnoModern - Каталог',
  description: 'Каталог товаров TechnoModern',
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
      {children}
    </>
  )
}
