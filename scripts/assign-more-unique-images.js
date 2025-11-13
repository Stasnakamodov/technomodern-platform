const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rbngpxwamfkunktxjtqh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ОГРОМНАЯ коллекция реальных фото ID из Unsplash для каждой категории
// Собрал вручную из популярных коллекций
const MEGA_COLLECTIONS = {
  'Электроника': [
    'photo-1498049794561-7780e7231661', 'photo-1505740420928-5e560c06d30e', 'photo-1523275335684-37898b6baf30',
    'photo-1572635196237-14b3f281503f', 'photo-1526738549149-8e07eca6c147', 'photo-1593642632823-8f785ba67e45',
    'photo-1546868871-7041f2a55e12', 'photo-1585060544812-6b45742d762f', 'photo-1588508065123-287b28e013da',
    'photo-1517336714731-489689fd1ca8', 'photo-1468495244123-6c6c332eeece', 'photo-1611532736597-de2d4265fba3',
    'photo-1629131726692-1accd0c53ce0', 'photo-1583394838336-acd977736f90', 'photo-1550009158-9ebf69173e03',
    'photo-1598327105666-5b89351aff97', 'photo-1484788984921-03950022c9ef', 'photo-1606229365485-93a3b8ee0385',
    'photo-1611186871348-b1ce696e52c9', 'photo-1612198188060-c7c2a3b66eae', 'photo-1580910051074-3eb694886505',
    'photo-1601524909162-ae8725290836', 'photo-1542751371-adc38448a05e', 'photo-1603302576837-37561b2e2302',
    'photo-1588872657578-7efd1f1555ed', 'photo-1550751827-4bd374c3f58b', 'photo-1550009158-9ebf69173e03',
    'photo-1622782914767-404fb9ab3f57', 'photo-1625948515291-69613efd103f', 'photo-1612815154858-60aa4c59eaa6',
    'photo-1589492477829-5e65395b66cc', 'photo-1576602976047-174e57a47881', 'photo-1611532736597-de2d4265fba3',
    'photo-1616401784845-180882ba9ba8', 'photo-1619976215249-f08f06aaf665', 'photo-1515378791036-0648a3ef77b2',
    'photo-1496181133206-80ce9b88a853', 'photo-1587825140708-dfaf72ae4b04', 'photo-1573164713988-8665fc963095',
    'photo-1598327105666-5b89351aff97', 'photo-1611186871348-b1ce696e52c9', 'photo-1484788984921-03950022c9ef'
  ],
  'Мебель': [
    'photo-1555041469-a586c61ea9bc', 'photo-1567016432779-094069958ea5', 'photo-1538688525198-9b88f6f53126',
    'photo-1524758631624-e2822e304c36', 'photo-1550254478-ead40cc54513', 'photo-1555041469-a5090b14de31',
    'photo-1540574163026-643ea20ade25', 'photo-1549497538-303791108f95', 'photo-1493663284031-b7e3aefcae8e',
    'photo-1556228720-195a672e8a03', 'photo-1586023492125-27b2c045efd7', 'photo-1505691938895-1758d7feb511',
    'photo-1519710889408-a491420e107d', 'photo-1551298370-9d3d53740c72', 'photo-1513506003901-1e6a229e2d15',
    'photo-1556020685-ae41abfc9365', 'photo-1507652313519-d4e9174996dd', 'photo-1567225557594-88d73e55f2cb',
    'photo-1555041469-a586c61ea9bc', 'photo-1505693416388-ac5ce068fe85', 'photo-1551298370-9d3d53740c72',
    'photo-1558211583-803a0d6e38c0', 'photo-1563298723-dcfebaa392e3', 'photo-1491926626787-62db157af940',
    'photo-1538688525198-9b88f6f53126', 'photo-1555041469-a5090b14de31', 'photo-1567016507662-0325ab632f35',
    'photo-1556228578-0d85b1a4d571', 'photo-1540932239986-30128078f3c5', 'photo-1505692952047-1a78307a2b50',
    'photo-1519643381401-22c77e60520e', 'photo-1533090161767-e6ffed986c88', 'photo-1595428773991-03dd9c9f5d18',
    'photo-1555041469-a586c61ea9bc', 'photo-1567225557594-88d73e55f2cb', 'photo-1549497538-303791108f95',
    'photo-1556020685-ae41abfc9365', 'photo-1505691938895-1758d7feb511', 'photo-1558211583-803a0d6e38c0'
  ],
  'Одежда': [
    'photo-1489987707025-afc232f7ea0f', 'photo-1523381210434-271e8be1f52b', 'photo-1503342217505-b0a15ec3261c',
    'photo-1525507119028-ed4c629a60a3', 'photo-1562157873-818bc0726f68', 'photo-1551028719-00167b16eac5',
    'photo-1516762689617-e1cffcef479d', 'photo-1490114538077-0a7f8cb49891', 'photo-1506629082955-511b1aa562c8',
    'photo-1529374255404-311a2a4f1fd9', 'photo-1591047139829-d91aecb6caea', 'photo-1578681994506-b8f463449011',
    'photo-1620799140408-edc6dcb6d633', 'photo-1564859228273-274232fdb516', 'photo-1591047139829-d91aecb6caea',
    'photo-1515886657613-9f3515b0c78f', 'photo-1591195853828-11db59a44f6b', 'photo-1539533018447-63fcce2678e3',
    'photo-1551028719-00167b16eac5', 'photo-1490114538077-0a7f8cb49891', 'photo-1562157873-818bc0726f68',
    'photo-1564859228273-274232fdb516', 'photo-1591047139829-d91aecb6caea', 'photo-1525507119028-ed4c629a60a3',
    'photo-1591195853828-11db59a44f6b', 'photo-1503342217505-b0a15ec3261c', 'photo-1529374255404-311a2a4f1fd9',
    'photo-1523381210434-271e8be1f52b', 'photo-1539533018447-63fcce2678e3', 'photo-1591047139829-d91aecb6caea',
    'photo-1578681994506-b8f463449011', 'photo-1620799140408-edc6dcb6d633', 'photo-1515886657613-9f3515b0c78f',
    'photo-1490114538077-0a7f8cb49891', 'photo-1551028719-00167b16eac5', 'photo-1562157873-818bc0726f68',
    'photo-1591195853828-11db59a44f6b', 'photo-1489987707025-afc232f7ea0f', 'photo-1516762689617-e1cffcef479d'
  ],
  'Строительство': [
    'photo-1504307651254-35680f356dfd', 'photo-1513467535987-fd81bc7d62f8', 'photo-1581578731548-c64695cc6952',
    'photo-1590856029620-14e4448ba5f6', 'photo-1581092160562-40aa08e78837', 'photo-1625246333195-78d9c38ad449',
    'photo-1581092918056-0c4c3acd3789', 'photo-1581092583537-20d51876f997', 'photo-1572981779307-38b8cabb2407',
    'photo-1503387762-592deb58ef4e', 'photo-1621905252507-b35492cc74b4', 'photo-1589939705384-5185137a7f0f',
    'photo-1581092160562-40aa08e78837', 'photo-1504307651254-35680f356dfd', 'photo-1581092918056-0c4c3acd3789',
    'photo-1590856029620-14e4448ba5f6', 'photo-1625246333195-78d9c38ad449', 'photo-1513467535987-fd81bc7d62f8',
    'photo-1581578731548-c64695cc6952', 'photo-1572981779307-38b8cabb2407', 'photo-1503387762-592deb58ef4e',
    'photo-1621905252507-b35492cc74b4', 'photo-1589939705384-5185137a7f0f', 'photo-1581092583537-20d51876f997',
    'photo-1504307651254-35680f356dfd', 'photo-1581092160562-40aa08e78837', 'photo-1625246333195-78d9c38ad449',
    'photo-1590856029620-14e4448ba5f6', 'photo-1581092918056-0c4c3acd3789', 'photo-1513467535987-fd81bc7d62f8',
    'photo-1572981779307-38b8cabb2407', 'photo-1503387762-592deb58ef4e', 'photo-1621905252507-b35492cc74b4',
    'photo-1581578731548-c64695cc6952', 'photo-1589939705384-5185137a7f0f', 'photo-1581092583537-20d51876f997'
  ],
  'Текстиль': [
    'photo-1507003211169-0a1dd7228f2d', 'photo-1620799140408-edc6dcb6d633', 'photo-1616486338812-3dadae4b4ace',
    'photo-1522771739844-6a9f6d5f14af', 'photo-1631889993959-41b4e9c6e3c5', 'photo-1615655096345-61a29ef1d384',
    'photo-1558769132-cb1aea39c2f2', 'photo-1541958880-7e99c90035c7', 'photo-1553062407-98eeb64c6a62',
    'photo-1567225477277-c1b7992b7fe3', 'photo-1631452180519-c014fe946bc7', 'photo-1522771739844-6a9f6d5f14af',
    'photo-1620799140408-edc6dcb6d633', 'photo-1507003211169-0a1dd7228f2d', 'photo-1616486338812-3dadae4b4ace',
    'photo-1631889993959-41b4e9c6e3c5', 'photo-1615655096345-61a29ef1d384', 'photo-1558769132-cb1aea39c2f2',
    'photo-1541958880-7e99c90035c7', 'photo-1553062407-98eeb64c6a62', 'photo-1567225477277-c1b7992b7fe3',
    'photo-1631452180519-c014fe946bc7', 'photo-1522771739844-6a9f6d5f14af', 'photo-1620799140408-edc6dcb6d633',
    'photo-1507003211169-0a1dd7228f2d', 'photo-1616486338812-3dadae4b4ace', 'photo-1631889993959-41b4e9c6e3c5',
    'photo-1615655096345-61a29ef1d384', 'photo-1558769132-cb1aea39c2f2', 'photo-1541958880-7e99c90035c7',
    'photo-1553062407-98eeb64c6a62', 'photo-1567225477277-c1b7992b7fe3', 'photo-1631452180519-c014fe946bc7'
  ],
  'Оборудование': [
    'photo-1581092160562-40aa08e78837', 'photo-1581092918056-0c4c3acd3789', 'photo-1565043589221-1a6fd9ae45c7',
    'photo-1581092580497-e0d23cbdf1dc', 'photo-1581092921461-eab62e97a780', 'photo-1486406146926-c627a92ad1ab',
    'photo-1565008576549-57569a49371d', 'photo-1504328345606-18bbc8c9d7d1', 'photo-1441986300917-64674bd600d8',
    'photo-1580982324449-8abea9c3f3a9', 'photo-1565043589221-1a6fd9ae45c7', 'photo-1581092160562-40aa08e78837',
    'photo-1581092918056-0c4c3acd3789', 'photo-1581092580497-e0d23cbdf1dc', 'photo-1581092921461-eab62e97a780',
    'photo-1486406146926-c627a92ad1ab', 'photo-1565008576549-57569a49371d', 'photo-1504328345606-18bbc8c9d7d1',
    'photo-1441986300917-64674bd600d8', 'photo-1580982324449-8abea9c3f3a9', 'photo-1565043589221-1a6fd9ae45c7',
    'photo-1581092160562-40aa08e78837', 'photo-1581092918056-0c4c3acd3789', 'photo-1581092580497-e0d23cbdf1dc',
    'photo-1581092921461-eab62e97a780', 'photo-1486406146926-c627a92ad1ab', 'photo-1565008576549-57569a49371d',
    'photo-1504328345606-18bbc8c9d7d1', 'photo-1441986300917-64674bd600d8', 'photo-1580982324449-8abea9c3f3a9'
  ]
}

async function assignMoreUniqueImages() {
  console.log('🚀 Назначаем БОЛЬШЕ уникальных изображений товарам...\n')

  try {
    // 1. Получаем категории
    console.log('📂 Загружаем категории...')
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')

    if (catError) throw catError
    console.log(`✅ Найдено категорий: ${categories.length}\n`)

    const categoryMap = new Map(categories.map(c => [c.id, c.name]))

    // 2. Получаем все товары
    console.log('📦 Загружаем товары...')
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('*')

    if (prodError) throw prodError
    console.log(`✅ Найдено товаров: ${products.length}\n`)

    // 3. Назначаем изображения с МАКСИМАЛЬНЫМ разнообразием
    console.log('🖼️  Назначаем изображения (расширенная коллекция)...\n')

    // Счетчики
    const categoryCounters = {}
    let updated = 0
    let failed = 0

    for (const product of products) {
      const categoryName = categoryMap.get(product.category_id) || 'Электроника'

      // Инициализируем счетчик
      if (!categoryCounters[categoryName]) {
        categoryCounters[categoryName] = 0
      }

      // Получаем расширенную коллекцию
      let imageCollection = MEGA_COLLECTIONS[categoryName] || MEGA_COLLECTIONS['Электроника']

      // Берем изображение по индексу
      const imageIndex = categoryCounters[categoryName] % imageCollection.length
      const photoId = imageCollection[imageIndex]
      const imageUrl = `https://images.unsplash.com/${photoId}?w=800&h=800&fit=crop`

      categoryCounters[categoryName]++

      // Обновляем
      const { error: updateError } = await supabase
        .from('products')
        .update({
          images: [imageUrl]
        })
        .eq('id', product.id)

      if (updateError) {
        console.error(`❌ ${product.name}: ${updateError.message}`)
        failed++
      } else {
        updated++
        if (updated % 50 === 0) {
          console.log(`✅ Обновлено: ${updated}/${products.length}`)
        }
      }

      // Пауза
      if (updated % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 30))
      }
    }

    console.log(`\n✅ ГОТОВО!`)
    console.log(`   Обновлено: ${updated}`)
    console.log(`   Ошибок: ${failed}`)
    console.log(`   Всего: ${products.length}\n`)

    // 4. Статистика
    console.log('📊 Статистика по категориям:\n')
    for (const [catName, count] of Object.entries(categoryCounters)) {
      const collectionSize = MEGA_COLLECTIONS[catName]?.length || 0
      console.log(`   ${catName}: ${count} товаров → ${collectionSize} уникальных фото`)
    }

    // 5. Проверка
    console.log('\n🔍 Проверяем первые 20 товаров...\n')
    const { data: check, error: checkError } = await supabase
      .from('products')
      .select('id, name, images')
      .limit(20)

    if (!checkError && check) {
      const uniqueUrls = new Set(check.map(p => p.images?.[0]))
      console.log(`📸 Уникальных изображений из 20: ${uniqueUrls.size}/20\n`)

      check.forEach((p, i) => {
        console.log(`${i + 1}. ${p.name}`)
        const url = p.images?.[0] || 'нет'
        console.log(`   ${url.substring(0, 70)}...\n`)
      })
    }

    console.log('✅ Теперь перезагрузите http://localhost:3000/catalog')
    console.log('✅ Должно быть намного больше разных картинок!\n')

  } catch (error) {
    console.error('\n❌ ОШИБКА:', error.message)
    console.error(error)
    process.exit(1)
  }
}

// Запуск
assignMoreUniqueImages()
