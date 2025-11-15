import { createClient } from '@supabase/supabase-js';

const url = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek';

async function forceUpdate() {
  const supabase = createClient(url, serviceKey);

  console.log('💪 ПРИНУДИТЕЛЬНАЯ ЗАМЕНА ИЗОБРАЖЕНИЯ (позиция 52)...\n');

  // Используем СОВЕРШЕННО другое изображение gaming кресла
  const newImage = 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=800&fit=crop&q=80';

  console.log('[Позиция 52] Офисное кресло Gaming Массаж');
  console.log(`   Новое изображение (executive chair): ${newImage}`);

  const { error } = await supabase
    .from('products')
    .update({ images: [newImage] })
    .eq('id', '000004a5-0000-0000-0000-000004a50000');

  if (!error) {
    console.log(`\n   ✅ ОБНОВЛЕНО! Теперь обновите страницу с Ctrl+Shift+R`);
  } else {
    console.log(`   ❌ Ошибка: ${error.message}`);
  }
}

forceUpdate().catch(console.error);
