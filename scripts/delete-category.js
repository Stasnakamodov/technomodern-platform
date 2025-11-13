const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://rbngpxwamfkunktxjtqh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek'
);

(async () => {
  const categoryName = process.argv[2] || 'Автотовары';

  console.log(`🗑️  Удаление категории: ${categoryName}\n`);

  // Получаем ID категории
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .eq('name', categoryName);

  if (!categories || categories.length === 0) {
    console.log('❌ Категория не найдена');
    return;
  }

  const categoryId = categories[0].id;
  console.log(`📁 Найдена категория: ${categoryName} (ID: ${categoryId})`);

  // Считаем товары
  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', categoryId);

  console.log(`📦 Товаров в категории: ${count}`);

  // Удаляем все товары из этой категории
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('category_id', categoryId);

  if (error) {
    console.log('❌ Ошибка удаления товаров:', error.message);
    return;
  }

  console.log('✅ Товары удалены');

  // Удаляем саму категорию
  const { error: catError } = await supabase
    .from('categories')
    .delete()
    .eq('id', categoryId);

  if (catError) {
    console.log('❌ Ошибка удаления категории:', catError.message);
  } else {
    console.log('✅ Категория удалена');
  }

  console.log('\n🎉 Готово!');
})();
