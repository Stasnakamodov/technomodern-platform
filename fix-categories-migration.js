/**
 * Миграция товаров с ROOT категорий в подкатегории
 *
 * Проблема: 313 товаров привязаны к ROOT категориям или имеют NULL category_id
 * - 151 товар на ROOT "Автотовары"
 * - 150 товаров на ROOT "Здоровье и красота"
 * - 12 товаров с NULL category_id
 */

const SUPABASE_URL = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI';

// ROOT категории
const ROOT_CATEGORIES = {
  AUTOMOTIVE: 'e18eb782-6fca-414a-b221-dadc694461b1',
  HEALTH_BEAUTY: '93d696c4-2f81-4de8-9184-3d492fe9bfa4'
};

// Подкатегории для маппинга
const SUBCATEGORIES = {
  // Автотовары
  AUTO_PARTS: 'b045d61a-56a4-4c75-9e11-a2d600df97f1',      // Автозапчасти
  AUTO_CHEMICALS: '1f2645f7-6bc1-4df1-97df-959c3f23cacb',  // Автохимия (дефолт для Автотовары)
  TIRES_WHEELS: '6b178b91-cb95-4ec2-b76b-dab5861bf250',    // Шины и диски

  // Здоровье и красота
  SKINCARE: 'c90531a8-0a92-4ece-98a1-1e97489c063f',        // Уход за кожей (дефолт для Здоровье)
  COSMETICS: 'd9426962-6ca6-4187-99dd-0bd0ca88651e',       // Косметика
  HYGIENE: 'e6b134fc-e159-4acb-ad07-6f6631ebea09',         // Средства гигиены
  VITAMINS: 'a8eab889-5dd7-4e03-be9c-faee9b774418',        // Витамины и БАД

  // Другие подкатегории для NULL товаров
  TOOLS: '761a23b9-9a65-49ec-922d-8db58b9fcce9',           // Инструменты (для электроинструментов)
  FURNITURE: '00000066-0000-0000-0000-000000660000'        // Мебель
};

// Правила маппинга для Автотовары
const AUTOMOTIVE_RULES = [
  // Шины и диски
  {
    keywords: ['шин', 'tire', 'колес', 'wheel', 'диск', 'tpm', 'давлен'],
    category: SUBCATEGORIES.TIRES_WHEELS
  },
  // Автозапчасти
  {
    keywords: ['двигат', 'мотор', 'engine', 'радиатор', 'фильтр', 'filter', 'масл', 'oil', 'трансмисс', 'статор', 'охлажд'],
    category: SUBCATEGORIES.AUTO_PARTS
  },
  // Автохимия (всё остальное: мойка, полировка, воск, покрытие)
  {
    keywords: ['мойка', 'мыт', 'wash', 'полиро', 'polish', 'воск', 'wax', 'покрыт', 'coat', 'пылесос', 'vacuum', 'царапин', 'scratch', 'керамич', 'ceramic', 'nano', 'нано', 'очист', 'clean', 'шампунь'],
    category: SUBCATEGORIES.AUTO_CHEMICALS
  }
];

// Правила маппинга для Здоровье и красота
const HEALTH_BEAUTY_RULES = [
  // Косметика
  {
    keywords: ['помад', 'lipstick', 'макияж', 'makeup', 'губ', 'lip', 'тени', 'shadow', 'тушь', 'mascara', 'пудр', 'powder', 'консилер', 'concealer', 'блеск', 'gloss', 'foundation'],
    category: SUBCATEGORIES.COSMETICS
  },
  // Средства гигиены
  {
    keywords: ['мыло', 'soap', 'шампунь', 'shampoo', 'гель для душа', 'body wash', 'гигиен', 'hygiene', 'зубн', 'tooth', 'дезодор', 'deodorant'],
    category: SUBCATEGORIES.HYGIENE
  },
  // Витамины - только если прямо в названии "витамин"
  {
    keywords: ['витамин', 'vitamin', 'бад', 'supplement'],
    category: SUBCATEGORIES.VITAMINS,
    strictMatch: true // требует точного совпадения слова
  },
  // Уход за кожей (всё остальное: кремы, сыворотки, маски)
  {
    keywords: ['крем', 'cream', 'сыворот', 'serum', 'лосьон', 'lotion', 'маска', 'mask', 'уход', 'care', 'кож', 'skin', 'увлажн', 'moistur', 'антивоз', 'anti-age', 'морщин', 'wrinkle', 'отбелив', 'whiten', 'солнцезащит', 'sun', 'spf'],
    category: SUBCATEGORIES.SKINCARE
  }
];

// Правила для товаров с NULL category_id (электроинструменты)
const NULL_CATEGORY_RULES = [
  {
    keywords: ['дрель', 'drill', 'пила', 'saw', 'шлиф', 'grinder', 'молоток', 'hammer', 'makita', 'bosch', 'milwaukee', 'бесщеточн'],
    category: SUBCATEGORIES.TOOLS
  },
  {
    keywords: ['мебель', 'furniture', 'стол', 'стул', 'шкаф', 'кровать'],
    category: SUBCATEGORIES.FURNITURE
  }
];

async function fetchProducts(categoryId = null) {
  let url = `${SUPABASE_URL}/rest/v1/products?select=id,name,category_id`;

  if (categoryId === null) {
    url += '&category_id=is.null';
  } else {
    url += `&category_id=eq.${categoryId}`;
  }
  url += '&limit=500';

  const response = await fetch(url, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  });

  return response.json();
}

function categorizeProduct(productName, rules, defaultCategory) {
  const nameLower = productName.toLowerCase();

  for (const rule of rules) {
    for (const keyword of rule.keywords) {
      if (nameLower.includes(keyword.toLowerCase())) {
        return rule.category;
      }
    }
  }

  return defaultCategory;
}

async function updateProduct(productId, newCategoryId) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${productId}`, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({ category_id: newCategoryId })
  });

  return response.ok;
}

async function updateCategoryCounts() {
  // Получаем все категории
  const categoriesResponse = await fetch(`${SUPABASE_URL}/rest/v1/categories?select=id`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  });
  const categories = await categoriesResponse.json();

  // Для каждой категории считаем товары и обновляем
  for (const cat of categories) {
    const countResponse = await fetch(`${SUPABASE_URL}/rest/v1/products?select=id&category_id=eq.${cat.id}`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'count=exact'
      }
    });

    const contentRange = countResponse.headers.get('content-range');
    const count = contentRange ? parseInt(contentRange.split('/')[1]) || 0 : 0;

    await fetch(`${SUPABASE_URL}/rest/v1/categories?id=eq.${cat.id}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ product_count: count })
    });
  }

  console.log('✅ Счётчики категорий обновлены');
}

async function migrate() {
  console.log('🚀 Начинаю миграцию товаров...\n');

  let totalMoved = 0;
  const stats = {};

  // 1. Обрабатываем товары с ROOT "Автотовары"
  console.log('📦 Обработка ROOT "Автотовары"...');
  const autoProducts = await fetchProducts(ROOT_CATEGORIES.AUTOMOTIVE);
  console.log(`   Найдено: ${autoProducts.length} товаров`);

  for (const product of autoProducts) {
    const newCategory = categorizeProduct(product.name, AUTOMOTIVE_RULES, SUBCATEGORIES.AUTO_CHEMICALS);
    const success = await updateProduct(product.id, newCategory);

    if (success) {
      totalMoved++;
      stats[newCategory] = (stats[newCategory] || 0) + 1;
    } else {
      console.log(`   ❌ Ошибка: ${product.name}`);
    }
  }
  console.log(`   ✅ Перемещено: ${autoProducts.length} товаров\n`);

  // 2. Обрабатываем товары с ROOT "Здоровье и красота"
  console.log('📦 Обработка ROOT "Здоровье и красота"...');
  const healthProducts = await fetchProducts(ROOT_CATEGORIES.HEALTH_BEAUTY);
  console.log(`   Найдено: ${healthProducts.length} товаров`);

  for (const product of healthProducts) {
    const newCategory = categorizeProduct(product.name, HEALTH_BEAUTY_RULES, SUBCATEGORIES.SKINCARE);
    const success = await updateProduct(product.id, newCategory);

    if (success) {
      totalMoved++;
      stats[newCategory] = (stats[newCategory] || 0) + 1;
    } else {
      console.log(`   ❌ Ошибка: ${product.name}`);
    }
  }
  console.log(`   ✅ Перемещено: ${healthProducts.length} товаров\n`);

  // 3. Обрабатываем товары с NULL category_id
  console.log('📦 Обработка товаров с NULL category_id...');
  const nullProducts = await fetchProducts(null);
  console.log(`   Найдено: ${nullProducts.length} товаров`);

  for (const product of nullProducts) {
    const newCategory = categorizeProduct(product.name, NULL_CATEGORY_RULES, SUBCATEGORIES.TOOLS);
    const success = await updateProduct(product.id, newCategory);

    if (success) {
      totalMoved++;
      stats[newCategory] = (stats[newCategory] || 0) + 1;
    } else {
      console.log(`   ❌ Ошибка: ${product.name}`);
    }
  }
  console.log(`   ✅ Перемещено: ${nullProducts.length} товаров\n`);

  // 4. Обновляем счётчики категорий
  console.log('📊 Обновление счётчиков категорий...');
  await updateCategoryCounts();

  // 5. Итоги
  console.log('\n📈 ИТОГИ МИГРАЦИИ:');
  console.log(`   Всего перемещено: ${totalMoved} товаров`);
  console.log('\n   Распределение по подкатегориям:');

  const categoryNames = {
    [SUBCATEGORIES.AUTO_PARTS]: 'Автозапчасти',
    [SUBCATEGORIES.AUTO_CHEMICALS]: 'Автохимия',
    [SUBCATEGORIES.TIRES_WHEELS]: 'Шины и диски',
    [SUBCATEGORIES.SKINCARE]: 'Уход за кожей',
    [SUBCATEGORIES.COSMETICS]: 'Косметика',
    [SUBCATEGORIES.HYGIENE]: 'Средства гигиены',
    [SUBCATEGORIES.VITAMINS]: 'Витамины и БАД',
    [SUBCATEGORIES.TOOLS]: 'Инструменты',
    [SUBCATEGORIES.FURNITURE]: 'Мебель'
  };

  for (const [catId, count] of Object.entries(stats)) {
    console.log(`   - ${categoryNames[catId] || catId}: ${count}`);
  }
}

// Запуск
migrate().catch(console.error);
