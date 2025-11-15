import { createClient } from '@supabase/supabase-js';

const url = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5OTk0NywiZXhwIjoyMDY0MTc1OTQ3fQ.UnPSq_-7-PlzoYQFSvVUOwu4U6dirDoFyQQG08P7Jek';
const unsplashKey = 'hqFoDoRVmIBT9YnswQsPEyfwwC2MBMggezWakuIfz3M';

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const usedImageIds = new Set<string>();

// Поисковые запросы для разных типов товаров
function getSearchQueries(productName: string): string[] {
  const name = productName.toLowerCase();

  // Сверло
  if (name.includes('сверло')) {
    return [
      'drill bit professional tool closeup',
      'metal drill bit set professional',
      'twist drill bit isolated white background',
      'professional drill bits construction tool'
    ];
  }

  // Набор головок и ключей
  if (name.includes('набор головок') || name.includes('ключей')) {
    return [
      'socket wrench set toolbox professional',
      'socket set ratchet tools mechanic',
      'socket wrench kit professional toolbox',
      'ratchet socket set professional tools'
    ];
  }

  // Фрезерный станок по дереву
  if (name.includes('фрезерн')) {
    return [
      'wood router power tool professional',
      'hand router woodworking tool',
      'router tool carpentry professional',
      'wood trimmer router professional tool'
    ];
  }

  // Болгарка
  if (name.includes('болгарка')) {
    return [
      'angle grinder power tool professional',
      'disc grinder construction tool isolated',
      'angle grinder professional white background',
      'portable angle grinder tool professional'
    ];
  }

  // Дрели
  if (name.includes('дрель')) {
    if (name.includes('ударная')) {
      return [
        'hammer drill professional power tool',
        'impact drill construction tool white',
        'professional impact driver drill isolated',
        'cordless hammer drill tool closeup'
      ];
    }
    if (name.includes('комплект') || name.includes('набор')) {
      return [
        'power drill set case professional kit',
        'cordless drill complete set toolbox',
        'drill kit professional accessories case',
        'drill driver set with bits professional'
      ];
    }
    if (name.includes('аккумуляторная') || name.includes('18v') || name.includes('20v')) {
      return [
        'cordless drill battery professional tool',
        'battery powered drill driver isolated',
        'cordless power drill professional white',
        'lithium drill professional tool closeup'
      ];
    }
    return [
      'professional power drill tool isolated',
      'cordless drill driver white background',
      'electric drill professional construction',
      'power drill tool professional closeup'
    ];
  }

  // LED светильники
  if (name.includes('led') || name.includes('светильник')) {
    if (name.includes('пульт')) {
      return [
        'LED smart bulb remote control white',
        'remote controlled LED light bulb',
        'LED bulb wireless remote white background',
        'smart LED lamp with remote control'
      ];
    }
    return [
      'LED light bulb professional white background',
      'smart LED bulb modern lighting',
      'LED lamp professional product photo',
      'modern LED bulb white background'
    ];
  }

  return ['construction professional tool product'];
}

async function getRelevantImage(productName: string): Promise<string | null> {
  const queries = getSearchQueries(productName);

  for (const query of queries) {
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
            console.log(`   ✅ Найдено по запросу: "${query}"`);
            return image.urls.regular;
          }
        }
      }

      await sleep(500);
    } catch (error) {
      console.error(`   ⚠️  Ошибка запроса "${query}":`, error);
    }
  }

  return null;
}

async function fixProducts() {
  const supabase = createClient(url, serviceKey);

  console.log('🔨 ИСПРАВЛЕНИЕ ТОВАРОВ КАТЕГОРИИ "СТРОИТЕЛЬСТВО"\n');
  console.log('=' + '='.repeat(79) + '\n');

  // Товары для переименования
  const renameItems = [
    { id: '000004bf-0000-0000-0000-000004bf0000', position: 13, newName: 'Сверло по металлу Professional' },
    { id: '000004cf-0000-0000-0000-000004cf0000', position: 18, newName: 'Набор головок и ключей MasterCraft' },
    { id: '000004d4-0000-0000-0000-000004d40000', position: 27, newName: 'Ручной фрезерный станок по дереву ProWork' },
    { id: '000004df-0000-0000-0000-000004df0000', position: 33, newName: 'Болгарка ручная BuildPro' }
  ];

  // Товары для замены изображений
  const badImageIds = [
    { id: '000004e9-0000-0000-0000-000004e90000', position: 1, name: 'Дрель PowerTool Комплект насадок' },
    { id: '000004ea-0000-0000-0000-000004ea0000', position: 8, name: 'Дрель PowerTool Комплект насадок' },
    { id: '000004c6-0000-0000-0000-000004c60000', position: 10, name: 'Дрель BuildPro Аккумуляторная' },
    { id: '000004c2-0000-0000-0000-000004c20000', position: 11, name: 'Дрель MasterCraft Ударная' },
    { id: '000004c1-0000-0000-0000-000004c10000', position: 12, name: 'Дрель ToolMax Комплект насадок' },
    { id: '000004cb-0000-0000-0000-000004cb0000', position: 16, name: 'Дрель BuildPro Ударная' },
    { id: '000004c7-0000-0000-0000-000004c70000', position: 19, name: 'LED светильник LuxLight Пульт ДУ' },
    { id: '000004d5-0000-0000-0000-000004d50000', position: 25, name: 'LED светильник BrightLight Пульт ДУ' },
    { id: '000004db-0000-0000-0000-000004db0000', position: 26, name: 'Дрель PowerTool 18V' },
    { id: '000004d7-0000-0000-0000-000004d70000', position: 29, name: 'Дрель ToolMax 20V' },
    { id: '000004e1-0000-0000-0000-000004e10000', position: 30, name: 'Дрель ToolMax Ударная' },
    { id: '000004e2-0000-0000-0000-000004e20000', position: 31, name: 'Дрель MasterCraft 20V' },
    { id: '000004d0-0000-0000-0000-000004d00000', position: 41, name: 'Дрель MasterCraft Ударная' }
  ];

  let renamedCount = 0;
  let imagesUpdated = 0;
  let failed = 0;

  // ЭТАП 1: Переименование товаров
  console.log('📝 ЭТАП 1: ПЕРЕИМЕНОВАНИЕ ТОВАРОВ\n');

  for (const item of renameItems) {
    console.log(`Позиция ${item.position}: ${item.newName}`);
    console.log(`   🔍 Получаю релевантное изображение...`);

    const imageUrl = await getRelevantImage(item.newName);

    if (!imageUrl) {
      console.log(`   ⚠️  Не удалось найти изображение, обновляю только название\n`);

      const { error } = await supabase
        .from('products')
        .update({ name: item.newName })
        .eq('id', item.id);

      if (error) {
        console.log(`   ❌ Ошибка: ${error.message}\n`);
        failed++;
      } else {
        console.log(`   ✅ Название обновлено\n`);
        renamedCount++;
      }
    } else {
      const { error } = await supabase
        .from('products')
        .update({
          name: item.newName,
          images: [imageUrl]
        })
        .eq('id', item.id);

      if (error) {
        console.log(`   ❌ Ошибка: ${error.message}\n`);
        failed++;
      } else {
        console.log(`   ✅ Переименовано и изображение обновлено`);
        console.log(`   🖼️  ${imageUrl.substring(0, 70)}...\n`);
        renamedCount++;
        imagesUpdated++;
      }
    }

    await sleep(1500);
  }

  // ЭТАП 2: Замена плохих изображений
  console.log('\n' + '=' + '='.repeat(79));
  console.log('\n📸 ЭТАП 2: ЗАМЕНА ПЛОХИХ ИЗОБРАЖЕНИЙ\n');

  for (let i = 0; i < badImageIds.length; i++) {
    const item = badImageIds[i];
    console.log(`[${i + 1}/${badImageIds.length}] Позиция ${item.position}: ${item.name}`);
    console.log(`   🔍 Ищу лучшее изображение...`);

    const imageUrl = await getRelevantImage(item.name);

    if (!imageUrl) {
      console.log(`   ❌ Не удалось найти новое изображение\n`);
      failed++;
      await sleep(1500);
      continue;
    }

    const { error } = await supabase
      .from('products')
      .update({ images: [imageUrl] })
      .eq('id', item.id);

    if (error) {
      console.log(`   ❌ Ошибка: ${error.message}\n`);
      failed++;
    } else {
      console.log(`   ✅ ИЗОБРАЖЕНИЕ ЗАМЕНЕНО`);
      console.log(`   🖼️  ${imageUrl.substring(0, 70)}...\n`);
      imagesUpdated++;
    }

    await sleep(1500);
  }

  // ИТОГОВАЯ СТАТИСТИКА
  console.log('\n' + '=' + '='.repeat(79));
  console.log('\n📊 ИТОГОВАЯ СТАТИСТИКА:\n');
  console.log(`   Товаров переименовано: ${renamedCount}/4`);
  console.log(`   Изображений обновлено: ${imagesUpdated}`);
  console.log(`   Ошибок: ${failed}`);
  console.log(`   Использовано уникальных изображений: ${usedImageIds.size}`);
  console.log('\n✅ ОБРАБОТКА ЗАВЕРШЕНА!');
  console.log('\n🔄 Обновите страницу в браузере (Cmd+R или Ctrl+R)');
}

fixProducts().catch(console.error);
