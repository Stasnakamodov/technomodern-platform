/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Turbopack конфигурация (Next.js 16+)
  turbopack: {
    // Puppeteer - опциональная зависимость для парсинга маркетплейсов
    // Помечаем как внешний модуль, который не нужно бандлить
    resolveAlias: {
      // Puppeteer будет подгружаться только в runtime если установлен
    },
  },
  // Помечаем puppeteer как серверный external
  serverExternalPackages: ['puppeteer'],
}

export default nextConfig
