/**
 * Скрипт для исправления категоризации товаров
 * Находит нерелевантные товары и перемещает их в правильные категории
 */

const SUPABASE_URL = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI';

// Категории для переноса
const CATEGORIES = {
  books: '935d68e2-9ee6-4e90-8c37-f46bb5fd25f6', // Профессиональная литература
  furniture: '00000066-0000-0000-0000-000000660000', // Мебель
  electrical: 'b06d205d-3f25-4c61-8037-fcf706aa70f9', // Электрика
  tools: '761a23b9-9a65-49ec-922d-8db58b9fcce9', // Инструменты
  textiles: '7e24f43c-bbf7-4827-9251-8ddde961ce65', // Текстиль
  fabrics: '7e18ace2-6e71-4acd-a5df-033783c7ffdb', // Ткани
  household: '4e53a812-6edb-482f-8ea1-b9150215c169', // Хозяйственные товары
  clothing: '84e8ba49-d986-4836-a330-93ba639f79fa', // Одежда оптом
  skincare: 'c90531a8-0a92-4ece-98a1-1e97489c063f', // Уход за кожей
  kitchen: '3a8897e5-6b92-49c7-9cf9-ffc08c8d8238', // Кухонная техника
  storage: '0dcee08a-a381-41d2-a05c-c54d7a39df9b', // Системы хранения
  decor: '8297422c-1ca9-432f-b966-4168458aa5c7', // Декор
  bedroom: '321e45c7-a9ad-4ec8-b900-74fbe75afcd0', // Спальня
  plumbing: 'f96de294-53bd-4ff8-9630-4bbd896b5e67', // Сантехника
  autoparts: 'b045d61a-56a4-4c75-9e11-a2d600df97f1', // Автозапчасти
  autochemicals: '1f2645f7-6bc1-4df1-97df-959c3f23cacb', // Автохимия
};

// Правила определения категории по названию
const RULES = [
  // Книги
  { pattern: /прямой заказ за рубеж|прямое заказ|за границу|издани|книга|учебник|справочник/i, target: 'books' },
  // Электрика
  { pattern: /socket|выключател|электрический.*switch|protector|circuit|breaker|розетк/i, target: 'electrical' },
  // Мебель
  { pattern: /мебель|шкаф|диван|кровать|стол|стул|комод|тумба|кресло/i, target: 'furniture' },
  // Ткани
  { pattern: /ткань|шифон|кружев|марлев|хлопок|лён|шёлк|бархат/i, target: 'fabrics' },
  // Инструменты
  { pattern: /wrench|spanner|drill|дрель|перфоратор|шуруповерт|пила|молоток/i, target: 'tools' },
  // Спальня (матрасы, подушки)
  { pattern: /матрас|подушк|пена.*память|memory.*foam|одеяло|постельн/i, target: 'bedroom' },
  // Декор
  { pattern: /декор|статуя|лампа|светильник|ваза|картина|зеркало/i, target: 'decor' },
];

async function getProducts(categoryId) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=id,name,sku&category_id=eq.${categoryId}&limit=500`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  });
  return res.json();
}

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

function detectCategory(name) {
  for (const rule of RULES) {
    if (rule.pattern.test(name)) {
      return rule.target;
    }
  }
  return null;
}

async function analyzeCategory(categoryId, categoryName, expectedKeywords) {
  console.log(`\n=== ${categoryName} ===`);

  const products = await getProducts(categoryId);
  console.log(`Всего товаров: ${products.length}`);

  const problems = [];

  for (const product of products) {
    const detected = detectCategory(product.name);
    if (detected && CATEGORIES[detected] !== categoryId) {
      problems.push({
        id: product.id,
        name: product.name,
        suggestedCategory: detected
      });
    }
  }

  if (problems.length > 0) {
    console.log(`❌ Найдено проблемных: ${problems.length}`);
    for (const p of problems) {
      console.log(`   - ${p.name.substring(0, 50)}... → ${p.suggestedCategory}`);
    }
  } else {
    console.log(`✅ Проблем не найдено`);
  }

  return problems;
}

async function fixProblems(problems, dryRun = true) {
  if (dryRun) {
    console.log('\n[DRY RUN] Товары НЕ будут перемещены. Запустите с --fix для применения изменений.\n');
    return;
  }

  console.log('\n=== ПРИМЕНЯЮ ИЗМЕНЕНИЯ ===');
  let fixed = 0;

  for (const p of problems) {
    const newCatId = CATEGORIES[p.suggestedCategory];
    const success = await moveProduct(p.id, newCatId);
    if (success) {
      fixed++;
      console.log(`✅ Перемещён: ${p.name.substring(0, 40)}...`);
    } else {
      console.log(`❌ Ошибка: ${p.name.substring(0, 40)}...`);
    }
  }

  console.log(`\nИтого перемещено: ${fixed}/${problems.length}`);
}

async function main() {
  const dryRun = !process.argv.includes('--fix');

  console.log('🔍 Анализ категорий на релевантность товаров\n');

  // Категории для проверки (снизу вверх по заполненности)
  const toCheck = [
    { id: 'bbe7d783-577b-45ee-af4e-6ce07e81c489', name: 'Строительные материалы' },
    { id: '84e8ba49-d986-4836-a330-93ba639f79fa', name: 'Одежда оптом' },
    { id: '6e84842b-a87c-4462-8aff-e4d852ea34c9', name: 'Посуда' },
    { id: 'f96de294-53bd-4ff8-9630-4bbd896b5e67', name: 'Сантехника' },
    { id: 'b045d61a-56a4-4c75-9e11-a2d600df97f1', name: 'Автозапчасти' },
  ];

  let allProblems = [];

  for (const cat of toCheck) {
    const problems = await analyzeCategory(cat.id, cat.name);
    allProblems = allProblems.concat(problems);
  }

  console.log(`\n========================================`);
  console.log(`ИТОГО ПРОБЛЕМНЫХ ТОВАРОВ: ${allProblems.length}`);
  console.log(`========================================`);

  if (allProblems.length > 0) {
    await fixProblems(allProblems, dryRun);
  }
}

main().catch(console.error);
