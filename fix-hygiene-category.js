const SUPABASE_URL = 'https://rbngpxwamfkunktxjtqh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI';

// Целевые категории
const CATEGORIES = {
  books: '935d68e2-9ee6-4e90-8c37-f46bb5fd25f6',           // Профессиональная литература
  cosmetics: 'd9426962-6ca6-4187-99dd-0bd0ca88651e',      // Косметика
  plumbing: 'f96de294-53bd-4ff8-9630-4bbd896b5e67',       // Сантехника
  household: '4e53a812-6edb-482f-8ea1-b9150215c169',      // Хозяйственные товары
  clothing: '84e8ba49-d986-4836-a330-93ba639f79fa',       // Одежда оптом
  autochemicals: '1f2645f7-6bc1-4df1-97df-959c3f23cacb',  // Автохимия
  bedroom: '321e45c7-a9ad-4ec8-b900-74fbe75afcd0',        // Спальня
  tattoo: 'ecca7d11-cc0d-441d-83eb-c8318c48feb3',         // Станки и оборудование (тату оборудование)
  hygiene: 'e6b134fc-e159-4acb-ad07-6f6631ebea09',        // Средства гигиены (источник)
};

// Товары для переноса - реальные ID из API
const MOVES = [
  // Книги о продукт-менеджменте -> Профессиональная литература
  { id: 'f436f438-191f-443f-a2d7-7da7abf1298c', to: 'books' },
  { id: '2a8880f9-3ba6-47a1-b142-b84c7767b898', to: 'books' },
  { id: 'bc401498-a536-4c01-855f-bde15e3b2bf5', to: 'books' },
  { id: '0e680e77-8dda-4a62-bd8e-af45bbb31bc6', to: 'books' },
  { id: '3a99af2c-20e0-4f3e-ac05-fb519f64b7ac', to: 'books' },
  { id: '73c5c56d-0ffa-4f0f-83ae-e34e9d56a551', to: 'books' },
  { id: 'fc0fd8dc-f6d5-4edc-8854-9d8ae32cd763', to: 'books' },
  { id: '59d2f8c7-35cb-4eef-b089-670626d45c74', to: 'books' },
  { id: '0210dba7-6b2a-4261-8791-2b60b3b75b59', to: 'books' },
  { id: '4c0c71bf-290a-44ba-b833-d589a9119a74', to: 'books' },
  { id: 'e217c8db-7382-47fb-b46d-192dcf999980', to: 'books' },
  { id: '6b655517-ed9c-4265-a83d-6b6b74688d38', to: 'books' },
  { id: 'c20cd18c-8676-4a7a-88b3-852819c5bdcf', to: 'books' },
  { id: 'd2175efa-8e2a-4b21-94ad-df85b55ce25b', to: 'books' },
  { id: '186da280-dd69-4016-981a-994798e89bf0', to: 'books' },
  { id: 'd2831636-4d0d-4b57-9ccc-b2d9e4a18746', to: 'books' },
  { id: '55642e25-a3a0-4c51-8e12-fd6bba6160d0', to: 'books' },
  { id: 'f0a65768-15c6-4e1a-9c08-d469231772a3', to: 'books' },
  { id: '1cbf41e9-d402-4d75-8392-07a4c89e4641', to: 'books' },
  { id: 'a6bdef04-5d24-4686-96a6-a0d164fdc452', to: 'books' },
  { id: 'c054c3de-a517-401f-9616-5c1039e54d40', to: 'books' },
  { id: 'e43e4c2a-6107-4b07-b6fe-9a2c9d564ede', to: 'books' },
  { id: '802376b6-cfde-46fa-8ecb-8b534aff55a2', to: 'books' },
  { id: 'c0717038-a4d8-4c70-93a4-3de19d0c6324', to: 'books' },
  { id: '1f5a42ca-cc96-4a46-87c8-4ddf3f9a1fd7', to: 'books' },
  { id: '9d410e34-d8cc-407c-9eb0-ca86f3660f1c', to: 'books' },
  { id: 'f0c1feb9-1360-42ce-983c-1b3b506dd1bf', to: 'books' },
  { id: '87ac45e5-b15d-4093-8fcf-488e14032563', to: 'books' },
  { id: '434ba14f-481c-4d3c-adee-03e873c0391a', to: 'books' },
  { id: '616f255e-019f-4021-bc02-afe5d6b9914d', to: 'books' },
  { id: 'cdf1ea7c-a931-4e4c-8cb6-82ffe6ad8336', to: 'books' },
  { id: '29f6f359-26e1-44f9-ac89-55f37ac3107a', to: 'books' },
  { id: 'fc5a8300-6381-4724-94c5-3694a3dd10cf', to: 'books' },
  { id: 'f41da380-91ae-4602-aa18-4f338c4a9326', to: 'books' },
  { id: '25bef89b-0a58-4a67-a6a7-504752e9b0cd', to: 'books' },
  { id: '29fc45c7-5533-4031-b3a9-7c479da92a50', to: 'books' },
  { id: '838b8203-26ee-45ca-a39e-b254c38d3570', to: 'books' },
  { id: '25bccfa1-946e-4b89-9f62-32661f1a39c7', to: 'books' },
  { id: '6d9e0358-cd1e-4c46-9b41-cb4f437b8266', to: 'books' },
  { id: 'f168ff0c-bdc0-4ce6-8e75-616d4dd96a99', to: 'books' },
  { id: '71f22161-b6c1-4b7a-b01b-52f1dfe99217', to: 'books' },
  { id: 'a2523b9a-7b83-4af0-98ae-9ea7c92f5f96', to: 'books' },
  { id: 'e7c4fd6a-2994-4b83-ad8a-add679ae6e8e', to: 'books' },
  { id: '93c10789-17f0-403c-8288-83ff32ae7d8e', to: 'books' },
  { id: 'd41e8595-e2df-41cb-905c-9632bbb5dffd', to: 'books' },
  { id: 'dc400748-75d5-40e2-8bca-42bd8184d719', to: 'books' },
  { id: 'f683eb78-39ca-4919-8533-c7f88d547590', to: 'books' },
  { id: '1b757e54-8f55-445f-8b16-da83eebd828a', to: 'books' },
  { id: '913b0d45-52ac-4d5f-9c60-b2eaa8ec4e16', to: 'books' },
  { id: '3e85e842-c17c-4235-a2f6-4639d6648d73', to: 'books' },
  { id: '90e6b3ce-5132-4d82-9426-3222ad599a1b', to: 'books' },
  { id: 'ffbcba25-d58e-4e19-9634-b51e717f131b', to: 'books' },
  { id: '0418369f-1309-46dc-a30f-cdabb295221a', to: 'books' },
  { id: '075d580f-55c8-42a6-8b98-b231a4b0494a', to: 'books' },
  { id: '3ce61384-9973-4293-b784-9713ef9b483f', to: 'books' },

  // Косметика (шампуни, гели, краска для волос)
  { id: '07ab6b97-ad65-4b33-aacc-93c82e9e44b1', to: 'cosmetics' }, // Advanced Shampoo
  { id: '098d921f-a3f5-4387-bee4-923080ff7643', to: 'cosmetics' }, // Африканский шампунь
  { id: '30419e9e-8a24-49be-925e-ab4c1aab138d', to: 'cosmetics' }, // Краска для волос
  { id: '0ed5bb5a-60f7-41d0-bddf-e6a463fe3b72', to: 'cosmetics' }, // Запасное шампунь
  { id: '1048ca34-5ce2-4d42-8a04-ef2f99eda263', to: 'cosmetics' }, // Гель для душа

  // Сантехника
  { id: 'd16eb6ad-c16f-4f0d-b7d1-d9a1f1da8942', to: 'plumbing' }, // Продукт 10 сантехника
  { id: '1634fe74-f50f-41b1-94e3-c01b7a67498f', to: 'plumbing' }, // Продукт 9 сантехника
  { id: 'a2ae992e-6229-473c-aef9-6c2fed770c70', to: 'plumbing' }, // Продукт 9 сантехника дубль

  // Хозяйственные товары
  { id: '2a50bd8b-4b1a-42a8-9548-3ac9235b93b8', to: 'household' }, // Мусорный бак
  { id: '470ff00b-eb23-4dba-a70a-75e01b2af1fe', to: 'household' }, // Чистящее средство

  // Одежда
  { id: '743b6557-0e8b-4ad5-85cb-8aa7cd8cae4b', to: 'clothing' }, // Мужские брюки

  // Автохимия
  { id: 'aa069fa2-742d-4144-9829-f65fac7bbe57', to: 'autochemicals' }, // Нефтяная добавка

  // Спальня
  { id: '50ff4e2b-6d28-40b3-82d5-e0e57476657a', to: 'bedroom' }, // Спальные мешки

  // Татуировочное оборудование -> Станки и оборудование
  { id: 'a1e74b72-2841-489f-869d-5fbd626a1e80', to: 'tattoo' }, // Suzhou Alien Dragon Tattoo
  { id: 'fb14431f-bddd-49ee-a44b-8a57f07ffbe7', to: 'tattoo' }, // Татуировка защитное
  { id: 'b8f0ccd9-e9d9-46e8-9474-23e09a3d5024', to: 'tattoo' }, // Татуировка матрас
  { id: '7e42131d-9989-4cb4-9569-1d2f57336ea6', to: 'tattoo' }, // Татуировка ручка
  { id: 'c2cfaf08-b35e-4481-ae97-6d4f99ca5085', to: 'tattoo' }, // Татуировка распылитель
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
  console.log('=== ИСПРАВЛЕНИЕ КАТЕГОРИИ "СРЕДСТВА ГИГИЕНЫ" ===\n');

  let moved = 0;
  let failed = 0;
  const stats = {};

  for (const move of MOVES) {
    const newCatId = CATEGORIES[move.to];
    const success = await moveProduct(move.id, newCatId);
    if (success) {
      moved++;
      stats[move.to] = (stats[move.to] || 0) + 1;
    } else {
      failed++;
      console.log('FAIL: ' + move.id);
    }
  }

  console.log('Статистика перемещений:');
  for (const [cat, count] of Object.entries(stats)) {
    console.log('  ' + cat + ': ' + count);
  }

  console.log('\n=== ОБНОВЛЕНИЕ СЧЁТЧИКОВ ===');
  const affectedCategories = new Set(Object.values(CATEGORIES));
  for (const catId of affectedCategories) {
    const count = await updateCategoryCount(catId);
    console.log('  ' + catId.substring(0, 8) + '... = ' + count);
  }

  console.log('\n✅ Перемещено: ' + moved + '/' + MOVES.length);
  if (failed > 0) {
    console.log('❌ Ошибок: ' + failed);
  }
}

main().catch(console.error);
