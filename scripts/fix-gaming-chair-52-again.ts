import { createClient } from '@supabase/supabase-js';

const url = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek';

async function fixGamingChair52Again() {
  const supabase = createClient(url, serviceKey);

  console.log('🎮 ПОВТОРНО ИСПРАВЛЯЮ GAMING КРЕСЛО (позиция 52)...\n');

  // Сначала проверим текущее изображение
  const { data: currentProduct } = await supabase
    .from('products')
    .select('name, images')
    .eq('id', '000004a5-0000-0000-0000-000004a50000')
    .single();

  console.log('Текущее состояние:');
  console.log(`   Название: ${currentProduct?.name}`);
  console.log(`   Текущее изображение: ${currentProduct?.images?.[0]}\n`);

  // Попробуем другое изображение gaming кресла
  const newImage = 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&h=800&fit=crop&q=80';

  console.log(`   Новое изображение: ${newImage}`);

  const { error } = await supabase
    .from('products')
    .update({ images: [newImage] })
    .eq('id', '000004a5-0000-0000-0000-000004a50000');

  if (!error) {
    console.log(`\n   ✅ ИЗОБРАЖЕНИЕ ОБНОВЛЕНО`);

    // Проверим что обновилось
    const { data: updatedProduct } = await supabase
      .from('products')
      .select('images')
      .eq('id', '000004a5-0000-0000-0000-000004a50000')
      .single();

    console.log(`\n   Проверка: ${updatedProduct?.images?.[0]}`);
  } else {
    console.log(`   ❌ Ошибка: ${error.message}`);
  }
}

fixGamingChair52Again().catch(console.error);
