const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeData() {
  console.log('=== АНАЛИЗ СТРУКТУРЫ ДАННЫХ ===\n');

  // 1. Получаем все категории
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('*')
    .order('level', { ascending: true })
    .order('name', { ascending: true });

  if (catError) {
    console.error('Ошибка загрузки категорий:', catError);
    return;
  }

  console.log(`Всего категорий: ${categories.length}`);

  const rootCategories = categories.filter(c => c.parent_id === null);
  const subcategories = categories.filter(c => c.parent_id !== null);

  console.log(`ROOT категорий: ${rootCategories.length}`);
  console.log(`Подкатегорий: ${subcategories.length}\n`);

  console.log('=== ROOT КАТЕГОРИИ ===');
  for (const cat of rootCategories) {
    const subs = subcategories.filter(s => s.parent_id === cat.id);
    console.log(`\n📁 ${cat.name} (id: ${cat.id})`);
    console.log(`   product_count: ${cat.product_count}`);
    console.log(`   Подкатегории (${subs.length}):`);
    for (const sub of subs) {
      console.log(`     - ${sub.name} (id: ${sub.id}, products: ${sub.product_count})`);
    }
  }

  // 2. Получаем реальное распределение товаров по категориям
  console.log('\n\n=== РЕАЛЬНОЕ РАСПРЕДЕЛЕНИЕ ТОВАРОВ ===\n');

  const { data: products, error: prodError } = await supabase
    .from('products')
    .select('id, name, category_id');

  if (prodError) {
    console.error('Ошибка загрузки товаров:', prodError);
    return;
  }

  console.log(`Всего товаров: ${products.length}\n`);

  // Группируем товары по category_id
  const productsByCat = {};
  for (const p of products) {
    const catId = p.category_id || 'NULL';
    if (!productsByCat[catId]) {
      productsByCat[catId] = [];
    }
    productsByCat[catId].push(p);
  }

  // Выводим товары на ROOT категориях
  console.log('=== ТОВАРЫ НА ROOT КАТЕГОРИЯХ (ПРОБЛЕМА!) ===');
  for (const rootCat of rootCategories) {
    const prods = productsByCat[rootCat.id] || [];
    if (prods.length > 0) {
      console.log(`\n⚠️  ${rootCat.name}: ${prods.length} товаров (должно быть 0)`);
      console.log('   Примеры товаров:');
      prods.slice(0, 5).forEach(p => {
        console.log(`     - ${p.name}`);
      });
    }
  }

  // Выводим товары с NULL category_id
  const nullProducts = productsByCat['NULL'] || [];
  if (nullProducts.length > 0) {
    console.log(`\n⚠️  NULL category_id: ${nullProducts.length} товаров`);
    console.log('   Примеры товаров:');
    nullProducts.slice(0, 5).forEach(p => {
      console.log(`     - ${p.name}`);
    });
  }

  // Выводим товары на подкатегориях
  console.log('\n\n=== ТОВАРЫ НА ПОДКАТЕГОРИЯХ (ПРАВИЛЬНО) ===');
  for (const rootCat of rootCategories) {
    const subs = subcategories.filter(s => s.parent_id === rootCat.id);
    let totalInSubs = 0;
    console.log(`\n📁 ${rootCat.name}:`);
    for (const sub of subs) {
      const prods = productsByCat[sub.id] || [];
      totalInSubs += prods.length;
      if (prods.length > 0) {
        console.log(`   - ${sub.name}: ${prods.length} товаров`);
        // Показываем примеры товаров для проверки соответствия
        prods.slice(0, 3).forEach(p => {
          console.log(`       "${p.name.substring(0, 60)}..."`);
        });
      }
    }
    console.log(`   ИТОГО в подкатегориях: ${totalInSubs}`);
  }

  // 3. Выводим примеры названий товаров для анализа ключевых слов
  console.log('\n\n=== ВЫБОРКА НАЗВАНИЙ ТОВАРОВ ДЛЯ АНАЛИЗА ===\n');
  const sampleProducts = products.slice(0, 100);
  sampleProducts.forEach((p, i) => {
    const cat = categories.find(c => c.id === p.category_id);
    const catName = cat ? cat.name : 'NULL';
    console.log(`${i+1}. [${catName}] ${p.name}`);
  });
}

analyzeData().catch(console.error);
