import { createClient } from '@supabase/supabase-js';

const url = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek';

async function fix7Images() {
  const supabase = createClient(url, serviceKey);

  console.log('🛋️  ЗАМЕНА 7 ИЗОБРАЖЕНИЙ ВРУЧНУЮ...\n');

  // Вручную подобранные релевантные изображения с Unsplash
  const fixes = [
    {
      id: '000004bb-0000-0000-0000-000004bb0000',
      position: 5,
      name: 'Диван Classic 3-местный',
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop&q=80'
    },
    {
      id: '000004af-0000-0000-0000-000004af0000',
      position: 19,
      name: 'Диван Classic 2-местный',
      url: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&h=800&fit=crop&q=80'
    },
    {
      id: '000004a8-0000-0000-0000-000004a80000',
      position: 28,
      name: 'Диван Modern 2-местный',
      url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop&q=80'
    },
    {
      id: '00000498-0000-0000-0000-000004980000',
      position: 34,
      name: 'Офисное кресло Gaming Эргономичное',
      url: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&h=800&fit=crop&q=80'
    },
    {
      id: '0000048f-0000-0000-0000-0000048f0000',
      position: 46,
      name: 'Офисное кресло Ergo Регулируемое',
      url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&h=800&fit=crop&q=80'
    },
    {
      id: '00000482-0000-0000-0000-000004820000',
      position: 55,
      name: 'Диван Comfort Прямой',
      url: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&h=800&fit=crop&q=80'
    },
    {
      id: '00000489-0000-0000-0000-000004890000',
      position: 56,
      name: 'Диван Modern 3-местный',
      url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop&q=80'
    }
  ];

  let updated = 0;

  for (const fix of fixes) {
    console.log(`[Позиция ${fix.position}] ${fix.name}`);
    console.log(`   🖼️  ${fix.url}`);

    const { error } = await supabase
      .from('products')
      .update({ images: [fix.url] })
      .eq('id', fix.id);

    if (!error) {
      console.log(`   ✅ ОБНОВЛЕНО\n`);
      updated++;
    } else {
      console.log(`   ❌ Ошибка: ${error.message}\n`);
    }
  }

  console.log(`\n✅ Обновлено ${updated} из ${fixes.length} изображений`);
}

fix7Images().catch(console.error);
