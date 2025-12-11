const fs = require('fs');

const SUPABASE_URL = "https://rbngpxwamfkunktxjtqh.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI";

// Категории
const CATEGORIES = {
  AUTO_ROOT: 'e18eb782-6fca-414a-b221-dadc694461b1',
  AUTO_PARTS: 'b045d61a-56a4-4c75-9e11-a2d600df97f1',
  AUTO_CHEMISTRY: '1f2645f7-6bc1-4df1-97df-959c3f23cacb',
  TIRES: '6b178b91-cb95-4ec2-b76b-dab5861bf250',
  TOOLS: '761a23b9-9a65-49ec-922d-8db58b9fcce9',
  HOUSEHOLD: '4e53a812-6edb-482f-8ea1-b9150215c169',
  ELECTRONICS: '52b329e8-5fbf-4e77-83a2-62d55e5671d6'
};

// Загружаем товары
const products = JSON.parse(fs.readFileSync('/tmp/auto_products.json', 'utf8'));

console.log(`\nВсего товаров в категориях Автотовары: ${products.length}\n`);

// Группируем по категориям
const byCategory = {};
products.forEach(p => {
  if (!byCategory[p.category_id]) byCategory[p.category_id] = [];
  byCategory[p.category_id].push(p);
});

console.log('Распределение по категориям:');
console.log(`- Автотовары (root): ${byCategory[CATEGORIES.AUTO_ROOT]?.length || 0}`);
console.log(`- Автозапчасти: ${byCategory[CATEGORIES.AUTO_PARTS]?.length || 0}`);
console.log(`- Автохимия: ${byCategory[CATEGORIES.AUTO_CHEMISTRY]?.length || 0}`);
console.log(`- Шины и диски: ${byCategory[CATEGORIES.TIRES]?.length || 0}\n`);

// Классификатор
function classifyProduct(name) {
  const lower = name.toLowerCase();

  // Инструменты
  if (
    lower.includes('ключ') ||
    lower.includes('баллонный') ||
    lower.includes('домкрат') ||
    lower.includes('толщиномер') ||
    lower.includes('рефрактометр') ||
    lower.includes('инструмент') ||
    lower.includes('измерител') ||
    lower.includes('тестер') ||
    lower.includes('мультиметр') ||
    lower.includes('машинка') && lower.includes('полировальн') ||
    lower.includes('компрессор') ||
    lower.includes('насос') && !lower.includes('омыва') ||
    lower.includes('джамп-стартер') ||
    lower.includes('пусковое устройство')
  ) {
    return { category: CATEGORIES.TOOLS, reason: 'Инструмент' };
  }

  // Электроника
  if (
    lower.includes('пылесос') ||
    lower.includes('видеорегистратор') ||
    lower.includes('очиститель воздуха') ||
    lower.includes('мойка') && (lower.includes('высокого давления') || lower.includes('беспроводн')) ||
    lower.includes('автодуш')
  ) {
    return { category: CATEGORIES.ELECTRONICS, reason: 'Электроника' };
  }

  // Хозяйственные товары / аксессуары
  if (
    lower.includes('щётка') && !lower.includes('для детейлинга') ||
    lower.includes('водосгон') ||
    lower.includes('губка') ||
    lower.includes('салфетка') ||
    lower.includes('ведро') ||
    lower.includes('вешалка') ||
    lower.includes('органайзер') ||
    lower.includes('держатель') ||
    lower.includes('накидка') ||
    lower.includes('оплётка') ||
    lower.includes('липкий валик') ||
    lower.includes('коврик')
  ) {
    return { category: CATEGORIES.HOUSEHOLD, reason: 'Аксессуары/хозтовары' };
  }

  // НЕ автозапчасти (хотя находятся в этой категории)
  if (
    lower.includes('велосипед') ||
    lower.includes('двигател') && lower.includes('стирлинга') ||
    lower.includes('мотоцикл') && !lower.includes('датчик') ||
    lower.includes('квадроцикл')
  ) {
    return { category: CATEGORIES.HOUSEHOLD, reason: 'Не автотовар' };
  }

  // Автохимия (правильные)
  if (
    lower.includes('масло') ||
    lower.includes('антифриз') ||
    lower.includes('очистител') && !lower.includes('воздуха') ||
    lower.includes('автошампунь') ||
    lower.includes('шампунь') ||
    lower.includes('полироль') ||
    lower.includes('герметик') ||
    lower.includes('воск') && !lower.includes('губка') ||
    lower.includes('керамическое покрытие') ||
    lower.includes('жидкое стекло') ||
    lower.includes('нанокерамическ') ||
    lower.includes('гидрофобн') ||
    lower.includes('защитное покрытие') && !lower.includes('плёнка') ||
    lower.includes('краска') ||
    lower.includes('эмаль') ||
    lower.includes('паста') && lower.includes('полир')
  ) {
    return { category: CATEGORIES.AUTO_CHEMISTRY, reason: 'Автохимия' };
  }

  // Шины и диски
  if (
    lower.includes('шин') && !lower.includes('датчик') && !lower.includes('инструмент') ||
    lower.includes('диск') && !lower.includes('тормоз')
  ) {
    return { category: CATEGORIES.TIRES, reason: 'Шины и диски' };
  }

  // Настоящие автозапчасти
  if (
    lower.includes('фильтр') ||
    lower.includes('свеч') && lower.includes('зажиг') ||
    lower.includes('тормоз') ||
    lower.includes('ремень') ||
    lower.includes('подшипник') ||
    lower.includes('прокладка') ||
    lower.includes('датчик') ||
    lower.includes('лампа') || lower.includes('лампочк') ||
    lower.includes('амортизатор') && !lower.includes('велосипед') ||
    lower.includes('рулевая') ||
    lower.includes('замок') && lower.includes('двер') ||
    lower.includes('блок управления') ||
    lower.includes('переключатель') && lower.includes('стеклоподъём') ||
    lower.includes('насос омывателя') ||
    lower.includes('подогреватель') && (lower.includes('картер') || lower.includes('поддон')) ||
    lower.includes('проставк') && lower.includes('колес') ||
    lower.includes('адаптер') && lower.includes('рулев') ||
    lower.includes('линза') && lower.includes('фар') ||
    lower.includes('крышка') && (lower.includes('маслозалив') || lower.includes('горловин')) ||
    lower.includes('колпачок ступиц') ||
    lower.includes('маслоохладитель') ||
    lower.includes('радиатор') && lower.includes('масл') ||
    lower.includes('плёнка') && (lower.includes('защитн') || lower.includes('винилов')) ||
    lower.includes('катушка зажигания')
  ) {
    return { category: CATEGORIES.AUTO_PARTS, reason: 'Автозапчасть' };
  }

  // По умолчанию оставляем в автозапчастях
  return { category: CATEGORIES.AUTO_PARTS, reason: 'Оставить как есть' };
}

// Анализ и подготовка исправлений
const moves = [];
const duplicates = [];
const nameMap = new Map();

products.forEach(product => {
  const name = product.name.trim();

  // Поиск дубликатов
  if (nameMap.has(name)) {
    duplicates.push({ original: nameMap.get(name), duplicate: product });
  } else {
    nameMap.set(name, product);
  }

  // Классификация
  const classification = classifyProduct(name);

  if (classification.category !== product.category_id) {
    moves.push({
      id: product.id,
      name: product.name,
      from: product.category_id,
      to: classification.category,
      reason: classification.reason
    });
  }
});

console.log('\n=== НАЙДЕНО ПРОБЛЕМ ===\n');
console.log(`Товаров для переноса: ${moves.length}`);
console.log(`Дубликатов для удаления: ${duplicates.length}\n`);

// Группируем переносы по целевым категориям
const movesByTarget = {};
moves.forEach(m => {
  if (!movesByTarget[m.to]) movesByTarget[m.to] = [];
  movesByTarget[m.to].push(m);
});

console.log('=== ПЛАН ПЕРЕНОСОВ ===\n');
Object.keys(movesByTarget).forEach(targetId => {
  const categoryName = Object.keys(CATEGORIES).find(k => CATEGORIES[k] === targetId);
  console.log(`\n→ ${categoryName} (${movesByTarget[targetId].length} товаров):`);
  movesByTarget[targetId].slice(0, 5).forEach(m => {
    console.log(`  - ${m.name} (${m.reason})`);
  });
  if (movesByTarget[targetId].length > 5) {
    console.log(`  ... и ещё ${movesByTarget[targetId].length - 5} товаров`);
  }
});

console.log('\n\n=== ДУБЛИКАТЫ ===\n');
duplicates.forEach(d => {
  console.log(`- "${d.original.name}"`);
  console.log(`  Оригинал: ${d.original.id}`);
  console.log(`  Дубликат: ${d.duplicate.id}\n`);
});

// Сохраняем данные для исполнения
fs.writeFileSync('/tmp/auto_moves.json', JSON.stringify(moves, null, 2));
fs.writeFileSync('/tmp/auto_duplicates.json', JSON.stringify(duplicates, null, 2));

console.log('\n=== ГОТОВО ===');
console.log('Данные сохранены в /tmp/auto_moves.json и /tmp/auto_duplicates.json');
