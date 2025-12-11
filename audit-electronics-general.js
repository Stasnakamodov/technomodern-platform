const fs = require('fs');

// Загружаем данные
const products = JSON.parse(fs.readFileSync('/Users/user/Downloads/code/electronics_general_audit.json', 'utf8'));

console.log(`Всего товаров для анализа: ${products.length}\n`);

// Категории для анализа
const toMove = []; // Переместить в "Компьютерные аксессуары"
const toDelete = []; // Удалить
const toKeep = []; // Оставить в "Электроника общего назначения"

// Ключевые слова для определения категории
const computerAccessoriesKeywords = [
  'коврик', 'pad', 'mouse pad', 'подставк', 'stand', 'кронштейн', 'bracket', 'держател', 'holder',
  'крепление', 'mount', 'стойка', 'rack', 'органайзер', 'organizer', 'чехол', 'case', 'сумка', 'bag',
  'стол', 'table', 'desk'
];

const deleteKeywords = [
  'rc ', 'радиоуправляем', 'машинк', 'автомобил', 'car ', 'одежд', 'бельё', 'белье', 'косметик',
  'шампунь', 'крем', 'духи', 'парфюм', 'игрушк', 'toy', 'vehicle', 'модел', 'model car'
];

const electronicsKeywords = [
  'зарядка', 'зарядн', 'charger', 'кабель', 'cable', 'адаптер', 'adapter', 'батаре', 'battery',
  'аккумулятор', 'наушник', 'headphone', 'earphone', 'колонк', 'speaker', 'микрофон', 'microphone',
  'видеокарт', 'gpu', 'плат', 'board', 'модуль', 'module', 'память', 'memory', 'мышь', 'mouse',
  'клавиатур', 'keyboard', 'usb', 'hdmi', 'провод', 'wire', 'переходник', 'конвертер', 'converter',
  'блок питания', 'power supply', 'хаб', 'hub', 'разъем', 'connector', 'вентилятор', 'fan',
  'охлаждение', 'cooling', 'радиатор', 'heatsink', 'термопаст', 'thermal paste'
];

function analyzeProduct(product) {
  const name = (product.name || '').toLowerCase();
  const description = (product.description || '').toLowerCase();
  const text = name + ' ' + description;

  // Проверка на удаление
  for (const keyword of deleteKeywords) {
    if (text.includes(keyword)) {
      return {
        action: 'delete',
        reason: `Нерелевантный товар (содержит: "${keyword}")`
      };
    }
  }

  // Проверка на перемещение в Компьютерные аксессуары
  for (const keyword of computerAccessoriesKeywords) {
    if (text.includes(keyword)) {
      // Исключения: если это электронное устройство с подставкой/креплением
      const isElectronic = electronicsKeywords.some(ek => text.includes(ek));

      // Специальная логика для подставок
      if (keyword.includes('подставк') || keyword === 'stand') {
        // Подставка для ноутбука - переместить
        if (text.includes('ноутбук') || text.includes('laptop')) {
          return {
            action: 'move',
            reason: 'Подставка для ноутбука - аксессуар, не электроника'
          };
        }
        // Подставка для монитора/экрана - переместить
        if (text.includes('монитор') || text.includes('monitor') || text.includes('экран')) {
          return {
            action: 'move',
            reason: 'Подставка для монитора - аксессуар, не электроника'
          };
        }
        // Зарядная станция/подставка с зарядкой - оставить
        if (text.includes('зарядн') || text.includes('charger') || text.includes('charging')) {
          return {
            action: 'keep',
            reason: 'Зарядная станция/подставка - электронное устройство'
          };
        }
      }

      // Коврик для мыши - всегда переместить
      if (keyword.includes('коврик') || keyword === 'pad' || keyword === 'mouse pad') {
        return {
          action: 'move',
          reason: 'Коврик для мыши - аксессуар, не электроника'
        };
      }

      // Кронштейны, держатели, крепления - переместить
      if (keyword.includes('кронштейн') || keyword === 'bracket' ||
          keyword.includes('держател') || keyword === 'holder' ||
          keyword.includes('крепление') || keyword === 'mount') {
        // Исключение: держатель для телефона с зарядкой
        if (text.includes('зарядн') || text.includes('charger')) {
          return {
            action: 'keep',
            reason: 'Держатель с зарядкой - электронное устройство'
          };
        }
        return {
          action: 'move',
          reason: 'Кронштейн/держатель/крепление - аксессуар, не электроника'
        };
      }

      // Столы, стойки - переместить
      if (keyword.includes('стол') || keyword === 'desk' || keyword === 'table' ||
          keyword.includes('стойка') || keyword === 'rack') {
        return {
          action: 'move',
          reason: 'Мебель - не электроника'
        };
      }

      // Чехлы, сумки, органайзеры - переместить
      if (keyword.includes('чехол') || keyword === 'case' ||
          keyword.includes('сумка') || keyword === 'bag' ||
          keyword.includes('органайзер') || keyword === 'organizer') {
        return {
          action: 'move',
          reason: 'Аксессуар для хранения - не электроника'
        };
      }
    }
  }

  // Проверка на релевантность (электроника)
  for (const keyword of electronicsKeywords) {
    if (text.includes(keyword)) {
      return {
        action: 'keep',
        reason: `Электронное устройство (${keyword})`
      };
    }
  }

  // Если не попало ни в одну категорию - требует ручной проверки
  return {
    action: 'manual',
    reason: 'Требует ручной проверки'
  };
}

// Анализируем каждый товар
const manualCheck = [];

products.forEach(product => {
  const analysis = analyzeProduct(product);

  switch (analysis.action) {
    case 'move':
      toMove.push({ ...product, reason: analysis.reason });
      break;
    case 'delete':
      toDelete.push({ ...product, reason: analysis.reason });
      break;
    case 'keep':
      toKeep.push({ ...product, reason: analysis.reason });
      break;
    case 'manual':
      manualCheck.push({ ...product, reason: analysis.reason });
      break;
  }
});

// Вывод результатов
console.log('=== СТАТИСТИКА ===');
console.log(`Всего товаров: ${products.length}`);
console.log(`Оставить в категории: ${toKeep.length}`);
console.log(`Переместить в "Компьютерные аксессуары": ${toMove.length}`);
console.log(`Удалить: ${toDelete.length}`);
console.log(`Требует ручной проверки: ${manualCheck.length}`);
console.log('');

// Сохраняем результаты
const results = {
  statistics: {
    total: products.length,
    keep: toKeep.length,
    move: toMove.length,
    delete: toDelete.length,
    manual: manualCheck.length
  },
  toMove: toMove.map(p => ({
    id: p.id,
    name: p.name,
    reason: p.reason
  })),
  toDelete: toDelete.map(p => ({
    id: p.id,
    name: p.name,
    reason: p.reason
  })),
  toKeep: toKeep.map(p => ({
    id: p.id,
    name: p.name,
    reason: p.reason
  })),
  manualCheck: manualCheck.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description ? p.description.substring(0, 200) : '',
    reason: p.reason
  }))
};

fs.writeFileSync('/Users/user/Downloads/code/electronics_general_audit_results.json', JSON.stringify(results, null, 2));

console.log('=== ТОВАРЫ ДЛЯ ПЕРЕМЕЩЕНИЯ ===');
toMove.forEach((p, i) => {
  console.log(`${i + 1}. ${p.name}`);
  console.log(`   ID: ${p.id}`);
  console.log(`   Причина: ${p.reason}`);
  console.log('');
});

console.log('\n=== ТОВАРЫ ДЛЯ УДАЛЕНИЯ ===');
toDelete.forEach((p, i) => {
  console.log(`${i + 1}. ${p.name}`);
  console.log(`   ID: ${p.id}`);
  console.log(`   Причина: ${p.reason}`);
  console.log('');
});

console.log('\n=== ТОВАРЫ ДЛЯ РУЧНОЙ ПРОВЕРКИ ===');
manualCheck.slice(0, 20).forEach((p, i) => {
  console.log(`${i + 1}. ${p.name}`);
  console.log(`   ID: ${p.id}`);
  console.log(`   Описание: ${p.description ? p.description.substring(0, 100) : 'Нет описания'}`);
  console.log('');
});

console.log(`\nРезультаты сохранены в: /Users/user/Downloads/code/electronics_general_audit_results.json`);
