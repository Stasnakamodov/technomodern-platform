/**
 * Генератор реалистичного каталога товаров для ТехноМодерн MVP
 *
 * Создаёт 500+ товаров с:
 * - Реалистичными ценами (1688 → Ozon/WB с маржой)
 * - Категориями и подкатегориями
 * - Описаниями на русском
 * - Фото с Unsplash
 * - Поставщиками
 */

import fs from 'fs'
import path from 'path'

// ===== КАТЕГОРИИ =====
const CATEGORIES = [
  {
    id: 'electronics',
    name: 'Электроника',
    icon: '💻',
    subcategories: ['Смартфоны', 'Ноутбуки', 'Наушники', 'Планшеты', 'Умные часы', 'Телевизоры', 'Камеры']
  },
  {
    id: 'clothing',
    name: 'Одежда',
    icon: '👕',
    subcategories: ['Верхняя одежда', 'Обувь', 'Джинсы', 'Футболки', 'Толстовки', 'Платья', 'Костюмы']
  },
  {
    id: 'furniture',
    name: 'Мебель',
    icon: '🪑',
    subcategories: ['Офисная мебель', 'Мягкая мебель', 'Спальня', 'Шкафы', 'Столы', 'Стулья']
  },
  {
    id: 'construction',
    name: 'Строительство',
    icon: '🔨',
    subcategories: ['Электроинструменты', 'Освещение', 'Умный дом', 'Отделочные материалы', 'Сантехника']
  },
  {
    id: 'auto',
    name: 'Автотовары',
    icon: '🚗',
    subcategories: ['Автомасла', 'Тормозная система', 'Фильтры', 'Автоэлектроника', 'Аксессуары']
  },
  {
    id: 'home',
    name: 'Дом и сад',
    icon: '🏠',
    subcategories: ['Посуда', 'Текстиль', 'Декор', 'Садовый инвентарь', 'Бытовая техника']
  },
  {
    id: 'sports',
    name: 'Спорт и отдых',
    icon: '⚽',
    subcategories: ['Фитнес', 'Велосипеды', 'Туризм', 'Спортивная одежда', 'Тренажеры']
  },
  {
    id: 'beauty',
    name: 'Красота и здоровье',
    icon: '💄',
    subcategories: ['Косметика', 'Уход за кожей', 'Парфюмерия', 'Массажеры', 'Витамины']
  }
]

// ===== ПОСТАВЩИКИ =====
const SUPPLIERS = [
  { name: 'Guangzhou Tech Co.', country: 'Китай', city: 'Гуанчжоу', verified: true, rating: 4.8 },
  { name: 'Shenzhen Electronics Ltd', country: 'Китай', city: 'Шэньчжэнь', verified: true, rating: 4.7 },
  { name: 'Yiwu Trading Group', country: 'Китай', city: 'Иу', verified: true, rating: 4.6 },
  { name: 'Hangzhou Fashion', country: 'Китай', city: 'Ханчжоу', verified: true, rating: 4.5 },
  { name: 'Beijing Auto Parts', country: 'Китай', city: 'Пекин', verified: true, rating: 4.9 },
  { name: 'Shanghai Home Goods', country: 'Китай', city: 'Шанхай', verified: true, rating: 4.7 },
  { name: 'Ningbo Manufacturing', country: 'Китай', city: 'Нинбо', verified: true, rating: 4.6 },
  { name: 'Dongguan Industrial', country: 'Китай', city: 'Дунгуань', verified: true, rating: 4.8 }
]

// ===== ШАБЛОНЫ ТОВАРОВ ПО КАТЕГОРИЯМ =====
const PRODUCT_TEMPLATES: Record<string, Array<{
  namePattern: string
  brands: string[]
  price1688Range: [number, number]
  marginPercent: [number, number]
  moqRange: [number, number]
  keywords: string[]
}>> = {
  electronics: [
    {
      namePattern: 'Смартфон {brand} {model}',
      brands: ['Xiaomi', 'Realme', 'POCO', 'OnePlus', 'OPPO', 'Vivo'],
      price1688Range: [3000, 8000],
      marginPercent: [20, 35],
      moqRange: [1, 5],
      keywords: ['5G', '128GB', '256GB', '8GB RAM', 'AMOLED', '120Hz']
    },
    {
      namePattern: 'Ноутбук {brand} {model}',
      brands: ['Lenovo', 'ASUS', 'Acer', 'MSI', 'HP'],
      price1688Range: [12000, 25000],
      marginPercent: [25, 40],
      moqRange: [1, 3],
      keywords: ['Intel i5', 'Intel i7', 'AMD Ryzen', '16GB RAM', 'SSD 512GB', 'Full HD']
    },
    {
      namePattern: 'Наушники {brand} {model}',
      brands: ['QCY', 'Edifier', 'Haylou', 'Baseus', 'Soundpeats'],
      price1688Range: [150, 800],
      marginPercent: [40, 80],
      moqRange: [10, 50],
      keywords: ['TWS', 'Bluetooth 5.3', 'ANC', 'Беспроводные', 'С микрофоном']
    }
  ],
  clothing: [
    {
      namePattern: 'Куртка {brand} {style}',
      brands: ['Urban', 'Street', 'Mountain', 'Classic', 'Outdoor'],
      price1688Range: [300, 1200],
      marginPercent: [50, 120],
      moqRange: [20, 100],
      keywords: ['Зимняя', 'Демисезонная', 'Водонепроницаемая', 'С капюшоном', 'Утепленная']
    },
    {
      namePattern: 'Кроссовки {brand} {style}',
      brands: ['Nike Style', 'Adidas Style', 'Puma Style', 'New Balance Style', 'Reebok Style'],
      price1688Range: [200, 600],
      marginPercent: [60, 150],
      moqRange: [30, 120],
      keywords: ['Спортивные', 'Повседневные', 'Дышащие', 'Легкие', 'Амортизация']
    },
    {
      namePattern: 'Футболка {brand} {type}',
      brands: ['Cotton', 'Basic', 'Premium', 'Sport', 'Urban'],
      price1688Range: [30, 100],
      marginPercent: [100, 200],
      moqRange: [50, 300],
      keywords: ['Хлопок', 'Оверсайз', 'Slim fit', 'Принт', 'Однотонная']
    }
  ],
  furniture: [
    {
      namePattern: 'Офисное кресло {brand} {type}',
      brands: ['Comfort', 'Ergo', 'Executive', 'Gaming', 'Classic'],
      price1688Range: [800, 3000],
      marginPercent: [40, 80],
      moqRange: [5, 20],
      keywords: ['Эргономичное', 'С подлокотниками', 'Массаж', 'Регулируемое', 'Кожа/Ткань']
    },
    {
      namePattern: 'Диван {brand} {style}',
      brands: ['Modern', 'Lux', 'Classic', 'Comfort', 'Space'],
      price1688Range: [5000, 15000],
      marginPercent: [30, 60],
      moqRange: [1, 5],
      keywords: ['Раскладной', 'Угловой', 'Прямой', '2-местный', '3-местный']
    }
  ],
  construction: [
    {
      namePattern: 'Дрель {brand} {type}',
      brands: ['PowerTool', 'ProWork', 'MasterCraft', 'ToolMax', 'BuildPro'],
      price1688Range: [400, 1500],
      marginPercent: [35, 70],
      moqRange: [10, 50],
      keywords: ['Аккумуляторная', 'Ударная', '18V', '20V', 'Комплект насадок']
    },
    {
      namePattern: 'LED светильник {brand} {type}',
      brands: ['BrightLight', 'EcoLED', 'SmartHome', 'LuxLight', 'ModernLED'],
      price1688Range: [60, 400],
      marginPercent: [50, 100],
      moqRange: [20, 100],
      keywords: ['Потолочный', 'Настенный', 'Умный', 'RGB', 'Пульт ДУ']
    }
  ],
  auto: [
    {
      namePattern: 'Моторное масло {brand} {type}',
      brands: ['Shell Type', 'Mobil Type', 'Castrol Type', 'Total Type', 'Liqui Moly Type'],
      price1688Range: [150, 500],
      marginPercent: [30, 60],
      moqRange: [12, 48],
      keywords: ['5W-30', '5W-40', '10W-40', 'Синтетика', 'Полусинтетика']
    },
    {
      namePattern: 'Тормозные колодки {brand}',
      brands: ['Brembo Style', 'Bosch Type', 'ATE Type', 'Ferodo Type', 'TRW Type'],
      price1688Range: [200, 800],
      marginPercent: [40, 80],
      moqRange: [10, 50],
      keywords: ['Передние', 'Задние', 'Керамические', 'Металлические', 'Органические']
    }
  ],
  home: [
    {
      namePattern: 'Набор посуды {brand} {type}',
      brands: ['HomeChef', 'KitchenPro', 'CookMaster', 'DiningElite', 'TableArt'],
      price1688Range: [200, 1000],
      marginPercent: [50, 120],
      moqRange: [10, 50],
      keywords: ['Нержавеющая сталь', 'Керамика', 'Стекло', 'Антипригарное', 'Набор']
    }
  ],
  sports: [
    {
      namePattern: 'Велосипед {brand} {type}',
      brands: ['Bike Pro', 'Mountain King', 'City Rider', 'Speed Master', 'Trail Boss'],
      price1688Range: [3000, 12000],
      marginPercent: [25, 50],
      moqRange: [1, 5],
      keywords: ['Горный', 'Городской', 'Складной', 'Шоссейный', 'Алюминиевая рама']
    },
    {
      namePattern: 'Гантели {brand} {type}',
      brands: ['FitPro', 'PowerGym', 'IronForce', 'MuscleMaster', 'HomeFit'],
      price1688Range: [100, 600],
      marginPercent: [40, 100],
      moqRange: [10, 50],
      keywords: ['Разборные', 'Неопрен', 'Хром', 'Набор', 'Регулируемые']
    }
  ],
  beauty: [
    {
      namePattern: 'Крем для лица {brand} {type}',
      brands: ['BeautyLux', 'SkinCare Pro', 'Natural Glow', 'DermaLine', 'PureBeauty'],
      price1688Range: [50, 300],
      marginPercent: [80, 200],
      moqRange: [50, 200],
      keywords: ['Увлажняющий', 'Антивозрастной', 'Для сухой кожи', 'SPF защита', 'Натуральный']
    }
  ]
}

// ===== ГЕНЕРАТОР =====
function randomFromRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateProductName(template: any): string {
  const brand = randomFromArray(template.brands)
  const model = Math.random() > 0.5
    ? randomFromArray(['Pro', 'Ultra', 'Max', 'Plus', 'Lite', 'Air', 'Edge'])
    : `${randomFromRange(10, 99)}${randomFromArray(['', 'S', 'X', 'T'])}`

  return template.namePattern
    .replace('{brand}', brand)
    .replace('{model}', model)
    .replace('{style}', randomFromArray(template.keywords))
    .replace('{type}', randomFromArray(template.keywords))
}

function generateDescription(productName: string, keywords: string[]): string {
  const descriptions = [
    `Качественный ${productName.toLowerCase()} от проверенного китайского производителя. ${randomFromArray(keywords)}. Отличное соотношение цены и качества.`,
    `${productName} - популярная модель с высоким рейтингом на китайских маркетплейсах. ${randomFromArray(keywords)}. Быстрая доставка.`,
    `Оригинальный ${productName.toLowerCase()} с гарантией качества. ${randomFromArray(keywords)}. Проверено тысячами покупателей.`,
    `Топовый ${productName.toLowerCase()} по доступной цене. ${randomFromArray(keywords)}. Прямые поставки с завода.`
  ]
  return randomFromArray(descriptions)
}

function getUnsplashImageUrl(category: string, index: number): string {
  const queries: Record<string, string> = {
    electronics: 'technology,gadget,electronics',
    clothing: 'fashion,clothes,apparel',
    furniture: 'furniture,interior,home',
    construction: 'tools,construction,hardware',
    auto: 'car,automotive,vehicle',
    home: 'home,kitchen,decor',
    sports: 'sports,fitness,exercise',
    beauty: 'beauty,cosmetics,skincare'
  }

  const query = queries[category] || 'product'
  return `https://images.unsplash.com/photo-${1500000000000 + index}?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`
}

function generateProducts() {
  const products: any[] = []
  let productIndex = 1

  for (const category of CATEGORIES) {
    const templates = PRODUCT_TEMPLATES[category.id] || []

    for (const subcategory of category.subcategories) {
      // Генерируем 8-12 товаров на подкатегорию
      const productsCount = randomFromRange(8, 12)

      for (let i = 0; i < productsCount; i++) {
        const template = randomFromArray(templates)
        const productName = generateProductName(template)

        // Цены
        const price1688 = randomFromRange(template.price1688Range[0], template.price1688Range[1])
        const marginPercent = randomFromRange(template.marginPercent[0], template.marginPercent[1])
        const priceRub = Math.round(price1688 * 13 * (1 + marginPercent / 100)) // CNY → RUB с маржой

        // Поставщик
        const supplier = randomFromArray(SUPPLIERS)

        // Товар
        const product = {
          id: `prod-${String(productIndex).padStart(4, '0')}`,
          name: productName,
          category: category.name,
          subcategory: subcategory,
          description: generateDescription(productName, template.keywords),
          price_1688_cny: price1688,
          price_rub: priceRub,
          margin_percent: marginPercent,
          supplier: supplier.name,
          supplier_city: supplier.city,
          supplier_verified: supplier.verified,
          supplier_rating: supplier.rating,
          moq: randomFromRange(template.moqRange[0], template.moqRange[1]),
          in_stock: Math.random() > 0.1, // 90% в наличии
          image_url: getUnsplashImageUrl(category.id, productIndex),
          specifications: {
            ...Object.fromEntries(
              template.keywords.slice(0, 3).map((k, idx) => [`spec_${idx + 1}`, k])
            )
          },
          created_at: new Date().toISOString()
        }

        products.push(product)
        productIndex++
      }
    }
  }

  return products
}

// ===== ЭКСПОРТ =====
function main() {
  console.log('🚀 Генерация каталога товаров...\n')

  const products = generateProducts()

  console.log(`✅ Сгенерировано товаров: ${products.length}`)
  console.log(`📦 Категорий: ${CATEGORIES.length}`)
  console.log(`🏭 Поставщиков: ${SUPPLIERS.length}\n`)

  // Статистика по категориям
  const categoryStats = CATEGORIES.map(cat => {
    const count = products.filter(p => p.category === cat.name).length
    return `   ${cat.icon} ${cat.name}: ${count} товаров`
  })
  console.log('📊 Распределение по категориям:')
  console.log(categoryStats.join('\n'))

  // Сохраняем JSON
  const catalog = {
    generated_at: new Date().toISOString(),
    total_products: products.length,
    categories: CATEGORIES,
    suppliers: SUPPLIERS,
    products
  }

  const outputPath = path.join(process.cwd(), 'data', 'realistic-catalog-v2.json')
  fs.writeFileSync(outputPath, JSON.stringify(catalog, null, 2), 'utf-8')

  console.log(`\n💾 Файл сохранён: ${outputPath}`)
  console.log('\n✨ Готово! Теперь можно использовать данные для MVP.')
}

main()
