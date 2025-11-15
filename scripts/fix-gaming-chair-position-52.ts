import { createClient } from '@supabase/supabase-js';

const url = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek';

async function fixGamingChair52() {
  const supabase = createClient(url, serviceKey);

  console.log('🎮 ИСПРАВЛЯЮ GAMING КРЕСЛО (позиция 52)...\n');

  // Релевантное изображение офисного gaming кресла
  const newImage = 'https://images.unsplash.com/photo-1598550487031-0493fc2e3ec1?w=800&h=800&fit=crop&q=80';

  console.log('[Позиция 52] Офисное кресло Gaming Массаж');
  console.log(`   Старое: https://images.unsplash.com/photo-1633406389921-9b03b77d72bc... (клавиатура)`);
  console.log(`   Новое: ${newImage}`);

  const { error } = await supabase
    .from('products')
    .update({ images: [newImage] })
    .eq('id', '000004a5-0000-0000-0000-000004a50000');

  if (!error) {
    console.log(`\n   ✅ ИЗОБРАЖЕНИЕ ОБНОВЛЕНО на релевантное офисное gaming кресло`);
  } else {
    console.log(`   ❌ Ошибка: ${error.message}`);
  }
}

fixGamingChair52().catch(console.error);
