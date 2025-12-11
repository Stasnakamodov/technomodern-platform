const SUPABASE_URL = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI';

const CATEGORIES = {
  books: '935d68e2-9ee6-4e90-8c37-f46bb5fd25f6',
  tools: '761a23b9-9a65-49ec-922d-8db58b9fcce9',
  electrical: 'b06d205d-3f25-4c61-8037-fcf706aa70f9',
  smarthome: 'e7775c42-3fcd-4361-b78c-7e3f3bc0d8af',
  cosmetics: 'd9426962-6ca6-4187-99dd-0bd0ca88651e',
  furniture: '00000066-0000-0000-0000-000000660000',
  electronics: '0c8d6f22-d85a-48b5-9a56-a78b1f91c1cb',
  household: '4e53a812-6edb-482f-8ea1-b9150215c169',
};

// Товары для перемещения
const MOVES = [
  // Автохимия -> Книги
  { id: '3a3bad5f-0dd5-4446-9630-7636f1b2d13c', name: 'Стивен Голд', to: 'books' },

  // Краски и лаки -> Электрика (розетки)
  { id: 'f745239d-27fe-4cb0-8d6f-67537012a98e', name: '2шт Remote control Sockets', to: 'electrical' },
  { id: '8dc83efa-7db5-4dab-a3e0-d463fe80dc55', name: '50CM Track Socket', to: 'electrical' },
  { id: '0ce099cd-71c1-4820-adf5-43e024ade40a', name: 'Human Detection Electrical Socket', to: 'electrical' },
  { id: 'c6378138-86ab-43d1-b1df-5d2da1ff8ec9', name: 'СИЛИКОНОВАЯ проволока', to: 'electrical' },

  // Краски и лаки -> Инструменты
  { id: '32f9f262-d672-4d2a-a5a6-e9850bf03b7a', name: 'электрический угол измельчитель', to: 'tools' },
  { id: '2d063e9f-8dba-460e-aeba-c531b6e62a4e', name: 'магнитный Spark Plug Socket', to: 'tools' },
  { id: 'f2eeb40e-536d-44bd-8b63-83d1793e7504', name: 'Pneumatic Socket Wrench', to: 'tools' },
  { id: 'e3fb273b-b604-4630-bfa6-f607ebc8bb7f', name: 'Масло серая ножная лопата', to: 'tools' },
  { id: 'fc49d5ed-c748-4eef-a240-684e66dba152', name: 'Масло серая ножная лопата шпатка', to: 'tools' },
  { id: 'e0ab5fd4-ab3b-4ca7-818c-33b9f243c6d8', name: 'Масло серая ножной лопата скребок', to: 'tools' },

  // Краски и лаки -> Умный дом
  { id: '3097827f-9ffa-42d1-a544-4b33dfab13ca', name: 'Wi-Fi Smart Bulb', to: 'smarthome' },

  // Краски и лаки -> Косметика
  { id: 'fbc91464-3480-49d7-b5f3-b05b816d1414', name: 'Маникюр набор гель-лак', to: 'cosmetics' },

  // Текстиль -> Инструменты
  { id: '325d4d49-7faa-4d2b-b31a-ceb5ba45df8c', name: 'Аккумуляторный ударный гайковерт 18В', to: 'tools' },
  { id: 'c74890cb-baba-49f4-b7d4-20c3931c0826', name: 'Бесщеточный ударный гайковерт', to: 'tools' },

  // Текстиль -> Мебель
  { id: '5e877c69-dc4e-40ce-9e32-ff5665653882', name: 'журнальный столик, диван', to: 'furniture' },
  { id: 'b59f5f91-2c0f-486b-b287-0306078d1834', name: 'Принтер, мебель, журнальный столик', to: 'furniture' },

  // Текстиль -> Электроника
  { id: 'e080e3ee-9a0c-4fc2-b917-8d05e8eb585a', name: 'Коврик для мыши', to: 'electronics' },
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
  console.log('=== ИСПРАВЛЕНИЕ КАТЕГОРИЙ ===\n');

  let moved = 0;
  const affectedCategories = new Set();

  // Текущие категории товаров
  const sourceCategories = {
    autochemicals: '1f2645f7-6bc1-4df1-97df-959c3f23cacb',
    paints: '435f8cc5-a34a-4493-a5d3-ac20a6cb06a6',
    textiles: '7e24f43c-bbf7-4827-9251-8ddde961ce65',
  };

  for (const move of MOVES) {
    const newCatId = CATEGORIES[move.to];
    const success = await moveProduct(move.id, newCatId);
    if (success) {
      moved++;
      console.log('✅ ' + move.name.substring(0, 40) + '... -> ' + move.to);
      affectedCategories.add(newCatId);
    } else {
      console.log('❌ Ошибка: ' + move.name.substring(0, 40) + '...');
    }
  }

  // Добавляем исходные категории для обновления счетчиков
  Object.values(sourceCategories).forEach(id => affectedCategories.add(id));
  Object.values(CATEGORIES).forEach(id => affectedCategories.add(id));

  console.log('\n=== ОБНОВЛЕНИЕ СЧЁТЧИКОВ ===');
  for (const catId of affectedCategories) {
    const count = await updateCategoryCount(catId);
    console.log('Категория ' + catId.substring(0, 8) + '... = ' + count);
  }

  console.log('\n✅ Перемещено товаров: ' + moved + '/' + MOVES.length);
}

main().catch(console.error);
