import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkAdminAuth } from '@/lib/admin-auth'
import * as XLSX from 'xlsx'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET - скачать шаблон Excel для импорта товаров
export async function GET(request: NextRequest) {
  const isAuthed = await checkAdminAuth()
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'xlsx'

    // Загружаем категории и поставщиков для справки
    const [categoriesRes, suppliersRes] = await Promise.all([
      supabase.from('categories').select('id, name, slug, level').order('level, name'),
      supabase.from('suppliers').select('id, name').order('name')
    ])

    const categories = categoriesRes.data || []
    const suppliers = suppliersRes.data || []

    // Создаём книгу Excel
    const workbook = XLSX.utils.book_new()

    // ===== ЛИСТ 1: Шаблон товаров =====
    const templateData = [
      // Заголовки
      [
        'name *',
        'price *',
        'sku',
        'category_slug',
        'supplier_name',
        'description',
        'images',
        'in_stock',
        'min_order',
        'specifications',
        'tags'
      ],
      // Пример заполнения 1
      [
        'Смартфон Samsung Galaxy S24',
        49990,
        'SAMSUNG-S24-001',
        'smartphones',
        'Samsung Official',
        'Флагманский смартфон с AI-функциями',
        'https://example.com/img1.jpg,https://example.com/img2.jpg',
        'true',
        1,
        'Экран:6.2 дюйма|Память:128 ГБ|Цвет:Чёрный',
        'смартфон,samsung,android'
      ],
      // Пример заполнения 2
      [
        'Наушники Sony WH-1000XM5',
        35990,
        'SONY-WH1000XM5',
        'headphones',
        'Sony Store',
        'Беспроводные наушники с шумоподавлением',
        'https://example.com/sony.jpg',
        'true',
        1,
        'Тип:Накладные|Шумоподавление:Да|Автономность:30 часов',
        'наушники,sony,bluetooth'
      ],
      // Пустые строки для заполнения
      ['', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', ''],
    ]

    const templateSheet = XLSX.utils.aoa_to_sheet(templateData)

    // Устанавливаем ширину колонок
    templateSheet['!cols'] = [
      { wch: 40 }, // name
      { wch: 12 }, // price
      { wch: 20 }, // sku
      { wch: 20 }, // category_slug
      { wch: 20 }, // supplier_name
      { wch: 50 }, // description
      { wch: 60 }, // images
      { wch: 10 }, // in_stock
      { wch: 12 }, // min_order
      { wch: 50 }, // specifications
      { wch: 30 }, // tags
    ]

    XLSX.utils.book_append_sheet(workbook, templateSheet, 'Товары')

    // ===== ЛИСТ 2: Инструкция =====
    const instructionData = [
      ['ИНСТРУКЦИЯ ПО ЗАПОЛНЕНИЮ ШАБЛОНА'],
      [''],
      ['Обязательные поля (помечены *)'],
      ['name *', 'Название товара. Обязательное поле.'],
      ['price *', 'Цена в рублях. Число больше 0.'],
      [''],
      ['Необязательные поля'],
      ['sku', 'Артикул товара. Должен быть уникальным. Если не указан — сгенерируется автоматически.'],
      ['category_slug', 'Slug категории (см. лист "Категории"). Или можно указать category_name.'],
      ['supplier_name', 'Название поставщика (см. лист "Поставщики"). Или можно указать supplier_id.'],
      ['description', 'Описание товара. Можно использовать несколько строк (внутри ячейки).'],
      ['images', 'URL изображений через запятую. Пример: url1,url2,url3'],
      ['in_stock', 'Наличие: true/false или да/нет или 1/0. По умолчанию: true'],
      ['min_order', 'Минимальный заказ (штук). По умолчанию: 1'],
      ['specifications', 'Характеристики в формате: Ключ:Значение|Ключ2:Значение2'],
      ['tags', 'Теги через запятую. Пример: новинка,акция,хит'],
      [''],
      ['ОБРАБОТКА ДУБЛИКАТОВ'],
      ['При загрузке товаров система проверяет SKU:'],
      ['- Если товар с таким SKU уже есть — он будет пропущен (или обновлён, если выбрана опция)'],
      ['- Товары без SKU всегда создаются как новые'],
      [''],
      ['АВТОСОЗДАНИЕ КАТЕГОРИЙ И ПОСТАВЩИКОВ'],
      ['Если включена опция автосоздания:'],
      ['- Категория создастся автоматически, если указанный slug не найден'],
      ['- Поставщик создастся автоматически, если указанное имя не найдено'],
    ]

    const instructionSheet = XLSX.utils.aoa_to_sheet(instructionData)
    instructionSheet['!cols'] = [{ wch: 20 }, { wch: 80 }]
    XLSX.utils.book_append_sheet(workbook, instructionSheet, 'Инструкция')

    // ===== ЛИСТ 3: Справочник категорий =====
    const categoriesData = [
      ['ID', 'Название', 'Slug (для импорта)', 'Уровень'],
      ...categories.map(c => [c.id, c.name, c.slug, c.level])
    ]

    const categoriesSheet = XLSX.utils.aoa_to_sheet(categoriesData)
    categoriesSheet['!cols'] = [
      { wch: 40 }, // id
      { wch: 30 }, // name
      { wch: 25 }, // slug
      { wch: 10 }, // level
    ]
    XLSX.utils.book_append_sheet(workbook, categoriesSheet, 'Категории')

    // ===== ЛИСТ 4: Справочник поставщиков =====
    const suppliersData = [
      ['ID', 'Название (для импорта)'],
      ...suppliers.map(s => [s.id, s.name])
    ]

    const suppliersSheet = XLSX.utils.aoa_to_sheet(suppliersData)
    suppliersSheet['!cols'] = [
      { wch: 40 }, // id
      { wch: 40 }, // name
    ]
    XLSX.utils.book_append_sheet(workbook, suppliersSheet, 'Поставщики')

    // Генерируем файл
    if (format === 'csv') {
      // Для CSV экспортируем только первый лист
      const csv = XLSX.utils.sheet_to_csv(templateSheet)
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="products_template.csv"',
        },
      })
    }

    // Excel формат
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="products_template.xlsx"',
      },
    })
  } catch (error: any) {
    console.error('Template generation error:', error)
    return NextResponse.json(
      { error: 'Ошибка генерации шаблона: ' + error.message },
      { status: 500 }
    )
  }
}
