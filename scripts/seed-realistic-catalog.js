const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const realisticCatalog = {
  // Электроника
  electronics: [
    {
      name: 'iPhone 15 Pro Max 256GB',
      category: 'Электроника',
      subcategory: 'Смартфоны',
      price_cny: 6899,
      price_rub: 82000,
      supplier: 'Shenzhen Mobile Tech Co., Ltd',
      description: 'Флагманский смартфон Apple с титановым корпусом и чипом A17 Pro',
      image_url: 'https://images.unsplash.com/photo-1678652197748-4d39a1c0f88c',
      moq: 10,
      rating: 4.9
    },
    {
      name: 'Xiaomi 13 Ultra 512GB',
      category: 'Электроника',
      subcategory: 'Смартфоны',
      price_cny: 4999,
      price_rub: 59500,
      supplier: 'Beijing Xiaomi Electronics',
      description: 'Топовый камерофон с объективом Leica',
      image_url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97',
      moq: 20,
      rating: 4.7
    },
    {
      name: 'MacBook Pro 16" M3 Max',
      category: 'Электроника',
      subcategory: 'Ноутбуки',
      price_cny: 18999,
      price_rub: 226000,
      supplier: 'Shenzhen Apple Distributor',
      description: 'Профессиональный ноутбук для разработчиков и креаторов',
      image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
      moq: 5,
      rating: 4.9
    },
    {
      name: 'Lenovo ThinkPad X1 Carbon Gen 11',
      category: 'Электроника',
      subcategory: 'Ноутбуки',
      price_cny: 8999,
      price_rub: 107000,
      supplier: 'Lenovo Beijing Office',
      description: 'Бизнес-ноутбук с Intel Core i7 13-го поколения',
      image_url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed',
      moq: 10,
      rating: 4.8
    },
    {
      name: 'AirPods Pro 2 (USB-C)',
      category: 'Электроника',
      subcategory: 'Наушники',
      price_cny: 1899,
      price_rub: 22600,
      supplier: 'Guangzhou Audio Tech',
      description: 'Беспроводные наушники с активным шумоподавлением',
      image_url: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7',
      moq: 50,
      rating: 4.8
    },
    {
      name: 'Sony WH-1000XM5',
      category: 'Электроника',
      subcategory: 'Наушники',
      price_cny: 2299,
      price_rub: 27400,
      supplier: 'Shanghai Sony Electronics',
      description: 'Премиальные накладные наушники с лучшим шумоподавлением',
      image_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b',
      moq: 30,
      rating: 4.9
    },
    {
      name: 'iPad Pro 12.9" M2 256GB',
      category: 'Электроника',
      subcategory: 'Планшеты',
      price_cny: 8999,
      price_rub: 107000,
      supplier: 'Shenzhen Apple Distributor',
      description: 'Профессиональный планшет для работы и творчества',
      image_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0',
      moq: 10,
      rating: 4.9
    },
    {
      name: 'Samsung Galaxy Tab S9 Ultra',
      category: 'Электроника',
      subcategory: 'Планшеты',
      price_cny: 7999,
      price_rub: 95200,
      supplier: 'Samsung China Electronics',
      description: 'Флагманский Android планшет с AMOLED экраном',
      image_url: 'https://images.unsplash.com/photo-1561154464-82e9adf32764',
      moq: 15,
      rating: 4.7
    }
  ],

  // Одежда
  clothing: [
    {
      name: 'Зимний пуховик The North Face',
      category: 'Одежда',
      subcategory: 'Верхняя одежда',
      price_cny: 899,
      price_rub: 10700,
      supplier: 'Guangzhou Fashion Group',
      description: 'Теплый пуховик с водоотталкивающей пропиткой',
      image_url: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543',
      moq: 100,
      rating: 4.6
    },
    {
      name: 'Кроссовки Nike Air Max 270',
      category: 'Одежда',
      subcategory: 'Обувь',
      price_cny: 459,
      price_rub: 5500,
      supplier: 'Putian Sports Shoes Factory',
      description: 'Спортивные кроссовки с воздушной подушкой',
      image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
      moq: 200,
      rating: 4.5
    },
    {
      name: 'Adidas Ultraboost 23',
      category: 'Одежда',
      subcategory: 'Обувь',
      price_cny: 899,
      price_rub: 10700,
      supplier: 'Dongguan Athletic Footwear',
      description: 'Беговые кроссовки с технологией Boost',
      image_url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5',
      moq: 150,
      rating: 4.7
    },
    {
      name: 'Джинсы Levi\'s 501 Original',
      category: 'Одежда',
      subcategory: 'Джинсы',
      price_cny: 299,
      price_rub: 3600,
      supplier: 'Guangzhou Denim Factory',
      description: 'Классические прямые джинсы',
      image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d',
      moq: 300,
      rating: 4.6
    },
    {
      name: 'Футболка оверсайз хлопок 100%',
      category: 'Одежда',
      subcategory: 'Футболки',
      price_cny: 39,
      price_rub: 470,
      supplier: 'Yiwu Textile Manufacturing',
      description: 'Базовая футболка премиум качества',
      image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
      moq: 500,
      rating: 4.4
    },
    {
      name: 'Худи Champion Classic',
      category: 'Одежда',
      subcategory: 'Толстовки',
      price_cny: 189,
      price_rub: 2250,
      supplier: 'Hangzhou Sportswear Co.',
      description: 'Классическая толстовка с капюшоном',
      image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7',
      moq: 200,
      rating: 4.5
    }
  ],

  // Мебель
  furniture: [
    {
      name: 'Офисное кресло Herman Miller Aeron',
      category: 'Мебель',
      subcategory: 'Офисная мебель',
      price_cny: 4999,
      price_rub: 59500,
      supplier: 'Foshan Premium Furniture',
      description: 'Эргономичное кресло для офиса премиум класса',
      image_url: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8',
      moq: 20,
      rating: 4.9
    },
    {
      name: 'Письменный стол регулируемый по высоте',
      category: 'Мебель',
      subcategory: 'Офисная мебель',
      price_cny: 2999,
      price_rub: 35700,
      supplier: 'Shenzhen Office Solutions',
      description: 'Стол с электроприводом для работы стоя и сидя',
      image_url: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c',
      moq: 30,
      rating: 4.7
    },
    {
      name: 'Диван угловой скандинавский стиль',
      category: 'Мебель',
      subcategory: 'Мягкая мебель',
      price_cny: 8999,
      price_rub: 107000,
      supplier: 'Guangzhou Home Furniture',
      description: 'Современный угловой диван с ящиком для хранения',
      image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
      moq: 10,
      rating: 4.6
    },
    {
      name: 'Кровать двуспальная 160x200',
      category: 'Мебель',
      subcategory: 'Спальня',
      price_cny: 3999,
      price_rub: 47600,
      supplier: 'Foshan Bedroom Furniture',
      description: 'Кровать в современном стиле с мягким изголовьем',
      image_url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
      moq: 15,
      rating: 4.7
    },
    {
      name: 'Шкаф-купе 3-х дверный',
      category: 'Мебель',
      subcategory: 'Шкафы',
      price_cny: 5999,
      price_rub: 71400,
      supplier: 'Guangzhou Storage Solutions',
      description: 'Вместительный шкаф с зеркальными дверями',
      image_url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2',
      moq: 10,
      rating: 4.5
    }
  ],

  // Строительство
  construction: [
    {
      name: 'Дрель-шуруповерт Makita 18V',
      category: 'Строительство',
      subcategory: 'Электроинструменты',
      price_cny: 899,
      price_rub: 10700,
      supplier: 'Yongkang Power Tools Co.',
      description: 'Аккумуляторная дрель профессионального уровня',
      image_url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c',
      moq: 50,
      rating: 4.8
    },
    {
      name: 'Перфоратор Bosch GBH 2-28',
      category: 'Строительство',
      subcategory: 'Электроинструменты',
      price_cny: 1899,
      price_rub: 22600,
      supplier: 'Hangzhou Industrial Tools',
      description: 'Мощный перфоратор для бетона',
      image_url: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407',
      moq: 30,
      rating: 4.7
    },
    {
      name: 'Светодиодная лента 5050 RGB 5м',
      category: 'Строительство',
      subcategory: 'Освещение',
      price_cny: 89,
      price_rub: 1070,
      supplier: 'Shenzhen LED Technologies',
      description: 'Управляемая RGB подсветка с пультом',
      image_url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15',
      moq: 500,
      rating: 4.5
    },
    {
      name: 'Умная розетка Xiaomi Smart Plug',
      category: 'Строительство',
      subcategory: 'Умный дом',
      price_cny: 59,
      price_rub: 710,
      supplier: 'Xiaomi Smart Home Division',
      description: 'WiFi розетка с управлением через приложение',
      image_url: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f',
      moq: 1000,
      rating: 4.6
    },
    {
      name: 'Керамическая плитка 60x60 см',
      category: 'Строительство',
      subcategory: 'Отделочные материалы',
      price_cny: 29,
      price_rub: 350,
      supplier: 'Foshan Ceramics Factory',
      description: 'Глазурованная плитка под мрамор',
      image_url: 'https://images.unsplash.com/photo-1615875221248-d3de751fda2e',
      moq: 2000,
      rating: 4.4
    }
  ],

  // Автотовары
  auto: [
    {
      name: 'Видеорегистратор 70mai A810',
      category: 'Автотовары',
      subcategory: 'Электроника для авто',
      price_cny: 599,
      price_rub: 7140,
      supplier: 'Shenzhen Auto Electronics',
      description: '4K видеорегистратор с GPS и WiFi',
      image_url: 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741',
      moq: 100,
      rating: 4.6
    },
    {
      name: 'Автомобильный пылесос Xiaomi',
      category: 'Автотовары',
      subcategory: 'Аксессуары',
      price_cny: 199,
      price_rub: 2370,
      supplier: 'Xiaomi Automotive Accessories',
      description: 'Беспроводной портативный пылесос',
      image_url: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9',
      moq: 200,
      rating: 4.5
    },
    {
      name: 'Тормозные колодки Brembo передние',
      category: 'Автотовары',
      subcategory: 'Запчасти',
      price_cny: 899,
      price_rub: 10700,
      supplier: 'Guangzhou Auto Parts Distributor',
      description: 'Керамические колодки для седанов',
      image_url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3',
      moq: 50,
      rating: 4.7
    },
    {
      name: 'Моторное масло Mobil 1 5W-30 4л',
      category: 'Автотовары',
      subcategory: 'Автохимия',
      price_cny: 299,
      price_rub: 3570,
      supplier: 'Shanghai Lubricants Trading',
      description: 'Синтетическое моторное масло премиум',
      image_url: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04',
      moq: 300,
      rating: 4.8
    }
  ]
}

async function seedCatalog() {
  console.log('🌱 Начинаем наполнение каталога реалистичными данными...\n')

  let totalInserted = 0

  for (const [categoryKey, products] of Object.entries(realisticCatalog)) {
    console.log(`📦 Категория: ${categoryKey}`)

    for (const product of products) {
      const { data, error } = await supabase
        .from('catalog_products')
        .insert({
          name: product.name,
          category: product.category,
          subcategory: product.subcategory,
          price_cny: product.price_cny,
          price_rub: product.price_rub,
          supplier: product.supplier,
          description: product.description,
          image_url: product.image_url,
          moq: product.moq,
          rating: product.rating,
          in_stock: true,
          verified: true
        })

      if (error) {
        console.error(`   ❌ Ошибка при добавлении "${product.name}":`, error.message)
      } else {
        totalInserted++
        console.log(`   ✅ ${product.name} - ${product.price_cny} ¥`)
      }
    }
    console.log('')
  }

  console.log(`\n🎉 Готово! Добавлено ${totalInserted} товаров в каталог`)
}

seedCatalog().catch(console.error)
