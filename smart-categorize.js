/**
 * Умная категоризация товаров на основе ключевых слов
 * Стратегия: мульти-этапный маппинг с приоритетами
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI';

const supabase = createClient(supabaseUrl, supabaseKey);

// ID подкатегорий (из анализа)
const SUBCATEGORIES = {
  // Электроника
  'smartphones': '0d8f3d01-a56c-4840-809a-5eab1edbc4c1',       // Смартфоны и планшеты
  'electronics': '52b329e8-5fbf-4e77-83a2-62d55e5671d6',       // Электроника общего назначения

  // Дом и быт
  'furniture': '00000066-0000-0000-0000-000000660000',         // Мебель
  'kitchen_tech': '3a8897e5-6b92-49c7-9cf9-ffc08c8d8238',      // Кухонная техника
  'lighting': '3f7e26a0-69f3-4e58-8ef0-b99e1bf2c3e1',          // Освещение
  'textile': '7e24f43c-bbf7-4827-9251-8ddde961ce65',           // Текстиль
  'bedroom': '321e45c7-a9ad-4ec8-b900-74fbe75afcd0',           // Спальня
  'storage': '0dcee08a-a381-41d2-a05c-c54d7a39df9b',           // Системы хранения
  'smart_home': '2292b403-4a9e-4372-8dd7-75a33c9dc85e',        // Умный дом
  'household': '4e53a812-6edb-482f-8ea1-b9150215c169',         // Хозяйственные товары
  'decor': '8297422c-1ca9-432f-b966-4168458aa5c7',             // Декор
  'dishes': '6e84842b-a87c-4462-8aff-e4d852ea34c9',            // Посуда
  'plumbing': 'f96de294-53bd-4ff8-9630-4bbd896b5e67',          // Сантехника
  'accessories': 'afa6086b-b496-440e-956d-b8dd44bd24fd',       // Аксессуары и фурнитура
  'fabrics': '7e18ace2-6e71-4acd-a5df-033783c7ffdb',           // Ткани
  'clothes_wholesale': '84e8ba49-d986-4836-a330-93ba639f79fa', // Одежда оптом
  'prof_literature': '935d68e2-9ee6-4e90-8c37-f46bb5fd25f6',   // Профессиональная литература

  // Здоровье и красота
  'skincare': 'c90531a8-0a92-4ece-98a1-1e97489c063f',          // Уход за кожей
  'cosmetics': 'd9426962-6ca6-4187-99dd-0bd0ca88651e',         // Косметика
  'hygiene': 'e6b134fc-e159-4acb-ad07-6f6631ebea09',           // Средства гигиены
  'vitamins': 'a8eab889-5dd7-4e03-be9c-faee9b774418',          // Витамины и БАД

  // Здоровье и медицина
  'medical': 'f47ac10b-58cc-4372-a567-0e02b2c3d479',           // Медицинские приборы

  // Строительство
  'tools': '761a23b9-9a65-49ec-922d-8db58b9fcce9',             // Инструменты
  'electric': 'b06d205d-3f25-4c61-8037-fcf706aa70f9',          // Электрика
  'building_materials': 'bbe7d783-577b-45ee-af4e-6ce07e81c489',// Строительные материалы
  'fasteners': '6ddf03e3-cba8-4f8c-a352-5d43072264bb',         // Крепеж и метизы
  'doors_windows': '19c6d42b-aa85-43e8-92c3-c50ed7ddb2d1',     // Двери и окна
  'paints': '435f8cc5-a34a-4493-a5d3-ac20a6cb06a6',            // Краски и лаки
  'finishing': 'b1641e79-72b8-40c9-b3a8-04808ec41b99',         // Отделочные материалы

  // Автотовары
  'auto_parts': 'b045d61a-56a4-4c75-9e11-a2d600df97f1',        // Автозапчасти
  'auto_chemistry': '1f2645f7-6bc1-4df1-97df-959c3f23cacb',    // Автохимия
  'tires': '6b178b91-cb95-4ec2-b76b-dab5861bf250',             // Шины и диски

  // Промышленность
  'machines': 'ecca7d11-cc0d-441d-83eb-c8318c48feb3',          // Станки и оборудование
};

/**
 * Правила категоризации с приоритетами
 * Формат: { priority: число (меньше = выше), keywords: [...], category: ID }
 * ВАЖНО: порядок имеет значение! Более специфичные правила должны быть выше.
 */
const CATEGORIZATION_RULES = [
  // ============ ВЫСШИЙ ПРИОРИТЕТ - специфичные термины ============

  // Книги и литература (приоритет над всем - часто содержат слова других категорий)
  {
    priority: 1,
    keywords: ['издание', 'edition', 'учебник', 'textbook', 'руководство', 'manual', 'справочник',
               'handbook', 'пособие', 'книга', 'book', 'обучение', 'учебн', 'курс'],
    category: SUBCATEGORIES.prof_literature
  },

  // Медицинские приборы
  {
    priority: 2,
    keywords: ['тонометр', 'sphygmomanometer', 'термометр', 'thermometer', 'пульсоксиметр',
               'oximeter', 'давлен', 'pressure monitor', 'стетоскоп', 'stethoscope',
               'usmle', 'медицин', 'medical', 'клиник', 'clinic', 'диагност', 'diagnos'],
    category: SUBCATEGORIES.medical
  },

  // Витамины и БАД
  {
    priority: 2,
    keywords: ['витамин', 'vitamin', 'омега', 'omega', 'рыбий жир', 'fish oil', 'бад',
               'supplement', 'капсул', 'capsule', 'добавк', 'коллаген', 'collagen',
               'пробиотик', 'probiotic', 'мультивитамин', 'мультиминерал'],
    category: SUBCATEGORIES.vitamins
  },

  // ============ ЭЛЕКТРОНИКА ============

  // Смартфоны/планшеты
  {
    priority: 3,
    keywords: ['смартфон', 'smartphone', 'планшет', 'tablet', 'iphone', 'ipad', 'android',
               'телефон держатель', 'phone holder', 'телепромп', 'teleprom', 'стабилизатор смартфон',
               'геймпад', 'gamepad', 'сенсорн экран', 'touchscreen'],
    category: SUBCATEGORIES.smartphones
  },

  // Электроника (ноутбуки, USB, периферия)
  {
    priority: 4,
    keywords: ['ноутбук', 'laptop', 'notebook', 'macbook', 'usb', 'hub', 'клавиатур',
               'keyboard', 'мыш', 'mouse', 'монитор подстав', 'компьютер', 'computer',
               'адаптер', 'adapter', 'зарядное', 'charger', 'power bank', 'вентилятор ноутбук'],
    category: SUBCATEGORIES.electronics
  },

  // ============ ДОМ И БЫТ ============

  // Мебель
  {
    priority: 5,
    keywords: ['диван', 'sofa', 'кресло', 'armchair', 'стол', 'table', 'стул', 'chair',
               'шкаф', 'cabinet', 'wardrobe', 'полка', 'shelf', 'кровать', 'bed',
               'мебель', 'furniture', 'комод', 'dresser', 'тумба', 'nightstand',
               'стеллаж', 'rack', 'журнальн столик', 'coffee table', 'italia', 'glas'],
    category: SUBCATEGORIES.furniture
  },

  // Кухонная техника
  {
    priority: 5,
    keywords: ['миксер', 'mixer', 'блендер', 'blender', 'комбайн кухонн', 'food processor',
               'мясорубк', 'grinder', 'тостер', 'toaster', 'кофемашин', 'кофеварк', 'coffee maker',
               'микроволнов', 'microwave', 'philips палочка', 'смешиван палочка'],
    category: SUBCATEGORIES.kitchen_tech
  },

  // Посуда
  {
    priority: 5,
    keywords: ['тарелк', 'plate', 'чашк', 'cup', 'кружк', 'mug', 'столовы прибор', 'cutlery',
               'ложк', 'spoon', 'вилк', 'fork', 'нож кухонн', 'кастрюл', 'pot', 'сковород', 'pan',
               'керамическ посуд', 'ceramic dish', 'бокал', 'glass'],
    category: SUBCATEGORIES.dishes
  },

  // Освещение
  {
    priority: 5,
    keywords: ['лампа', 'lamp', 'люстр', 'chandelier', 'светильник', 'светодиодн', 'led light',
               'бра', 'торшер', 'фонарь', 'lantern', 'подсветк', 'backlight', 'солнечн энерг фонар',
               'уличн фонар', 'street lamp'],
    category: SUBCATEGORIES.lighting
  },

  // Текстиль (штор, полотенц, постельное)
  {
    priority: 5,
    keywords: ['штор', 'curtain', 'полотенц', 'towel', 'простын', 'sheet', 'наволочк', 'pillowcase',
               'одеял', 'blanket', 'покрывал', 'bedspread', 'плед', 'throw', 'шифонов ткань',
               'марл', 'gauze', 'салфетк', 'napkin', 'скатерт', 'tablecloth'],
    category: SUBCATEGORIES.textile
  },

  // Спальня (матрас, подушка)
  {
    priority: 5,
    keywords: ['матрас', 'mattress', 'подушк', 'pillow', 'sealy', 'пена памят', 'memory foam',
               'ортопедическ', 'orthopedic', 'кроват двусп', 'двуспальн'],
    category: SUBCATEGORIES.bedroom
  },

  // Системы хранения
  {
    priority: 6,
    keywords: ['хранен', 'storage', 'органайзер', 'organizer', 'контейнер', 'container',
               'коробк', 'box', 'корзин', 'basket', 'ящик', 'drawer', 'банк для', 'jar'],
    category: SUBCATEGORIES.storage
  },

  // Умный дом
  {
    priority: 5,
    keywords: ['камер наблюден', 'cctv', 'видеонаблюден', 'surveillance', 'датчик', 'sensor',
               'умн дом', 'smart home', 'wifi розетк', 'wifi switch', 'умн розетк', 'esp8266',
               'iot', 'автоматизац', 'automation'],
    category: SUBCATEGORIES.smart_home
  },

  // Сантехника
  {
    priority: 5,
    keywords: ['смесител', 'faucet', 'кран', 'tap', 'душ', 'shower', 'унитаз', 'toilet',
               'раковин', 'sink', 'ванн', 'bath', 'водонагреват', 'water heater', 'трубк сантехн'],
    category: SUBCATEGORIES.plumbing
  },

  // Декор
  {
    priority: 6,
    keywords: ['декор', 'decor', 'ваз', 'vase', 'картин', 'picture', 'фоторамк', 'photo frame',
               'статуэтк', 'figurine', 'украшен интерьер', 'зеркало декор'],
    category: SUBCATEGORIES.decor
  },

  // ============ ЗДОРОВЬЕ И КРАСОТА ============

  // Уход за кожей
  {
    priority: 4,
    keywords: ['крем', 'cream', 'сыворотк', 'serum', 'лосьон', 'lotion', 'маск лиц', 'face mask',
               'увлажня', 'moistur', 'солнцезащитн', 'sunscreen', 'spf', 'отбеливающ', 'whitening',
               'антивозрастн', 'anti-age', 'авокадо крем', 'антифриз крем'],
    category: SUBCATEGORIES.skincare
  },

  // Косметика
  {
    priority: 4,
    keywords: ['помад', 'lipstick', 'тушь', 'mascara', 'тени', 'eyeshadow', 'румян', 'blush',
               'пудр', 'powder', 'макияж', 'makeup', 'кисти макияж', 'makeup brush', 'лак ногт',
               'nail polish', 'маникюр', 'manicure', 'bb cream'],
    category: SUBCATEGORIES.cosmetics
  },

  // Средства гигиены
  {
    priority: 4,
    keywords: ['зубн щетк', 'toothbrush', 'oral b', 'мыл', 'soap', 'дезодорант', 'deodorant',
               'шампун', 'shampoo', 'гел душ', 'shower gel', 'зубн паст', 'toothpaste',
               'дезинфиц', 'sanitizer', 'антисепт', 'antiseptic'],
    category: SUBCATEGORIES.hygiene
  },

  // ============ СТРОИТЕЛЬСТВО ============

  // Инструменты
  {
    priority: 5,
    keywords: ['дрел', 'drill', 'шуруповерт', 'screwdriver', 'отвертк', 'пил', 'saw',
               'молоток', 'hammer', 'плоскогубц', 'pliers', 'гайковерт', 'wrench', 'ключ гаечн',
               'шлифовальн', 'grinder', 'лобзик', 'jigsaw', 'болгарк', 'angle grinder',
               'аккумуляторн инструмент'],
    category: SUBCATEGORIES.tools
  },

  // Электрика
  {
    priority: 5,
    keywords: ['розетк', 'socket', 'выключател', 'switch', 'автомат выключ', 'circuit breaker',
               'кабел', 'cable', 'провод электр', 'wire', 'трекер провод', 'wire tracker',
               'термомагнитн', 'электрощит'],
    category: SUBCATEGORIES.electric
  },

  // Крепеж и метизы
  {
    priority: 5,
    keywords: ['винт', 'screw', 'гайк', 'nut', 'болт', 'bolt', 'шайб', 'washer', 'дюбел', 'dowel',
               'анкер', 'anchor', 'крюк', 'hook', 'заклепк', 'rivet', 'din71802', 'метиз'],
    category: SUBCATEGORIES.fasteners
  },

  // Двери и окна
  {
    priority: 5,
    keywords: ['дверь', 'door', 'окно', 'window', 'замок двер', 'door lock', 'ручк двер',
               'door handle', 'петл', 'hinge', 'раздвижн дверь', 'sliding door'],
    category: SUBCATEGORIES.doors_windows
  },

  // Краски и лаки
  {
    priority: 5,
    keywords: ['краск', 'paint', 'лак', 'lacquer', 'морилк', 'stain', 'грунтовк', 'primer',
               '3m primer', 'покрыт уф', 'uv coating', 'эмал', 'enamel'],
    category: SUBCATEGORIES.paints
  },

  // Отделочные материалы
  {
    priority: 6,
    keywords: ['обо', 'wallpaper', 'плитк', 'tile', 'ламинат', 'laminate', 'линолеум',
               'паркет', 'parquet', 'панел стен', 'wall panel', 'потолочн', 'ceiling'],
    category: SUBCATEGORIES.finishing
  },

  // Строительные материалы
  {
    priority: 6,
    keywords: ['цемент', 'cement', 'бетон', 'concrete', 'кирпич', 'brick', 'гипс', 'gypsum',
               'акустическ панел', 'acoustic panel', 'строительн материал'],
    category: SUBCATEGORIES.building_materials
  },

  // ============ АВТОТОВАРЫ ============

  // Автозапчасти
  {
    priority: 4,
    keywords: ['тормоз колодк', 'brake pad', 'фильтр воздушн', 'air filter', 'свеч зажиган',
               'spark plug', 'стартер', 'starter', 'генератор авто', 'alternator', 'mtb диск',
               'велосипед тормоз'],
    category: SUBCATEGORIES.auto_parts
  },

  // Автохимия (исключая косметику!)
  {
    priority: 4,
    keywords: ['омыватель', 'washer fluid', 'полироль авто', 'car polish', 'воск авто', 'car wax',
               'антифриз авто', 'antifreeze car', 'очистител автомобил', 'car cleaner',
               'насос ветрового', 'windshield pump'],
    excludeKeywords: ['крем', 'cream', 'лицо', 'face', 'кожа', 'skin', 'авокадо'],
    category: SUBCATEGORIES.auto_chemistry
  },

  // Шины и диски
  {
    priority: 4,
    keywords: ['шин', 'tire', 'tyre', 'диск колесн', 'wheel', 'покрышк', 'камер колес',
               'tpms', 'давлен шин'],
    category: SUBCATEGORIES.tires
  },

  // ============ ПРОМЫШЛЕННОСТЬ ============

  // Станки и оборудование
  {
    priority: 4,
    keywords: ['токарн', 'lathe', 'фрезерн', 'milling', 'сварочн', 'welding', 'cnc', 'чпу',
               'станок', 'machine tool', 'гравер', 'engraver', 'mig', 'mag', 'tig', 'инвертор сварочн'],
    category: SUBCATEGORIES.machines
  },

  // ============ ТКАНИ И ТЕКСТИЛЬНОЕ ПРОИЗВОДСТВО ============

  // Ткани (материалы)
  {
    priority: 7,
    keywords: ['ткан материал', 'fabric material', 'текстильн ткан', 'пряж', 'yarn',
               'нить швейн', 'thread', 'хлопок ткан', 'cotton fabric', 'лён ткан', 'linen fabric'],
    category: SUBCATEGORIES.fabrics
  },

  // Аксессуары и фурнитура (швейная)
  {
    priority: 7,
    keywords: ['молни', 'zipper', 'пуговиц', 'button', 'кнопк одежд', 'snap', 'липучк', 'velcro',
               'тесьм', 'ribbon', 'кружев', 'lace', 'швейн нит', 'резинк одежд', 'elastic band',
               'эластичн лент', 'фитнес резинк'],
    category: SUBCATEGORIES.accessories
  },

  // ============ FALLBACK - самый низкий приоритет ============

  // Хозяйственные товары (catchall для дома)
  {
    priority: 100,
    keywords: ['домашн', 'home', 'бытов', 'household', 'уборк', 'cleaning', 'ведро', 'bucket',
               'швабр', 'mop', 'щетк', 'brush', 'перчатк', 'gloves'],
    category: SUBCATEGORIES.household
  },
];

/**
 * Определить категорию для товара
 */
function categorizeProduct(product) {
  const name = (product.name || '').toLowerCase();
  const description = (product.description || '').toLowerCase();
  const text = `${name} ${description}`;

  let bestMatch = null;
  let bestPriority = Infinity;

  for (const rule of CATEGORIZATION_RULES) {
    // Проверяем исключающие ключевые слова
    if (rule.excludeKeywords) {
      const hasExcluded = rule.excludeKeywords.some(kw => text.includes(kw.toLowerCase()));
      if (hasExcluded) continue;
    }

    // Проверяем совпадение ключевых слов
    const matches = rule.keywords.filter(kw => text.includes(kw.toLowerCase()));

    if (matches.length > 0 && rule.priority < bestPriority) {
      bestPriority = rule.priority;
      bestMatch = {
        category: rule.category,
        matchedKeywords: matches,
        priority: rule.priority
      };
    }
  }

  return bestMatch;
}

/**
 * Главная функция
 */
async function main() {
  const dryRun = process.argv.includes('--dry-run');
  console.log(dryRun ? '=== DRY RUN MODE ===' : '=== EXECUTING MIGRATION ===');
  console.log('');

  // Загружаем категории для отображения имен
  const { data: categories } = await supabase.from('categories').select('*');
  const catMap = {};
  categories.forEach(c => { catMap[c.id] = c.name; });

  // Загружаем все товары
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, description, category_id');

  if (error) {
    console.error('Ошибка загрузки товаров:', error);
    return;
  }

  console.log(`Загружено товаров: ${products.length}\n`);

  // Категоризируем каждый товар
  const changes = [];
  const noMatch = [];

  for (const product of products) {
    const result = categorizeProduct(product);

    if (result && result.category !== product.category_id) {
      changes.push({
        id: product.id,
        name: product.name,
        oldCategory: catMap[product.category_id] || 'NULL',
        newCategory: catMap[result.category] || 'UNKNOWN',
        newCategoryId: result.category,
        matchedKeywords: result.matchedKeywords,
        priority: result.priority
      });
    } else if (!result) {
      noMatch.push(product);
    }
  }

  console.log(`Товаров для переноса: ${changes.length}`);
  console.log(`Товаров без совпадения: ${noMatch.length}\n`);

  // Группируем изменения по направлению
  const byDirection = {};
  for (const change of changes) {
    const key = `${change.oldCategory} → ${change.newCategory}`;
    if (!byDirection[key]) byDirection[key] = [];
    byDirection[key].push(change);
  }

  console.log('=== ИЗМЕНЕНИЯ ПО КАТЕГОРИЯМ ===\n');
  for (const [direction, items] of Object.entries(byDirection).sort((a, b) => b[1].length - a[1].length)) {
    console.log(`\n${direction} (${items.length} товаров):`);
    items.slice(0, 5).forEach(item => {
      console.log(`  - "${item.name.substring(0, 60)}..." [${item.matchedKeywords.slice(0, 3).join(', ')}]`);
    });
    if (items.length > 5) console.log(`  ... и ещё ${items.length - 5} товаров`);
  }

  // Показываем товары без совпадения
  if (noMatch.length > 0) {
    console.log('\n\n=== ТОВАРЫ БЕЗ СОВПАДЕНИЯ (останутся в текущих категориях) ===\n');
    noMatch.slice(0, 20).forEach(p => {
      console.log(`  [${catMap[p.category_id] || 'NULL'}] ${p.name.substring(0, 70)}`);
    });
    if (noMatch.length > 20) console.log(`  ... и ещё ${noMatch.length - 20} товаров`);
  }

  // Выполняем обновление если не dry-run
  if (!dryRun && changes.length > 0) {
    console.log('\n\n=== ПРИМЕНЕНИЕ ИЗМЕНЕНИЙ ===\n');

    let updated = 0;
    let failed = 0;

    for (const change of changes) {
      const { error } = await supabase
        .from('products')
        .update({ category_id: change.newCategoryId })
        .eq('id', change.id);

      if (error) {
        console.error(`Ошибка обновления ${change.id}:`, error);
        failed++;
      } else {
        updated++;
      }
    }

    console.log(`Успешно обновлено: ${updated}`);
    console.log(`Ошибок: ${failed}`);

    // Пересчитываем счётчики
    console.log('\n=== ПЕРЕСЧЁТ СЧЁТЧИКОВ product_count ===\n');

    // Обнуляем все счётчики
    await supabase.from('categories').update({ product_count: 0 }).neq('id', '00000000-0000-0000-0000-000000000000');

    // Считаем товары для каждой категории
    for (const cat of categories) {
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', cat.id);

      if (count > 0) {
        await supabase
          .from('categories')
          .update({ product_count: count })
          .eq('id', cat.id);
        console.log(`  ${cat.name}: ${count}`);
      }
    }

    console.log('\n✅ Миграция завершена!');
  } else if (dryRun) {
    console.log('\n\n⚠️  Это был DRY RUN. Для применения изменений запустите без флага --dry-run');
  }
}

main().catch(console.error);
