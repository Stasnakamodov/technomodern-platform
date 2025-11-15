import { createClient } from '@supabase/supabase-js';

const url = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek';
const unsplashKey = 'hqFoDoRVmIBT9YnswQsPEyfwwC2MBMggezWakuIfz3M';

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const usedImageIds = new Set<string>();

async function getRelevantImage(query: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=30&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${unsplashKey}`
        }
      }
    );

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      for (const image of data.results) {
        if (!usedImageIds.has(image.id)) {
          usedImageIds.add(image.id);
          return image.urls.regular;
        }
      }
      return data.results[0].urls.regular;
    }
  } catch (error) {
    console.error(`Ошибка поиска:`, error);
  }

  return null;
}

async function fixMebelCorrections() {
  const supabase = createClient(url, serviceKey);

  console.log('🛋️  ИСПРАВЛЯЮ КАТЕГОРИЮ МЕБЕЛЬ...\n');

  // ===== ЧАСТЬ 1: ЗАМЕНА ИЗОБРАЖЕНИЙ =====
  console.log('ЧАСТЬ 1: ЗАМЕНА 7 НЕРЕЛЕВАНТНЫХ ИЗОБРАЖЕНИЙ\n');
  console.log('='.repeat(80));

  const imageFixes = [
    { id: '000004bb-0000-0000-0000-000004bb0000', position: 5, query: 'classic three seat sofa beige fabric white background' },
    { id: '000004af-0000-0000-0000-000004af0000', position: 19, query: 'classic two seat loveseat beige fabric white background' },
    { id: '000004a8-0000-0000-0000-000004a80000', position: 28, query: 'modern two seat loveseat grey minimalist white background' },
    { id: '00000498-0000-0000-0000-000004980000', position: 34, query: 'gaming chair ergonomic racing seat black red white background' },
    { id: '0000048f-0000-0000-0000-0000048f0000', position: 46, query: 'ergonomic office chair adjustable lumbar support white background' },
    { id: '00000482-0000-0000-0000-000004820000', position: 55, query: 'comfortable straight sofa fabric neutral white background' },
    { id: '00000489-0000-0000-0000-000004890000', position: 56, query: 'modern three seat sofa grey contemporary white background' }
  ];

  for (const fix of imageFixes) {
    console.log(`\n[Позиция ${fix.position}]`);
    console.log(`   🔍 Запрос: "${fix.query}"`);

    const newImageUrl = await getRelevantImage(fix.query);

    if (newImageUrl) {
      const { error } = await supabase
        .from('products')
        .update({ images: [newImageUrl] })
        .eq('id', fix.id);

      if (!error) {
        console.log(`   ✅ ИЗОБРАЖЕНИЕ ОБНОВЛЕНО`);
        console.log(`   🖼️  ${newImageUrl.substring(0, 70)}...`);
      } else {
        console.log(`   ❌ Ошибка: ${error.message}`);
      }
    }

    await sleep(2000);
  }

  console.log('\n' + '='.repeat(80));
  console.log('\nЧАСТЬ 2: ПЕРЕИМЕНОВАНИЕ ТОВАРОВ\n');
  console.log('='.repeat(80));

  const renames = [
    { id: '00000497-0000-0000-0000-000004970000', position: 12, oldName: 'Диван Space Угловой', newName: 'Диван Space Прямой' },
    { id: '000004ab-0000-0000-0000-000004ab0000', position: 14, oldName: 'Диван Modern Раскладной', newName: 'Кровать Modern' },
    { id: '000004ac-0000-0000-0000-000004ac0000', position: 15, oldName: 'Диван Comfort 3-местный', newName: 'Кресло домашнее Comfort' },
    { id: '00000485-0000-0000-0000-000004850000', position: 17, oldName: 'Диван Lux Раскладной', newName: 'Кровать Lux' },
    { id: '000004a9-0000-0000-0000-000004a90000', position: 31, oldName: 'Диван Comfort 3-местный', newName: 'Кресло домашнее Comfort' },
    { id: '0000048d-0000-0000-0000-0000048d0000', position: 38, oldName: 'Офисное кресло Comfort Кожа/Ткань', newName: 'Кровать Comfort' },
    { id: '00000499-0000-0000-0000-000004990000', position: 44, oldName: 'Офисное кресло Classic Массаж', newName: 'Офисное кресло Classic' },
    { id: '00000488-0000-0000-0000-000004880000', position: 47, oldName: 'Диван Comfort 2-местный', newName: 'Кухонные стулья Comfort' },
    { id: '00000487-0000-0000-0000-000004870000', position: 49, oldName: 'Офисное кресло Comfort Эргономичное', newName: 'Кресло домашнее Comfort' },
    { id: '00000481-0000-0000-0000-000004810000', position: 50, oldName: 'Диван Classic 3-местный', newName: 'Диван Classic Прямой' },
    { id: '00000490-0000-0000-0000-000004900000', position: 52, oldName: 'Офисное кресло Comfort Эргономичное', newName: 'Стул домашний Comfort' },
    { id: '00000483-0000-0000-0000-000004830000', position: 53, oldName: 'Офисное кресло Comfort С подлокотниками', newName: 'Кресло домашнее Comfort' }
  ];

  for (const rename of renames) {
    console.log(`\n[Позиция ${rename.position}]`);
    console.log(`   Старое: "${rename.oldName}"`);
    console.log(`   Новое: "${rename.newName}"`);

    const { error } = await supabase
      .from('products')
      .update({ name: rename.newName })
      .eq('id', rename.id);

    if (!error) {
      console.log(`   ✅ ПЕРЕИМЕНОВАНО`);
    } else {
      console.log(`   ❌ Ошибка: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('\nЧАСТЬ 3: ЗАМЕНА КАРТИНОК МЕСТАМИ (позиции 22 и 23)\n');
  console.log('='.repeat(80));

  // Получаем текущие изображения позиций 22 и 23
  const { data: product22 } = await supabase
    .from('products')
    .select('images')
    .eq('id', '00000496-0000-0000-0000-000004960000')
    .single();

  const { data: product23 } = await supabase
    .from('products')
    .select('images')
    .eq('id', '000004a7-0000-0000-0000-000004a70000')
    .single();

  if (product22 && product23) {
    const image22 = product22.images[0];
    const image23 = product23.images[0];

    console.log('\n[Позиция 22] Modern 3-местный');
    console.log(`   Было: ${image22?.substring(0, 70)}...`);
    console.log(`   Станет: ${image23?.substring(0, 70)}...`);

    await supabase
      .from('products')
      .update({ images: [image23] })
      .eq('id', '00000496-0000-0000-0000-000004960000');

    console.log('\n[Позиция 23] Classic Угловой');
    console.log(`   Было: ${image23?.substring(0, 70)}...`);
    console.log(`   Станет: ${image22?.substring(0, 70)}...`);

    await supabase
      .from('products')
      .update({ images: [image22] })
      .eq('id', '000004a7-0000-0000-0000-000004a70000');

    console.log('\n   ✅ КАРТИНКИ ПОМЕНЯНЫ МЕСТАМИ');
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n✅ ВСЕ ИСПРАВЛЕНИЯ ЗАВЕРШЕНЫ!\n');
  console.log('Итого:');
  console.log('  - Заменено изображений: 7');
  console.log('  - Переименовано товаров: 12');
  console.log('  - Поменяно местами картинок: 2');
  console.log('  - Использовано новых уникальных изображений: ' + usedImageIds.size);
}

fixMebelCorrections().catch(console.error);
