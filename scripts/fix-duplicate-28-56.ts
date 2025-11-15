import { createClient } from '@supabase/supabase-js';

const url = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek';

async function fixDuplicate() {
  const supabase = createClient(url, serviceKey);

  console.log('🛋️  ИСПРАВЛЯЮ ДУБЛИКАТ (позиции 28 и 56)...\n');

  // Позиция 28 - Диван Modern 2-местный
  const newImage28 = 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=800&fit=crop&q=80';

  console.log('[Позиция 28] Диван Modern 2-местный');
  console.log(`   🖼️  ${newImage28}`);

  const { error } = await supabase
    .from('products')
    .update({ images: [newImage28] })
    .eq('id', '000004a8-0000-0000-0000-000004a80000');

  if (!error) {
    console.log(`   ✅ ОБНОВЛЕНО\n`);
  } else {
    console.log(`   ❌ Ошибка: ${error.message}\n`);
  }

  console.log('✅ Дубликат устранен!');
}

fixDuplicate().catch(console.error);
