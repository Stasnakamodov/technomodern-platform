const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeProducts() {
  console.log('=== ДЕТАЛЬНЫЙ АНАЛИЗ ТОВАРОВ ===\n');

  // Получаем все категории
  const { data: categories } = await supabase
    .from('categories')
    .select('*');

  // Получаем ВСЕ товары
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, description, category_id');

  if (error) {
    console.error('Ошибка:', error);
    return;
  }

  console.log(`Всего товаров: ${products.length}\n`);

  // Анализируем часто встречающиеся слова для каждой подкатегории
  const subcategories = categories.filter(c => c.parent_id !== null);

  // Собираем все уникальные слова из названий
  const wordFrequency = {};
  products.forEach(p => {
    const words = p.name.toLowerCase()
      .replace(/[^a-zа-яё\s]/gi, ' ')
      .split(/\s+/)
      .filter(w => w.length > 3);

    words.forEach(w => {
      wordFrequency[w] = (wordFrequency[w] || 0) + 1;
    });
  });

  // Сортируем по частоте
  const sortedWords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 100);

  console.log('=== ТОП-100 ЧАСТЫХ СЛОВ В НАЗВАНИЯХ ===\n');
  sortedWords.forEach(([word, count], i) => {
    console.log(`${i+1}. "${word}" - ${count} раз`);
  });

  // Находим некорректно распределённые товары
  console.log('\n\n=== ПРИМЕРЫ ПРОБЛЕМНЫХ ТОВАРОВ ===\n');

  // Товары со словом "диван" не в "Мебель"
  const sofas = products.filter(p =>
    p.name.toLowerCase().includes('диван') ||
    p.name.toLowerCase().includes('sofa')
  );
  console.log(`\nТовары с "диван/sofa" (${sofas.length} шт):`);
  sofas.slice(0, 10).forEach(p => {
    const cat = categories.find(c => c.id === p.category_id);
    const catName = cat ? cat.name : 'NULL';
    console.log(`  [${catName}] ${p.name.substring(0, 70)}`);
  });

  // Товары со словом "кабель" в любой категории
  const cables = products.filter(p =>
    p.name.toLowerCase().includes('кабель') ||
    p.name.toLowerCase().includes('cable') ||
    p.name.toLowerCase().includes('usb')
  );
  console.log(`\nТовары с "кабель/cable/usb" (${cables.length} шт):`);
  cables.slice(0, 10).forEach(p => {
    const cat = categories.find(c => c.id === p.category_id);
    const catName = cat ? cat.name : 'NULL';
    console.log(`  [${catName}] ${p.name.substring(0, 70)}`);
  });

  // Товары со словом "ноутбук/laptop"
  const laptops = products.filter(p =>
    p.name.toLowerCase().includes('ноутбук') ||
    p.name.toLowerCase().includes('laptop') ||
    p.name.toLowerCase().includes('notebook')
  );
  console.log(`\nТовары с "ноутбук/laptop" (${laptops.length} шт):`);
  laptops.slice(0, 10).forEach(p => {
    const cat = categories.find(c => c.id === p.category_id);
    const catName = cat ? cat.name : 'NULL';
    console.log(`  [${catName}] ${p.name.substring(0, 70)}`);
  });

  // Товары со словом "телефон/phone/смартфон"
  const phones = products.filter(p =>
    p.name.toLowerCase().includes('телефон') ||
    p.name.toLowerCase().includes('phone') ||
    p.name.toLowerCase().includes('смартфон')
  );
  console.log(`\nТовары с "телефон/phone/смартфон" (${phones.length} шт):`);
  phones.slice(0, 10).forEach(p => {
    const cat = categories.find(c => c.id === p.category_id);
    const catName = cat ? cat.name : 'NULL';
    console.log(`  [${catName}] ${p.name.substring(0, 70)}`);
  });

  // Товары со словом "ткань/текстиль"
  const textiles = products.filter(p =>
    p.name.toLowerCase().includes('ткань') ||
    p.name.toLowerCase().includes('текстиль') ||
    p.name.toLowerCase().includes('fabric') ||
    p.name.toLowerCase().includes('textile')
  );
  console.log(`\nТовары с "ткань/текстиль" (${textiles.length} шт):`);
  textiles.slice(0, 10).forEach(p => {
    const cat = categories.find(c => c.id === p.category_id);
    const catName = cat ? cat.name : 'NULL';
    console.log(`  [${catName}] ${p.name.substring(0, 70)}`);
  });

  // Товары со словом "инструмент/tool"
  const tools = products.filter(p =>
    p.name.toLowerCase().includes('инструмент') ||
    p.name.toLowerCase().includes('tool') ||
    p.name.toLowerCase().includes('дрель') ||
    p.name.toLowerCase().includes('drill')
  );
  console.log(`\nТовары с "инструмент/tool/дрель" (${tools.length} шт):`);
  tools.slice(0, 10).forEach(p => {
    const cat = categories.find(c => c.id === p.category_id);
    const catName = cat ? cat.name : 'NULL';
    console.log(`  [${catName}] ${p.name.substring(0, 70)}`);
  });

  // Товары со словом "книга/book"
  const books = products.filter(p =>
    p.name.toLowerCase().includes('книга') ||
    p.name.toLowerCase().includes('book') ||
    p.name.toLowerCase().includes('издание') ||
    p.name.toLowerCase().includes('edition')
  );
  console.log(`\nТовары с "книга/book/издание" (${books.length} шт):`);
  books.slice(0, 10).forEach(p => {
    const cat = categories.find(c => c.id === p.category_id);
    const catName = cat ? cat.name : 'NULL';
    console.log(`  [${catName}] ${p.name.substring(0, 70)}`);
  });

  // Анализируем текущее распределение по подкатегориям
  console.log('\n\n=== РАСПРЕДЕЛЕНИЕ ПО ПОДКАТЕГОРИЯМ ===\n');

  for (const sub of subcategories) {
    const prods = products.filter(p => p.category_id === sub.id);
    if (prods.length > 0) {
      console.log(`\n${sub.name} (${prods.length} товаров):`);
      // Выводим 5 случайных товаров
      const sample = prods.sort(() => Math.random() - 0.5).slice(0, 5);
      sample.forEach(p => {
        console.log(`  - ${p.name.substring(0, 80)}`);
      });
    }
  }
}

analyzeProducts().catch(console.error);
