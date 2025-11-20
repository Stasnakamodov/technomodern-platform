'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface Marketplace {
  name: string
  logo: string
  scale?: number
}

const marketplaces: Marketplace[] = [
  { name: 'Ozon', logo: '/marketplace-logos/ozon.svg' },
  { name: 'Wildberries', logo: '/marketplace-logos/wildberries.svg' },
  { name: 'Yandex Market', logo: '/marketplace-logos/yandex-market.svg' },
  { name: 'Alibaba', logo: '/marketplace-logos/alibaba.svg' },
  { name: 'Made-in-China', logo: '/marketplace-logos/made-in-china.png', scale: 1.1 },
  { name: 'Taobao', logo: '/marketplace-logos/taobao.svg' },
  { name: '1688', logo: '/marketplace-logos/1688.svg' },
  { name: 'Trendyol', logo: '/marketplace-logos/trendyol.svg' },
  { name: 'Hepsiburada', logo: '/marketplace-logos/hepsiburada.svg' },
]

export default function MarketplaceBanner() {
  const duplicatedMarketplaces = [...marketplaces, ...marketplaces]

  return (
    <div className="w-full bg-white py-12 overflow-hidden">
      <div className="container mx-auto px-4 mb-8">
        <h2 className="text-2xl md:text-3xl font-normal text-center text-gray-900 mb-2">
          Помощь в поисках товаров и поставщиков
        </h2>
        <p className="text-center text-gray-600 text-base">
          Делаем работу селлеров на ведущих площадках проще и эффективнее
        </p>
      </div>

      <div className="relative py-4">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-12 items-center"
          animate={{
            x: [0, -160 * marketplaces.length],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 35,
              ease: "linear",
            },
          }}
        >
          {duplicatedMarketplaces.map((marketplace, index) => (
            <div
              key={`${marketplace.name}-${index}`}
              className="flex-shrink-0 w-36 h-24 flex items-center justify-center"
            >
              <img
                src={marketplace.logo}
                alt={marketplace.name}
                className="max-w-full max-h-full object-contain"
                style={marketplace.scale ? { transform: `scale(${marketplace.scale})` } : undefined}
                loading="lazy"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
