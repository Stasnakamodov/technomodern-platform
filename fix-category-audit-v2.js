/**
 * Скрипт для исправления категоризации товаров (Версия 2)
 * Результат перепроверки аудита
 */

const SUPABASE_URL = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI';

// Целевые категории
const CATEGORIES = {
  autoChemistry: '1f2645f7-6bc1-4df1-97df-959c3f23cacb',    // Автохимия
  autoParts: 'b045d61a-56a4-4c75-9e11-a2d600df97f1',        // Автозапчасти
  books: '935d68e2-9ee6-4e90-8c37-f46bb5fd25f6',            // Профессиональная литература
  furniture: '00000066-0000-0000-0000-000000660000',        // Мебель
  kitchenware: '6e84842b-a87c-4462-8aff-e4d852ea34c9',      // Посуда
  buildingMaterials: 'bbe7d783-577b-45ee-af4e-6ce07e81c489',// Строительные материалы
  hardware: '6ddf03e3-cba8-4f8c-a352-5d43072264bb',         // Крепеж и метизы
  hygiene: 'e6b134fc-e159-4acb-ad07-6f6631ebea09',          // Средства гигиены
  household: '4e53a812-6edb-482f-8ea1-b9150215c169',        // Хозяйственные товары
  electronics: '52b329e8-5fbf-4e77-83a2-62d55e5671d6',      // Электроника общего назначения
  textiles: '7e24f43c-bbf7-4827-9251-8ddde961ce65',         // Текстиль
  bedding: '321e45c7-a9ad-4ec8-b900-74fbe75afcd0',          // Спальня
  tools: '761a23b9-9a65-49ec-922d-8db58b9fcce9',            // Инструменты
  decor: '8297422c-1ca9-432f-b966-4168458aa5c7',            // Декор
};

// ТОВАРЫ ДЛЯ ПЕРЕНОСА (проверенные реальные ID)
const MOVES = [
  // ИЗ САНТЕХНИКИ (f96de294-53bd-4ff8-9630-4bbd896b5e67)

  // Автотовары -> Автохимия или Автозапчасти
  { id: '883f4ec0-b2c9-4af8-bdb0-037e65a90bf2', name: 'Автомобильное покрытие на 500 мл', to: CATEGORIES.autoChemistry },
  { id: '02385fa0-0178-4b64-a619-2b3b1e3f7206', name: 'Автомобильные сиденья восковая кожа', to: CATEGORIES.autoChemistry },
  { id: 'ad5a44c8-5a5c-484f-ace2-87edcabcd349', name: 'Автомобиль высокой мощности', to: CATEGORIES.autoParts },
  { id: 'b7e327c5-3a0b-41bd-b440-f9a22547a4ba', name: 'Крышка BMW E34 E36', to: CATEGORIES.autoParts },

  // Книги/Справочники -> Профессиональная литература
  { id: 'c4a1b993-7971-43d0-9d26-48ac39f031fb', name: 'Костюмированные ткани справочник', to: CATEGORIES.books },
  { id: '8af60ebd-9486-4195-816b-9d8ecb387b9a', name: 'Материалы для одежды 4-е издание', to: CATEGORIES.books },

  // Мебель -> Мебель
  { id: 'e09c308e-3abb-40b6-a48d-54fd37947f7d', name: 'glas italia стеклянный стол', to: CATEGORIES.furniture },

  // Посуда -> Посуда
  { id: '9754e7d0-d1a4-4e1f-adcb-a6525ffa33d1', name: 'Shuangli Pot набор жаровой горшок', to: CATEGORIES.kitchenware },

  // Строительные материалы
  { id: 'acdca961-e59a-4251-b9c4-a5de110270f0', name: 'Кнауф гипс', to: CATEGORIES.buildingMaterials },

  // Крепеж
  { id: '167770a7-94ff-4084-aea2-6290893c5b13', name: 'Набор винтов дюбели', to: CATEGORIES.hardware },

  // Замки/Хозтовары
  { id: '304abf96-cc09-49f3-8ddd-3a2ff14e773e', name: 'Багажные блокировки', to: CATEGORIES.household },

  // Дезодоранты -> Гигиена
  { id: '7d7a13e5-547c-49f8-86e5-daffb396a7ea', name: 'Антиперспирант дезодорант аэрозольный', to: CATEGORIES.hygiene },
  { id: 'f83229b5-9592-428a-a8b1-ebdbdc46425f', name: 'Антиперспирант дезодорант сладкий горох', to: CATEGORIES.hygiene },

  // Электроника (подставка для ноутбука)
  { id: '4b04a703-4663-4510-b850-a7b2fd7477b7', name: 'Подставка для ноутбука', to: CATEGORIES.electronics },

  // Спальня (губка с памятью)
  { id: 'd2c527c1-aa83-45df-ab57-523159e7ca11', name: 'Губка с пеной память', to: CATEGORIES.bedding },

  // ИЗ СРЕДСТВ ГИГИЕНЫ (e6b134fc-e159-4acb-ad07-6f6631ebea09)
  // Удалить/перенести неподходящий товар
  { id: 'eb70d464-ab03-44c6-b065-6f143c994cb1', name: 'Секс-реквизит (товары для взрослых)', to: CATEGORIES.household },
];

async function moveProduct(productId, newCategoryId) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${productId}`, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({ category_id: newCategoryId })
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to move ${productId}: ${error}`);
  }

  return res.json();
}

async function verifyProduct(productId) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${productId}&select=id,name,category_id`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  });
  const data = await res.json();
  return data.length > 0 ? data[0] : null;
}

async function main() {
  const dryRun = !process.argv.includes('--fix');

  console.log('='.repeat(60));
  console.log('ИСПРАВЛЕНИЕ КАТЕГОРИЗАЦИИ ТОВАРОВ (v2)');
  console.log('='.repeat(60));
  console.log('');

  if (dryRun) {
    console.log('🔍 РЕЖИМ ПРОВЕРКИ (dry run)');
    console.log('   Запустите с --fix для применения изменений\n');
  } else {
    console.log('⚠️  РЕЖИМ ИСПРАВЛЕНИЯ (--fix)');
    console.log('   Изменения будут применены!\n');
  }

  let verified = 0;
  let notFound = 0;
  let moved = 0;
  let errors = 0;

  for (const move of MOVES) {
    const product = await verifyProduct(move.id);

    if (!product) {
      console.log(`❌ НЕ НАЙДЕН: ${move.id} (${move.name})`);
      notFound++;
      continue;
    }

    console.log(`✓ Найден: ${product.name.substring(0, 50)}...`);
    verified++;

    if (!dryRun) {
      try {
        await moveProduct(move.id, move.to);
        console.log(`   ✅ Перемещён в ${move.to}`);
        moved++;
      } catch (err) {
        console.log(`   ❌ Ошибка: ${err.message}`);
        errors++;
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('ИТОГИ:');
  console.log('='.repeat(60));
  console.log(`Всего к переносу: ${MOVES.length}`);
  console.log(`Проверено/найдено: ${verified}`);
  console.log(`Не найдено: ${notFound}`);

  if (!dryRun) {
    console.log(`Перемещено: ${moved}`);
    console.log(`Ошибок: ${errors}`);
  }

  console.log('');

  if (dryRun && verified > 0) {
    console.log('💡 Для применения изменений запустите:');
    console.log('   node fix-category-audit-v2.js --fix');
  }
}

main().catch(console.error);
