import { createClient } from '@supabase/supabase-js';

const url = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek';

async function fixGamingChair() {
  const supabase = createClient(url, serviceKey);

  console.log('🎮 ИСПРАВЛЯЮ GAMING КРЕСЛО (позиция 33)...\n');

  // Релевантное изображение офисного gaming кресла
  const newImage = 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&h=800&fit=crop&q=80';

  console.log('[Позиция 33] Офисное кресло Gaming Массаж');
  console.log(`   Старое: https://images.unsplash.com/photo-1760689038007-15d30c636eee...`);
  console.log(`   Новое: ${newImage}`);

  const { error } = await supabase
    .from('products')
    .update({ images: [newImage] })
    .eq('id', '0000049f-0000-0000-0000-0000049f0000');

  if (!error) {
    console.log(`\n   ✅ ИЗОБРАЖЕНИЕ ОБНОВЛЕНО на релевантное офисное gaming кресло`);
  } else {
    console.log(`   ❌ Ошибка: ${error.message}`);
  }
}

fixGamingChair().catch(console.error);
