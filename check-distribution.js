const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://rbngpxwamfkunktxjtqh.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI');

async function check() {
  // Все категории
  const { data: cats } = await supabase.from('categories').select('*').order('name');

  const rootCats = cats.filter(c => c.parent_id === null);
  const subCats = cats.filter(c => c.parent_id !== null);

  console.log('=== СТРУКТУРА КАТЕГОРИЙ ===');
  console.log('ROOT категорий:', rootCats.length);
  console.log('Подкатегорий:', subCats.length);

  // Проверяем каждую ROOT и её подкатегории
  console.log('\n=== ПРОВЕРКА ТОВАРОВ ПО КАТЕГОРИЯМ ===\n');

  for (const root of rootCats) {
    const subs = subCats.filter(s => s.parent_id === root.id);

    // Товары напрямую на ROOT (ЭТО ПРОБЛЕМА!)
    const { count: rootCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', root.id);

    let totalInSubs = 0;
    const subInfo = [];
    for (const sub of subs) {
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', sub.id);
      totalInSubs += count || 0;
      if (count > 0) {
        subInfo.push({ name: sub.name, count });
      }
    }

    console.log('📁 ' + root.name + ':');
    if (rootCount > 0) {
      console.log('   ⚠️  ПРОБЛЕМА: ' + rootCount + ' товаров НА ROOT (должно быть 0)');
    }
    console.log('   Подкатегории (' + subs.length + '):');
    subInfo.forEach(s => console.log('      - ' + s.name + ': ' + s.count + ' товаров'));
    console.log('   ИТОГО в подкатегориях: ' + totalInSubs);
    console.log('');
  }

  // Товары с NULL category_id
  const { count: nullCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .is('category_id', null);

  if (nullCount > 0) {
    console.log('⚠️  ПРОБЛЕМА: ' + nullCount + ' товаров с NULL category_id');
  }

  // Общее количество товаров
  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  console.log('\n=== ИТОГО ===');
  console.log('Всего товаров в БД:', totalProducts);
}

check().catch(console.error);
