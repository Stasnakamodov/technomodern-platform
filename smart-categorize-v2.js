/**
 * Умная категоризация товаров на основе ключевых слов v2
 * Консервативный подход: только явные переносы с исключениями
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI';

const supabase = createClient(supabaseUrl, supabaseKey);

// ID подкатегорий
const SUBCATEGORIES = {
  // Электроника
  'smartphones': '0d8f3d01-a56c-4840-809a-5eab1edbc4c1',
  'electronics': '52b329e8-5fbf-4e77-83a2-62d55e5671d6',

  // Дом и быт
  'furniture': '00000066-0000-0000-0000-000000660000',
  'kitchen_tech': '3a8897e5-6b92-49c7-9cf9-ffc08c8d8238',
  'lighting': '3f7e26a0-69f3-4e58-8ef0-b99e1bf2c3e1',
  'textile': '7e24f43c-bbf7-4827-9251-8ddde961ce65',
  'bedroom': '321e45c7-a9ad-4ec8-b900-74fbe75afcd0',
  'storage': '0dcee08a-a381-41d2-a05c-c54d7a39df9b',
  'smart_home': '2292b403-4a9e-4372-8dd7-75a33c9dc85e',
  'household': '4e53a812-6edb-482f-8ea1-b9150215c169',
  'decor': '8297422c-1ca9-432f-b966-4168458aa5c7',
  'dishes': '6e84842b-a87c-4462-8aff-e4d852ea34c9',
  'plumbing': 'f96de294-53bd-4ff8-9630-4bbd896b5e67',
  'accessories': 'afa6086b-b496-440e-956d-b8dd44bd24fd',
  'fabrics': '7e18ace2-6e71-4acd-a5df-033783c7ffdb',
  'clothes_wholesale': '84e8ba49-d986-4836-a330-93ba639f79fa',
  'prof_literature': '935d68e2-9ee6-4e90-8c37-f46bb5fd25f6',

  // Здоровье и красота
  'skincare': 'c90531a8-0a92-4ece-98a1-1e97489c063f',
  'cosmetics': 'd9426962-6ca6-4187-99dd-0bd0ca88651e',
  'hygiene': 'e6b134fc-e159-4acb-ad07-6f6631ebea09',
  'vitamins': 'a8eab889-5dd7-4e03-be9c-faee9b774418',

  // Здоровье и медицина
  'medical': 'f47ac10b-58cc-4372-a567-0e02b2c3d479',

  // Строительство
  'tools': '761a23b9-9a65-49ec-922d-8db58b9fcce9',
  'electric': 'b06d205d-3f25-4c61-8037-fcf706aa70f9',
  'building_materials': 'bbe7d783-577b-45ee-af4e-6ce07e81c489',
  'fasteners': '6ddf03e3-cba8-4f8c-a352-5d43072264bb',
  'doors_windows': '19c6d42b-aa85-43e8-92c3-c50ed7ddb2d1',
  'paints': '435f8cc5-a34a-4493-a5d3-ac20a6cb06a6',
  'finishing': 'b1641e79-72b8-40c9-b3a8-04808ec41b99',

  // Автотовары
  'auto_parts': 'b045d61a-56a4-4c75-9e11-a2d600df97f1',
  'auto_chemistry': '1f2645f7-6bc1-4df1-97df-959c3f23cacb',
  'tires': '6b178b91-cb95-4ec2-b76b-dab5861bf250',

  // Промышленность
  'machines': 'ecca7d11-cc0d-441d-83eb-c8318c48feb3',
};

/**
 * Функция для проверки полных слов (не частей слов)
 * @param {string} text - текст для поиска
 * @param {string} word - слово для поиска
 * @returns {boolean}
 */
function hasWord(text, word) {
  // Создаём регулярку для поиска слова целиком
  const regex = new RegExp(`(^|[\\s\\-\\_\\.\\,\\;\\:\\/\\(\\)\\[\\]])${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([\\s\\-\\_\\.\\,\\;\\:\\/\\(\\)\\[\\]]|$)`, 'i');
  return regex.test(text);
}

/**
 * Функция для проверки наличия слова как подстроки (начало слова)
 */
function hasWordStart(text, prefix) {
  const regex = new RegExp(`(^|[\\s\\-\\_\\.\\,\\;\\:\\/\\(\\)\\[\\]])${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');
  return regex.test(text);
}

/**
 * Правила категоризации - КОНСЕРВАТИВНЫЕ
 * Только явные случаи с минимумом ложных срабатываний
 */
const CATEGORIZATION_RULES = [
  // ============ КНИГИ И ЛИТЕРАТУРА ============
  // Очень высокий приоритет - книги часто содержат слова других категорий
  {
    priority: 1,
    name: 'Профессиональная литература',
    check: (text) => {
      // Явные книжные термины
      const bookTerms = ['издание', 'edition', 'учебник', 'textbook', 'руководство по',
                         'справочник', 'handbook', 'пособие по', 'обучение', 'курс лекций'];
      return bookTerms.some(t => text.includes(t));
    },
    category: SUBCATEGORIES.prof_literature
  },

  // ============ МЕДИЦИНА И ЗДОРОВЬЕ ============
  {
    priority: 2,
    name: 'Медицинские приборы',
    check: (text) => {
      const medTerms = ['тонометр', 'sphygmomanometer', 'пульсоксиметр', 'oximeter',
                        'стетоскоп', 'stethoscope', 'usmle', 'медицинск', 'клиническ',
                        'диагностик', 'артериальн давлен', 'blood pressure'];
      return medTerms.some(t => text.includes(t));
    },
    category: SUBCATEGORIES.medical
  },

  {
    priority: 2,
    name: 'Витамины и БАД',
    check: (text) => {
      const vitaminTerms = ['витамин', 'vitamin', 'омега-3', 'omega-3', 'рыбий жир',
                           'fish oil', 'капсул', 'capsule', 'коллаген', 'collagen',
                           'пробиотик', 'probiotic', 'мультивитамин'];
      // Исключаем "капсул" в контексте кофемашин
      if (text.includes('кофе') || text.includes('coffee')) return false;
      return vitaminTerms.some(t => text.includes(t));
    },
    category: SUBCATEGORIES.vitamins
  },

  // ============ КОСМЕТИКА И УХОД ============
  {
    priority: 3,
    name: 'Уход за кожей',
    check: (text) => {
      // Явные термины ухода за кожей
      const skinTerms = ['сыворотка для лица', 'face serum', 'крем для лица', 'face cream',
                        'увлажняющ', 'moisturiz', 'солнцезащитн', 'sunscreen', 'spf',
                        'лосьон для тела', 'body lotion', 'антивозрастн', 'anti-age',
                        'авокадо крем', 'ретинол', 'retinol'];
      // "Авокадо антифриз крем" - это крем для кожи рук!
      if (text.includes('авокадо') && text.includes('крем')) return true;
      if (text.includes('антифриз') && text.includes('крем')) return true;
      return skinTerms.some(t => text.includes(t));
    },
    category: SUBCATEGORIES.skincare
  },

  {
    priority: 3,
    name: 'Косметика',
    check: (text) => {
      const cosmeticTerms = ['помада', 'lipstick', 'тушь для', 'mascara', 'тени для век',
                            'eyeshadow', 'румяна', 'blush', 'пудра для', 'powder',
                            'макияж', 'makeup', 'make-up', 'лак для ногтей', 'nail polish',
                            'маникюр', 'manicure'];
      return cosmeticTerms.some(t => text.includes(t));
    },
    category: SUBCATEGORIES.cosmetics
  },

  {
    priority: 3,
    name: 'Средства гигиены',
    check: (text) => {
      const hygieneTerms = ['зубная щетка', 'toothbrush', 'oral-b', 'oral b', 'зубная паста',
                           'toothpaste', 'дезодорант', 'deodorant', 'шампунь', 'shampoo',
                           'гель для душа', 'shower gel', 'мыло жидк', 'liquid soap',
                           'антисептик', 'antiseptic', 'санитайзер', 'sanitizer'];
      // НО: "мыльница" - это хозтовары
      if (text.includes('мыльниц')) return false;
      return hygieneTerms.some(t => text.includes(t));
    },
    category: SUBCATEGORIES.hygiene
  },

  // ============ ЭЛЕКТРОНИКА ============
  {
    priority: 4,
    name: 'Смартфоны и планшеты',
    check: (text) => {
      const phoneTerms = ['смартфон', 'smartphone', 'планшет android', 'планшет ios',
                         'iphone', 'ipad', 'телефон держатель', 'phone holder',
                         'телефон чехол', 'phone case', 'телефон стилус'];
      // Исключаем "телефон" в контексте инструментов
      if (text.includes('кабельный трекер') || text.includes('wire tracer')) return false;
      return phoneTerms.some(t => text.includes(t));
    },
    category: SUBCATEGORIES.smartphones
  },

  {
    priority: 4,
    name: 'Электроника общего назначения',
    check: (text) => {
      const elecTerms = ['ноутбук', 'laptop', 'macbook', 'notebook компьютер',
                        'клавиатура компьютер', 'компьютерная мышь', 'монитор компьютер',
                        'usb hub', 'usb хаб', 'power bank', 'портативное зарядн'];
      // "notebook" только если это про технику
      if (text.includes('notebook') && !text.includes('компьютер') && !text.includes('ноутбук')) {
        return false;
      }
      return elecTerms.some(t => text.includes(t));
    },
    category: SUBCATEGORIES.electronics
  },

  // ============ ДОМ И БЫТ ============
  {
    priority: 5,
    name: 'Мебель',
    check: (text) => {
      const furnitureTerms = ['диван', 'sofa', 'кресло', 'armchair', 'журнальный столик',
                             'coffee table', 'шкаф', 'wardrobe', 'cabinet', 'комод',
                             'dresser', 'стеллаж', 'книжная полка', 'bookshelf',
                             'двуспальная кровать', 'double bed', 'обеденный стол',
                             'dining table', 'офисный стул', 'office chair'];
      return furnitureTerms.some(t => text.includes(t));
    },
    category: SUBCATEGORIES.furniture
  },

  {
    priority: 5,
    name: 'Кухонная техника',
    check: (text) => {
      const kitchenTerms = ['миксер', 'mixer', 'блендер', 'blender', 'мясорубка',
                           'meat grinder', 'тостер', 'toaster', 'кофемашина', 'coffee maker',
                           'микроволновка', 'microwave', 'электрочайник', 'electric kettle',
                           'мультиварка', 'multicooker', 'хлебопечка', 'bread maker'];
      // Исключаем промышленные станки
      if (text.includes('токарн') || text.includes('cnc') || text.includes('чпу')) return false;
      return kitchenTerms.some(t => text.includes(t));
    },
    category: SUBCATEGORIES.kitchen_tech
  },

  {
    priority: 5,
    name: 'Посуда',
    check: (text) => {
      const dishTerms = ['тарелка', 'plate', 'чашка чай', 'чашка кофе', 'кружка для чая',
                        'столовые приборы', 'cutlery', 'ложка столов', 'вилка столов',
                        'нож кухонный', 'кастрюля', 'сковорода', 'frying pan',
                        'керамическая посуда', 'набор посуды'];
      return dishTerms.some(t => text.includes(t));
    },
    category: SUBCATEGORIES.dishes
  },

  {
    priority: 5,
    name: 'Освещение',
    check: (text) => {
      const lightTerms = ['люстра', 'chandelier', 'светильник', 'торшер', 'floor lamp',
                         'настольная лампа', 'desk lamp', 'бра настенн', 'wall lamp',
                         'светодиодная лента', 'led strip', 'уличный фонарь'];
      // Исключаем случаи типа "калибра", "вибра"
      return lightTerms.some(t => text.includes(t));
    },
    category: SUBCATEGORIES.lighting
  },

  {
    priority: 5,
    name: 'Текстиль',
    check: (text) => {
      const textileTerms = ['штора', 'curtain', 'полотенце банное', 'bath towel',
                           'простыня', 'bed sheet', 'наволочка', 'pillowcase',
                           'одеяло', 'blanket', 'покрывало', 'bedspread',
                           'скатерть', 'tablecloth'];
      return textileTerms.some(t => text.includes(t));
    },
    category: SUBCATEGORIES.textile
  },

  {
    priority: 5,
    name: 'Спальня',
    check: (text) => {
      const bedroomTerms = ['матрас', 'mattress', 'подушка для сна', 'sleeping pillow',
                           'sealy', 'ортопедический матрас', 'memory foam'];
      return bedroomTerms.some(t => text.includes(t));
    },
    category: SUBCATEGORIES.bedroom
  },

  {
    priority: 6,
    name: 'Сантехника',
    check: (text) => {
      const plumbingTerms = ['смеситель', 'faucet', 'душевая', 'shower', 'унитаз', 'toilet',
                            'раковина', 'sink', 'водонагреватель', 'water heater',
                            'смешанный клапан', 'mixing valve'];
      // Исключаем "гель для душа" - это гигиена
      if (text.includes('гель для душа') || text.includes('shower gel')) return false;
      return plumbingTerms.some(t => text.includes(t));
    },
    category: SUBCATEGORIES.plumbing
  },

  {
    priority: 5,
    name: 'Умный дом',
    check: (text) => {
      const smartTerms = ['камера видеонаблюден', 'cctv camera', 'видеонаблюдение',
                         'surveillance', 'умный дом', 'smart home', 'wifi розетка',
                         'умная розетка', 'smart socket', 'датчик движения',
                         'motion sensor'];
      return smartTerms.some(t => text.includes(t));
    },
    category: SUBCATEGORIES.smart_home
  },

  // ============ СТРОИТЕЛЬСТВО ============
  {
    priority: 5,
    name: 'Инструменты',
    check: (text) => {
      const toolTerms = ['дрель', 'drill', 'шуруповерт', 'screwdriver', 'перфоратор',
                        'hammer drill', 'болгарка', 'angle grinder', 'гайковерт',
                        'impact wrench', 'лобзик', 'jigsaw', 'шлифмашина', 'sander'];
      // Исключаем станки и промышленное оборудование
      if (text.includes('токарн') || text.includes('фрезерн') || text.includes('cnc')) return false;
      return toolTerms.some(t => text.includes(t));
    },
    category: SUBCATEGORIES.tools
  },

  {
    priority: 5,
    name: 'Электрика',
    check: (text) => {
      const elecTerms = ['розетка электр', 'electrical socket', 'выключатель света',
                        'light switch', 'автоматический выключатель', 'circuit breaker',
                        'кабель электр', 'electrical cable', 'провод электр'];
      return elecTerms.some(t => text.includes(t));
    },
    category: SUBCATEGORIES.electric
  },

  {
    priority: 5,
    name: 'Крепеж и метизы',
    check: (text) => {
      const fastenerTerms = ['винт м', 'screw m', 'болт м', 'bolt m', 'гайка м', 'nut m',
                            'дюбель', 'dowel', 'анкер', 'anchor', 'саморез', 'self-tapping'];
      return fastenerTerms.some(t => text.includes(t));
    },
    category: SUBCATEGORIES.fasteners
  },

  // ============ АВТОТОВАРЫ ============
  {
    priority: 5,
    name: 'Автозапчасти',
    check: (text) => {
      const autoTerms = ['тормозные колодки', 'brake pads', 'воздушный фильтр автомобиль',
                        'air filter car', 'свечи зажигания', 'spark plugs',
                        'стартер автомобиль', 'car starter'];
      return autoTerms.some(t => text.includes(t));
    },
    category: SUBCATEGORIES.auto_parts
  },

  {
    priority: 5,
    name: 'Автохимия',
    check: (text) => {
      const chemTerms = ['автошампунь', 'car shampoo', 'полироль автомобиль', 'car polish',
                        'омыватель стекол', 'windshield washer', 'антифриз автомобиль',
                        'car antifreeze'];
      // Исключаем кремы для рук с антифризом
      if (text.includes('крем') || text.includes('cream')) return false;
      return chemTerms.some(t => text.includes(t));
    },
    category: SUBCATEGORIES.auto_chemistry
  },

  {
    priority: 5,
    name: 'Шины и диски',
    check: (text) => {
      const tireTerms = ['автомобильная шина', 'car tire', 'колесный диск', 'wheel rim',
                        'tpms', 'давление в шинах', 'tire pressure'];
      return tireTerms.some(t => text.includes(t));
    },
    category: SUBCATEGORIES.tires
  },

  // ============ ПРОМЫШЛЕННОСТЬ ============
  {
    priority: 5,
    name: 'Станки и оборудование',
    check: (text) => {
      const machineTerms = ['токарный станок', 'lathe machine', 'фрезерный станок',
                           'milling machine', 'сварочный аппарат', 'welding machine',
                           'cnc станок', 'cnc machine', 'станок чпу', 'grbl',
                           'mig сварк', 'tig сварк', 'инверторный сварочн'];
      return machineTerms.some(t => text.includes(t));
    },
    category: SUBCATEGORIES.machines
  },
];

/**
 * Определить категорию для товара
 */
function categorizeProduct(product) {
  const name = (product.name || '').toLowerCase();
  const description = (product.description || '').toLowerCase();
  const text = `${name} ${description}`;

  for (const rule of CATEGORIZATION_RULES.sort((a, b) => a.priority - b.priority)) {
    if (rule.check(text)) {
      return {
        category: rule.category,
        ruleName: rule.name,
        priority: rule.priority
      };
    }
  }

  return null;
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
  const unchanged = [];

  for (const product of products) {
    const result = categorizeProduct(product);

    if (result && result.category !== product.category_id) {
      changes.push({
        id: product.id,
        name: product.name,
        oldCategory: catMap[product.category_id] || 'NULL',
        newCategory: catMap[result.category] || 'UNKNOWN',
        newCategoryId: result.category,
        ruleName: result.ruleName,
        priority: result.priority
      });
    } else if (result) {
      unchanged.push(product);
    } else {
      noMatch.push(product);
    }
  }

  console.log(`Товаров для переноса: ${changes.length}`);
  console.log(`Товаров уже в правильной категории: ${unchanged.length}`);
  console.log(`Товаров без совпадения (остаются): ${noMatch.length}\n`);

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
      console.log(`  - "${item.name.substring(0, 60)}..." [${item.ruleName}]`);
    });
    if (items.length > 5) console.log(`  ... и ещё ${items.length - 5} товаров`);
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
