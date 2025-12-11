const SUPABASE_URL = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI';

// Целевые категории
const CATEGORIES = {
  electronics: '52b329e8-5fbf-4e77-83a2-62d55e5671d6',  // Электроника общего назначения
  decor: '8297422c-1ca9-432f-b966-4168458aa5c7',        // Декор
  smarthome: '2292b403-4a9e-4372-8dd7-75a33c9dc85e',    // Умный дом
  bags: '84e8ba49-d986-4836-a330-93ba639f79fa',         // Одежда оптом (сумки)
  smartphones: '0d8f3d01-a56c-4840-809a-5eab1edbc4c1',  // Смартфоны (источник)
};

// Нерелевантные товары для переноса
const MOVES = [
  // Мыши и клавиатуры -> Электроника общего назначения
  { id: '9c832c49-8fbc-47d7-8dc9-9c31f97e1dff', to: 'electronics' }, // мышь колесо для Logitech
  { id: 'c332fc37-ed88-40ac-a963-f6274ceb106a', to: 'electronics' }, // 2,4 г мышь игровой
  { id: 'ee666b60-9109-4239-b4cd-e4ec77310f6a', to: 'electronics' }, // 60% NK RO механическая клавиатура
  { id: 'dc27ae0f-8ae4-4dde-9268-211110637ae5', to: 'electronics' }, // BYL механическая Snake игра мышь
  { id: 'd52d47fe-108d-4812-a9c8-4857c408c8f2', to: 'electronics' }, // Deathadder V2 игровой мышь
  { id: 'e5311bd9-7ff4-4476-a2f1-71bb4680658a', to: 'electronics' }, // GH60 Compact Keyboard Base
  { id: 'fd18e023-8c22-4b5b-836b-00ffddf93992', to: 'electronics' }, // HD Webcam
  { id: '7466b500-cf7a-4986-9ede-bb5fcbceb59a', to: 'electronics' }, // Vod hanger monitor подставка
  { id: '2d5376d7-d405-4f28-a78a-83585531b6a6', to: 'electronics' }, // Алюминиевый Monitor подставка
  { id: 'c557e915-1767-4351-a3d4-563b0af8a6c9', to: 'electronics' }, // Беспроводная мыши
  { id: '41c1786e-b7da-43c0-b653-4a36036c538a', to: 'electronics' }, // Беспроводная мышь Eric
  { id: 'd0fe5d83-c916-41e8-9ac3-20bc22f52cd7', to: 'electronics' }, // iPad Ar2 Case клавиатура
  { id: 'dca73842-5930-42ad-be3f-2f84be63d047', to: 'electronics' }, // веб-камера Logitech HD
  { id: '7c100b5b-e6b9-4f10-be32-1a71490d1896', to: 'electronics' }, // МЕХАНИЧЕСКАЯ КЛАЙСКА (клавиатура)
  { id: '8895c47f-029e-48bd-9ea4-644d34f54a9b', to: 'electronics' }, // Мышь 2 Беспроводная Bluetooth
  { id: '5336ca59-b9d2-4998-89cb-f7ca103b57bc', to: 'electronics' }, // Негабаритный игров (коврик?)
  { id: 'f1262804-40e5-4697-9631-d8a223452445', to: 'electronics' }, // Ajazz AJ139PRO мышь
  { id: '1a224c3c-e69e-468e-8923-34acb44abf3f', to: 'electronics' }, // Ноутбук подставка
  { id: 'ad547c56-4535-4c09-b8cb-7e4d96e7c55a', to: 'electronics' }, // Регулируемая подставка для ноутбука
  { id: '31fd93a0-ae58-4f99-bb72-303cece26a34', to: 'electronics' }, // универсальный Monitor Riser

  // Декоративные чехлы -> Декор
  { id: '2e143c32-51be-448d-a1da-255cb4beef07', to: 'decor' }, // Winnie The Pooh чехол
  { id: '166d6c93-11c4-4140-81b2-1366bdac5827', to: 'decor' }, // Monster Inc. чехол

  // Smart Socket -> Умный дом
  { id: '4e4cb5f2-c144-428a-91d4-b18eea9a2d8d', to: 'smarthome' }, // Socket мобильный телефон Automation
  { id: 'bee896f7-a419-4309-a778-fc200c5cebc7', to: 'smarthome' }, // RGB Smart British Sector Socket

  // Сумка -> Одежда/Сумки
  { id: 'f563518f-156b-4937-a2b3-9421d214e664', to: 'bags' }, // Mia K Collection Crossbody
  { id: '2331006a-cbdd-4a73-ba35-324e5514f9cb', to: 'bags' }, // Сумка для ноутбука
];

async function moveProduct(productId, newCategoryId) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${productId}`, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ category_id: newCategoryId })
  });
  return res.ok;
}

async function updateCategoryCount(categoryId) {
  const countRes = await fetch(`${SUPABASE_URL}/rest/v1/products?category_id=eq.${categoryId}&select=id`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'count=exact',
      'Range': '0-0'
    }
  });
  const range = countRes.headers.get('content-range');
  const count = range ? parseInt(range.split('/')[1]) : 0;

  await fetch(`${SUPABASE_URL}/rest/v1/categories?id=eq.${categoryId}`, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ product_count: count })
  });
  return count;
}

async function main() {
  console.log('=== ИСПРАВЛЕНИЕ "СМАРТФОНЫ И ПЛАНШЕТЫ" ===\n');

  let moved = 0;
  const stats = {};

  for (const move of MOVES) {
    const newCatId = CATEGORIES[move.to];
    const success = await moveProduct(move.id, newCatId);
    if (success) {
      moved++;
      stats[move.to] = (stats[move.to] || 0) + 1;
    } else {
      console.log('FAIL: ' + move.id);
    }
  }

  console.log('Статистика:');
  for (const [cat, count] of Object.entries(stats)) {
    console.log('  ' + cat + ': ' + count);
  }

  console.log('\n=== ОБНОВЛЕНИЕ СЧЁТЧИКОВ ===');
  const affected = new Set(Object.values(CATEGORIES));
  for (const catId of affected) {
    const count = await updateCategoryCount(catId);
    console.log('  ' + catId.substring(0, 8) + '... = ' + count);
  }

  console.log('\n✅ Перемещено: ' + moved + '/' + MOVES.length);
}

main().catch(console.error);
