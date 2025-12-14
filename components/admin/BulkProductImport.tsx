'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import * as XLSX from 'xlsx'
import {
  Upload,
  Download,
  FileSpreadsheet,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  X,
  ArrowLeft,
  Edit2,
  Trash2,
  RefreshCw,
  ImageIcon,
  ImageOff,
  HelpCircle,
  Copy,
  Search,
  ChevronRight,
  ChevronDown,
  FileDown,
  Lightbulb
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ParsedProduct {
  id: number // временный ID для редактирования
  name: string
  price: number | string
  sku?: string
  category_slug?: string
  category_name?: string
  supplier_name?: string
  description?: string
  images?: string
  in_stock?: string
  min_order?: number | string
  specifications?: string
  tags?: string
  isValid: boolean
  errors: string[]
}

interface ImportResult {
  success: number
  failed: number
  skipped: number
  errors: Array<{ row: number; message: string; data?: any }>
  created: Array<{ id: string; name: string }>
  createdCategories: string[]
  createdSuppliers: string[]
  linkedToExisting: number // Количество товаров, привязанных к существующим
}

interface BulkProductImportProps {
  onClose?: () => void
}

interface Category {
  id: string
  name: string
  slug: string
  parent_id: string | null
  level: number
}

type ImportStep = 'upload' | 'preview' | 'importing' | 'result'

// Функция расчёта расстояния Левенштейна (для fuzzy matching)
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = []

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }

  return matrix[b.length][a.length]
}

// Словарь английских ключевых слов → подходящие категории (для поиска по slug)
const SLUG_TO_CATEGORIES: Record<string, string[]> = {
  // Электроника и периферия
  headphone: ['peripherals', 'electronics', 'computer-accessories'],
  earphone: ['peripherals', 'electronics', 'computer-accessories'],
  earbuds: ['peripherals', 'electronics', 'computer-accessories'],
  airpods: ['peripherals', 'electronics', 'computer-accessories'],
  speaker: ['peripherals', 'electronics', 'smart-home'],
  audio: ['peripherals', 'electronics'],
  mouse: ['peripherals', 'computer-accessories'],
  keyboard: ['peripherals', 'computer-accessories'],
  monitor: ['peripherals', 'electronics', 'computer-accessories'],
  webcam: ['peripherals', 'computer-accessories'],
  usb: ['computer-accessories', 'peripherals', 'electrical-components'],
  cable: ['computer-accessories', 'electrical-components', 'peripherals'],
  charger: ['computer-accessories', 'electronics', 'electrical'],
  adapter: ['computer-accessories', 'electrical-components'],

  // Смартфоны и планшеты
  phone: ['smartphones-tablets', 'electronics'],
  smartphone: ['smartphones-tablets', 'electronics'],
  mobile: ['smartphones-tablets', 'electronics'],
  tablet: ['smartphones-tablets', 'electronics'],
  iphone: ['smartphones-tablets', 'electronics'],
  ipad: ['smartphones-tablets', 'electronics'],
  samsung: ['smartphones-tablets', 'electronics'],
  xiaomi: ['smartphones-tablets', 'electronics', 'smart-home'],

  // Умные устройства
  smart: ['smart-home', 'electronics', 'smartwatches'],
  watch: ['smartwatches', 'electronics'],
  bracelet: ['smartwatches', 'electronics'],
  fitness: ['smartwatches', 'electronics'],

  // Компьютеры
  laptop: ['electronics', 'computer-accessories'],
  computer: ['electronics', 'computer-accessories'],
  pc: ['electronics', 'computer-accessories'],

  // Авто
  car: ['automotive', 'auto-parts', 'auto-chemicals'],
  auto: ['automotive', 'auto-parts', 'auto-chemicals'],
  tire: ['tires-wheels', 'automotive'],
  wheel: ['tires-wheels', 'automotive'],
  oil: ['auto-chemicals', 'automotive'],

  // Дом
  furniture: ['furniture', 'home'],
  sofa: ['furniture', 'home'],
  chair: ['furniture', 'home'],
  table: ['furniture', 'home'],
  bed: ['bedroom', 'furniture'],
  mattress: ['bedroom', 'furniture'],
  lamp: ['lighting', 'home', 'decor'],
  light: ['lighting', 'electrical', 'smart-home'],

  // Кухня
  kitchen: ['kitchen', 'tableware', 'home'],
  cookware: ['tableware', 'kitchen'],
  pot: ['tableware', 'kitchen'],
  pan: ['tableware', 'kitchen'],
  kettle: ['kitchen', 'tableware'],
  coffee: ['kitchen', 'tableware'],

  // Инструменты
  tool: ['tools', 'industrial'],
  drill: ['tools', 'industrial'],
  saw: ['tools', 'industrial', 'machinery'],
  hammer: ['tools'],
  wrench: ['tools'],

  // Красота и здоровье
  cosmetic: ['cosmetics', 'health-beauty'],
  makeup: ['cosmetics', 'health-beauty'],
  skincare: ['skincare', 'health-beauty', 'cosmetics'],
  cream: ['skincare', 'cosmetics', 'health-beauty'],
  vitamin: ['vitamins', 'health-beauty'],
  supplement: ['vitamins', 'health-beauty'],

  // Текстиль
  textile: ['textiles', 'home'],
  towel: ['textiles', 'home', 'household-goods'],
  curtain: ['textiles', 'home', 'decor'],
  bedding: ['textiles', 'bedroom'],

  // Строительство
  building: ['building-materials', 'construction'],
  paint: ['paints', 'construction'],
  cement: ['building-materials', 'construction'],
  tile: ['finishing-materials', 'construction'],
  plumbing: ['plumbing', 'construction'],
  pipe: ['plumbing', 'construction'],
  faucet: ['plumbing'],

  // Электрика
  electric: ['electrical', 'electrical-components'],
  wire: ['electrical', 'electrical-components'],
  socket: ['electrical', 'electrical-components'],
  switch: ['electrical', 'electrical-components', 'smart-home'],
}

// Поиск похожих категорий с семантическим анализом
function findSimilarCategories(
  inputSlug: string,
  categories: Category[],
  maxResults: number = 3
): Category[] {
  if (!inputSlug || categories.length === 0) return []

  const input = inputSlug.toLowerCase().replace(/[^a-z0-9-]/g, '')
  const availableSlugs = new Set(categories.map(c => c.slug.toLowerCase()))

  // 1. СЕМАНТИЧЕСКИЙ ПОИСК: проверяем ключевые слова в введённом slug
  const semanticMatches: string[] = []
  for (const [keyword, targetCategories] of Object.entries(SLUG_TO_CATEGORIES)) {
    if (input.includes(keyword) || keyword.includes(input)) {
      for (const target of targetCategories) {
        if (availableSlugs.has(target) && !semanticMatches.includes(target)) {
          semanticMatches.push(target)
        }
      }
    }
  }

  // Если нашли семантические совпадения — возвращаем их
  if (semanticMatches.length > 0) {
    return semanticMatches
      .slice(0, maxResults)
      .map(slug => categories.find(c => c.slug.toLowerCase() === slug)!)
      .filter(Boolean)
  }

  // 2. FUZZY ПОИСК: если семантика не помогла, ищем по похожести slug
  const scored = categories.map(cat => {
    const slug = cat.slug.toLowerCase()
    const name = cat.name.toLowerCase()

    let score = 0

    // Точное совпадение подстроки в slug
    if (slug.includes(input) || input.includes(slug)) {
      score += 100
    }

    // Общие части слов (разбиваем по дефису)
    const inputParts = input.split('-').filter(Boolean)
    const slugParts = slug.split('-').filter(Boolean)

    for (const ip of inputParts) {
      for (const sp of slugParts) {
        if (sp.includes(ip) || ip.includes(sp)) {
          score += 50
        }
      }
    }

    // Название категории содержит ключевые слова из input
    const nameWords = name.split(/\s+/)
    for (const ip of inputParts) {
      if (ip.length >= 3 && nameWords.some(w => w.toLowerCase().includes(ip))) {
        score += 40
      }
    }

    // НЕ используем Левенштейна для коротких строк - это давало ложные срабатывания
    // типа "headphones" → "health-beauty"

    return { category: cat, score }
  })

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(s => s.category)
}

// Словарь ключевых слов для семантической проверки соответствия товар ↔ категория
// Формат: regex pattern → массив подходящих категорий (slug)
const PRODUCT_CATEGORY_RULES: Array<{ pattern: RegExp; expectedCategories: string[] }> = [
  // Обувь и одежда
  { pattern: /кроссовк|кед[ыи]|ботинк|туфл|сандал|обув|nike|adidas|puma|reebok|new balance/i, expectedCategories: ['clothing', 'footwear', 'sportswear', 'fashion'] },
  { pattern: /футболк|майк|рубашк|джинс|брюк|штан|куртк|пальто|плащ|свитер|толстовк/i, expectedCategories: ['clothing', 'fashion', 'sportswear'] },

  // Электроника
  { pattern: /смартфон|телефон|iphone|айфон|samsung|xiaomi|huawei|realme|poco|redmi|galaxy/i, expectedCategories: ['electronics', 'smartphones', 'mobile', 'gadgets'] },
  { pattern: /ноутбук|laptop|macbook|компьютер|пк|pc|imac/i, expectedCategories: ['electronics', 'computers', 'laptops', 'gadgets'] },
  { pattern: /планшет|tablet|ipad|айпад/i, expectedCategories: ['electronics', 'tablets', 'gadgets'] },
  { pattern: /наушник|airpods|headphone|earbuds|гарнитур/i, expectedCategories: ['electronics', 'audio', 'headphones', 'gadgets', 'accessories'] },
  { pattern: /телевизор|tv|монитор|display|дисплей/i, expectedCategories: ['electronics', 'tv', 'monitors', 'displays'] },
  { pattern: /камер|фотоаппарат|gopro|видеокамер/i, expectedCategories: ['electronics', 'cameras', 'photo', 'video'] },

  // Бытовая техника
  { pattern: /пылесос|робот.?пылесос|roborock|dyson|xiaomi.*vacuum/i, expectedCategories: ['home-appliances', 'smart-home', 'vacuum', 'home'] },
  { pattern: /холодильник|морозильник/i, expectedCategories: ['home-appliances', 'kitchen', 'refrigerators'] },
  { pattern: /стиральн|washer|washing/i, expectedCategories: ['home-appliances', 'laundry'] },
  { pattern: /кофемашин|кофеварк|coffee|эспрессо/i, expectedCategories: ['home-appliances', 'kitchen', 'tableware', 'coffee'] },
  { pattern: /чайник|kettle/i, expectedCategories: ['home-appliances', 'kitchen', 'tableware'] },
  { pattern: /микроволнов|свч/i, expectedCategories: ['home-appliances', 'kitchen'] },
  { pattern: /блендер|миксер|кухонн.*комбайн/i, expectedCategories: ['home-appliances', 'kitchen', 'tableware'] },

  // Автотовары
  { pattern: /масло.*мотор|моторн.*масло|5w|10w|синтетик.*масло/i, expectedCategories: ['auto-chemicals', 'automotive', 'oils'] },
  { pattern: /антифриз|тосол|охлаждающ/i, expectedCategories: ['auto-chemicals', 'automotive'] },
  { pattern: /омыват|стеклоомыват/i, expectedCategories: ['auto-chemicals', 'automotive'] },
  { pattern: /автошампун|автохими|присадк/i, expectedCategories: ['auto-chemicals', 'automotive'] },
  { pattern: /шин[аы]|покрышк|колес[оа]|диск.*авто|r1[4-9]|r2[0-2]/i, expectedCategories: ['tires', 'automotive', 'wheels'] },

  // Мебель
  { pattern: /диван|кресл|софа|пуф/i, expectedCategories: ['furniture', 'living-room', 'home'] },
  { pattern: /стол(?!овые)|стул|табурет/i, expectedCategories: ['furniture', 'dining', 'home', 'office'] },
  { pattern: /кровать|матрас|подушк.*сп/i, expectedCategories: ['furniture', 'bedroom', 'home'] },
  { pattern: /шкаф|комод|тумб|стеллаж|полк[аи]/i, expectedCategories: ['furniture', 'storage', 'home'] },

  // Инструменты
  { pattern: /дрель|шуруповёрт|шуруповерт|перфоратор/i, expectedCategories: ['tools', 'power-tools', 'industrial'] },
  { pattern: /пил[аы]|лобзик|болгарк|ушм/i, expectedCategories: ['tools', 'power-tools', 'industrial'] },
  { pattern: /молоток|отвёртк|отвертк|ключ.*гаечн|плоскогубц|пассатиж/i, expectedCategories: ['tools', 'hand-tools'] },

  // Сантехника
  { pattern: /смесител|кран|душ.*лейк|унитаз|раковин|ванн[аы]/i, expectedCategories: ['plumbing', 'bathroom', 'home'] },

  // Косметика и уход
  { pattern: /крем.*лиц|сыворотк|маск.*лиц|тонер|лосьон/i, expectedCategories: ['cosmetics', 'skincare', 'beauty'] },
  { pattern: /шампун|бальзам.*волос|кондиционер.*волос/i, expectedCategories: ['cosmetics', 'haircare', 'beauty', 'hygiene'] },
  { pattern: /помад|тушь|тени|румян|пудр/i, expectedCategories: ['cosmetics', 'makeup', 'beauty'] },

  // Еда и напитки
  { pattern: /кофе(?!машин)|чай(?!ник)|шоколад|конфет|печень/i, expectedCategories: ['food', 'drinks', 'grocery'] },

  // Спорт
  { pattern: /гантел|штанг|тренажёр|тренажер|фитнес|йога.*коврик/i, expectedCategories: ['sports', 'fitness', 'gym'] },
  { pattern: /велосипед|самокат|ролик|скейт/i, expectedCategories: ['sports', 'cycling', 'outdoor'] },

  // Детские товары
  { pattern: /детск|игрушк|коляск|подгузник|памперс|соск[аи]/i, expectedCategories: ['kids', 'toys', 'baby', 'children'] },

  // Зоотовары
  { pattern: /корм.*соб|корм.*кош|собач|кошач|для.*питом/i, expectedCategories: ['pets', 'pet-food', 'animals'] },
]

// Тип состояния валидации категории
type CategoryValidationStatus = 'valid' | 'warning' | 'invalid'

// Проверка семантического соответствия названия товара и категории
function checkCategoryMatch(
  productName: string,
  categorySlug: string | undefined,
  validSlugs: Set<string>
): { status: CategoryValidationStatus; suggestedCategories: string[] } {
  // Если категория не указана — просто валидно (нет что проверять)
  if (!categorySlug) {
    return { status: 'valid', suggestedCategories: [] }
  }

  const slugLower = categorySlug.toLowerCase()

  // Если категория не существует — invalid (красный)
  if (!validSlugs.has(slugLower)) {
    return { status: 'invalid', suggestedCategories: [] }
  }

  // Категория существует — проверяем семантическое соответствие
  const nameLower = productName.toLowerCase()

  for (const rule of PRODUCT_CATEGORY_RULES) {
    if (rule.pattern.test(nameLower)) {
      // Нашли правило для этого товара
      const expectedSlugs = rule.expectedCategories.map(s => s.toLowerCase())

      // Проверяем, входит ли выбранная категория в ожидаемые
      if (expectedSlugs.includes(slugLower)) {
        return { status: 'valid', suggestedCategories: [] }
      }

      // Категория НЕ в списке ожидаемых — warning (жёлтый)
      // Возвращаем рекомендуемые категории, которые есть в базе
      const availableSuggestions = rule.expectedCategories.filter(s =>
        validSlugs.has(s.toLowerCase())
      )
      return { status: 'warning', suggestedCategories: availableSuggestions }
    }
  }

  // Не нашли правило для этого товара — считаем что всё ОК
  return { status: 'valid', suggestedCategories: [] }
}

// Компонент выбора категории с dropdown и рекомендациями
function CategorySelector({
  value,
  categories,
  validSlugs,
  onChange,
  productName
}: {
  value: string | undefined
  categories: Category[]
  validSlugs: Set<string>
  onChange: (slug: string) => void
  productName: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [localValue, setLocalValue] = useState(value || '')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Синхронизация с внешним value
  useEffect(() => {
    setLocalValue(value || '')
  }, [value])

  // Семантическая проверка: valid (зелёный), warning (жёлтый), invalid (красный)
  const { status, suggestedCategories } = checkCategoryMatch(productName, localValue, validSlugs)

  // Для invalid — ищем похожие категории по fuzzy matching
  const similarCategories = status === 'invalid' && localValue
    ? findSimilarCategories(localValue, categories)
    : []

  // Рекомендации для отображения (объединяем семантические + fuzzy)
  const recommendations = status === 'warning'
    ? suggestedCategories
    : similarCategories.map(c => c.slug)

  // Фильтрация категорий по введённому значению
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(localValue.toLowerCase()) ||
    cat.slug.toLowerCase().includes(localValue.toLowerCase())
  )

  // Закрытие при клике вне
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        // При закрытии применяем изменения
        if (localValue !== value) {
          onChange(localValue)
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [localValue, value, onChange])

  // Стили в зависимости от статуса
  const statusBorderStyles = {
    valid: "border-green-400 focus:ring-green-500 bg-green-50",
    warning: "border-amber-400 focus:ring-amber-500 bg-amber-50",
    invalid: "border-red-400 focus:ring-red-500 bg-red-50"
  }

  const statusIcons = {
    valid: <span className="text-green-600">✓</span>,
    warning: <span title="Категория может не соответствовать товару">⚠️</span>,
    invalid: <span>❌</span>
  }

  // Обработка ввода
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setLocalValue(newValue)
    setIsOpen(true) // Показываем dropdown при вводе
  }

  // Обработка Enter и Escape
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onChange(localValue)
      setIsOpen(false)
    } else if (e.key === 'Escape') {
      setLocalValue(value || '')
      setIsOpen(false)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Редактируемый input */}
      <div className="flex items-center gap-1">
        <input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className={cn(
            "w-32 px-2 py-1 text-sm border rounded transition-colors focus:outline-none focus:ring-2",
            statusBorderStyles[status]
          )}
          placeholder="категория..."
        />
        {statusIcons[status]}
      </div>

      {/* Рекомендации (показываем под input если есть и dropdown закрыт) */}
      {!isOpen && (status === 'invalid' || status === 'warning') && recommendations.length > 0 && (
        <div className="absolute top-full left-0 mt-1 z-10">
          <div className={cn(
            "flex items-center gap-1 text-xs px-2 py-1 rounded-lg shadow-sm border",
            status === 'warning'
              ? "text-amber-600 bg-amber-50 border-amber-200"
              : "text-red-600 bg-red-50 border-red-200"
          )}>
            <Lightbulb className="w-3 h-3" />
            <span>{status === 'warning' ? 'Лучше:' : 'Может:'}</span>
            {recommendations.slice(0, 2).map((slug, i) => (
              <button
                key={slug}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onChange(slug)
                  setLocalValue(slug)
                }}
                className="font-medium hover:underline"
              >
                {slug}{i < Math.min(recommendations.length, 2) - 1 ? ',' : ''}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dropdown с категориями */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border z-50 overflow-hidden">

          {/* Рекомендации в dropdown */}
          {status !== 'valid' && recommendations.length > 0 && (
            <div className={cn(
              "p-2 border-b",
              status === 'warning' ? "bg-amber-50" : "bg-red-50"
            )}>
              <div className={cn(
                "flex items-center gap-1 text-xs mb-1",
                status === 'warning' ? "text-amber-700" : "text-red-700"
              )}>
                <Lightbulb className="w-3 h-3" />
                <span className="font-medium">
                  {status === 'warning' ? '⚠️ Рекомендуем другую категорию:' : 'Похожие категории:'}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {recommendations.map(slug => {
                  const cat = categories.find(c => c.slug.toLowerCase() === slug.toLowerCase())
                  return (
                    <button
                      key={slug}
                      type="button"
                      onClick={() => {
                        onChange(slug)
                        setLocalValue(slug)
                        setIsOpen(false)
                      }}
                      className={cn(
                        "px-2 py-0.5 rounded text-xs transition-colors",
                        status === 'warning'
                          ? "bg-amber-200 text-amber-800 hover:bg-amber-300"
                          : "bg-red-200 text-red-800 hover:bg-red-300"
                      )}
                    >
                      {cat?.name || slug}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Список категорий */}
          <div className="max-h-48 overflow-y-auto">
            {filteredCategories.length === 0 ? (
              <div className="p-3 text-center text-gray-500 text-sm">
                Категории не найдены
              </div>
            ) : (
              filteredCategories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    onChange(cat.slug)
                    setLocalValue(cat.slug)
                    setIsOpen(false)
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center justify-between",
                    value?.toLowerCase() === cat.slug.toLowerCase() && "bg-blue-50"
                  )}
                  style={{ paddingLeft: `${12 + (cat.level - 1) * 16}px` }}
                >
                  <span>{cat.name}</span>
                  <code className="text-xs text-gray-400">{cat.slug}</code>
                </button>
              ))
            )}
          </div>

          {/* Кнопка очистки */}
          <div className="p-2 border-t bg-gray-50">
            <button
              type="button"
              onClick={() => {
                onChange('')
                setLocalValue('')
                setIsOpen(false)
              }}
              className="w-full text-center text-xs text-gray-500 hover:text-gray-700"
            >
              Очистить категорию
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function BulkProductImport({ onClose }: BulkProductImportProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState<ImportStep>('upload')
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [fileName, setFileName] = useState('')

  // Модалка с инструкцией
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [categorySearch, setCategorySearch] = useState('')
  const [loadingCategories, setLoadingCategories] = useState(false)

  // Данные для предпросмотра
  const [parsedProducts, setParsedProducts] = useState<ParsedProduct[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)

  // Опции импорта
  const [options, setOptions] = useState({
    skipDuplicates: true,
    autoCreateCategories: false,
    autoCreateSuppliers: false,
    updateExisting: false,
    linkToExisting: true, // Привязывать товары от разных поставщиков к одному товару
  })

  // Прогресс импорта
  const [importProgress, setImportProgress] = useState(0)

  // Результат импорта
  const [importResult, setImportResult] = useState<ImportResult | null>(null)

  // Множество допустимых slug категорий для быстрой проверки
  const validCategorySlugs = new Set(categories.map(c => c.slug.toLowerCase()))

  // Загрузка категорий при монтировании (для валидации) и для модалки
  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    setLoadingCategories(true)
    try {
      const res = await fetch('/api/admin/categories')
      if (res.ok) {
        const data = await res.json()
        // API возвращает массив напрямую
        setCategories(Array.isArray(data) ? data : (data.categories || []))
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    } finally {
      setLoadingCategories(false)
    }
  }

  // Фильтрация категорий по поиску
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
    cat.slug.toLowerCase().includes(categorySearch.toLowerCase())
  )

  // Копировать slug в буфер
  const copySlug = (slug: string) => {
    navigator.clipboard.writeText(slug)
    toast.success(`Скопировано: ${slug}`)
  }

  // Скачать шаблон
  const downloadTemplate = async (format: 'xlsx' | 'csv' = 'xlsx') => {
    try {
      const res = await fetch(`/api/admin/products/template?format=${format}`)
      if (!res.ok) throw new Error('Failed to download')

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `products_template.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success('Шаблон скачан')
    } catch (error) {
      toast.error('Ошибка скачивания шаблона')
    }
  }

  // Обработка файла
  const processFile = useCallback(async (file: File) => {
    setIsLoading(true)
    setFileName(file.name)

    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)

      // Берём первый лист
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]

      // Преобразуем в JSON
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][]

      if (jsonData.length < 2) {
        toast.error('Файл пуст или не содержит данных')
        setIsLoading(false)
        return
      }

      // Первая строка - заголовки
      const headers = jsonData[0].map((h: any) =>
        String(h || '').toLowerCase().replace(/\s*\*\s*/g, '').trim()
      )

      // Создаём актуальный Set для валидации (используем текущий categories)
      const currentValidSlugs = new Set(categories.map(c => c.slug.toLowerCase()))

      // Парсим данные
      const products: ParsedProduct[] = []

      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i]

        // Пропускаем пустые строки
        if (!row || row.length === 0 || row.every((cell: any) => !cell)) {
          continue
        }

        const product: ParsedProduct = {
          id: i,
          name: '',
          price: 0,
          isValid: true,
          errors: [],
        }

        // Маппим данные по заголовкам
        headers.forEach((header: string, idx: number) => {
          const value = row[idx]
          if (value === undefined || value === null) return

          switch (header) {
            case 'name':
            case 'название':
              product.name = String(value).trim()
              break
            case 'price':
            case 'цена':
              product.price = value
              break
            case 'sku':
            case 'артикул':
              product.sku = String(value).trim()
              break
            case 'category_slug':
            case 'категория':
              product.category_slug = String(value).trim()
              break
            case 'category_name':
            case 'название категории':
              product.category_name = String(value).trim()
              break
            case 'supplier_name':
            case 'поставщик':
              product.supplier_name = String(value).trim()
              break
            case 'description':
            case 'описание':
              product.description = String(value).trim()
              break
            case 'images':
            case 'изображения':
              product.images = String(value).trim()
              break
            case 'in_stock':
            case 'наличие':
              product.in_stock = String(value).trim()
              break
            case 'min_order':
            case 'мин заказ':
              product.min_order = value
              break
            case 'specifications':
            case 'характеристики':
              product.specifications = String(value).trim()
              break
            case 'tags':
            case 'теги':
              product.tags = String(value).trim()
              break
          }
        })

        // Валидация
        if (!product.name) {
          product.isValid = false
          product.errors.push('Отсутствует название')
        }

        const price = parseFloat(String(product.price))
        if (isNaN(price) || price < 0) {
          product.isValid = false
          product.errors.push('Некорректная цена')
        }

        // Проверка категории (только если не включено автосоздание)
        if (product.category_slug && currentValidSlugs.size > 0) {
          const slug = product.category_slug.toLowerCase()
          if (!currentValidSlugs.has(slug)) {
            product.isValid = false
            product.errors.push(`Категория "${product.category_slug}" не найдена`)
          }
        }

        products.push(product)
      }

      setParsedProducts(products)
      setStep('preview')

      const validCount = products.filter(p => p.isValid).length
      const invalidCount = products.length - validCount

      if (invalidCount > 0) {
        toast.warning(`Найдено ${invalidCount} товаров с ошибками`)
      } else {
        toast.success(`Загружено ${products.length} товаров`)
      }
    } catch (error: any) {
      console.error('Parse error:', error)
      toast.error('Ошибка чтения файла: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }, [categories])

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      processFile(file)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  // Редактирование товара в превью
  const updateProduct = (id: number, field: keyof ParsedProduct, value: any) => {
    setParsedProducts(prev => prev.map(p => {
      if (p.id !== id) return p

      const updated = { ...p, [field]: value }

      // Повторная валидация
      updated.errors = []
      updated.isValid = true

      if (!updated.name) {
        updated.isValid = false
        updated.errors.push('Отсутствует название')
      }

      const price = parseFloat(String(updated.price))
      if (isNaN(price) || price < 0) {
        updated.isValid = false
        updated.errors.push('Некорректная цена')
      }

      // Проверка категории
      if (updated.category_slug) {
        const slug = updated.category_slug.toLowerCase()
        if (!validCategorySlugs.has(slug)) {
          updated.isValid = false
          updated.errors.push(`Категория "${updated.category_slug}" не найдена`)
        }
      }

      return updated
    }))
  }

  // Удаление товара из превью
  const removeProduct = (id: number) => {
    setParsedProducts(prev => prev.filter(p => p.id !== id))
  }

  // Импорт товаров
  const startImport = async () => {
    const validProducts = parsedProducts.filter(p => p.isValid)

    if (validProducts.length === 0) {
      toast.error('Нет товаров для импорта')
      return
    }

    setStep('importing')
    setImportProgress(0)

    try {
      // Подготавливаем данные для API
      const productsToImport = validProducts.map(p => ({
        name: p.name,
        price: parseFloat(String(p.price)),
        sku: p.sku || undefined,
        category_slug: p.category_slug || undefined,
        category_name: p.category_name || undefined,
        supplier_name: p.supplier_name || undefined,
        description: p.description || undefined,
        images: p.images || undefined,
        in_stock: p.in_stock || 'true',
        min_order: p.min_order || 1,
        specifications: p.specifications || undefined,
        tags: p.tags || undefined,
      }))

      // Симуляция прогресса (API вызывается один раз)
      const progressInterval = setInterval(() => {
        setImportProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const res = await fetch('/api/admin/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: productsToImport,
          options
        }),
      })

      clearInterval(progressInterval)
      setImportProgress(100)

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Import failed')
      }

      setImportResult(data.result)
      setStep('result')

      if (data.result.success > 0) {
        toast.success(`Импортировано ${data.result.success} товаров`)
      }
      if (data.result.failed > 0) {
        toast.error(`Ошибок: ${data.result.failed}`)
      }
    } catch (error: any) {
      console.error('Import error:', error)
      toast.error('Ошибка импорта: ' + error.message)
      setStep('preview')
    }
  }

  // Сброс и начало заново
  const reset = () => {
    setStep('upload')
    setParsedProducts([])
    setImportResult(null)
    setFileName('')
    setImportProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const validCount = parsedProducts.filter(p => p.isValid).length
  const invalidCount = parsedProducts.length - validCount

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h2 className="text-xl font-semibold">Массовая загрузка товаров</h2>
            <p className="text-sm text-gray-500">
              {step === 'upload' && 'Загрузите файл Excel или CSV'}
              {step === 'preview' && `${parsedProducts.length} товаров готово к импорту`}
              {step === 'importing' && 'Идёт импорт...'}
              {step === 'result' && 'Импорт завершён'}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowTemplateModal(true)}
            disabled={isLoading}
          >
            <Download className="w-4 h-4 mr-2" />
            Скачать шаблон
          </Button>
        </div>
      </div>

      {/* Модалка с инструкцией по шаблону */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header модалки */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-xl font-semibold">📋 Инструкция по заполнению шаблона</h3>
                <p className="text-sm text-gray-500 mt-1">Заполните шаблон согласно инструкции для успешного импорта</p>
              </div>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Контент модалки */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] space-y-6">
              {/* Обязательные поля */}
              <div>
                <h4 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Обязательные поля
                </h4>
                <div className="bg-red-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-start gap-3">
                    <code className="bg-white px-2 py-1 rounded text-sm font-mono text-red-700 shrink-0">name</code>
                    <span className="text-sm text-gray-700">Название товара. Пример: <span className="text-gray-500">«Смартфон Xiaomi Redmi Note 13 Pro 8/256GB»</span></span>
                  </div>
                  <div className="flex items-start gap-3">
                    <code className="bg-white px-2 py-1 rounded text-sm font-mono text-red-700 shrink-0">price</code>
                    <span className="text-sm text-gray-700">Цена в рублях (только число). Пример: <span className="text-gray-500">28990</span></span>
                  </div>
                </div>
              </div>

              {/* Рекомендуемые поля */}
              <div>
                <h4 className="font-semibold text-blue-600 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Рекомендуемые поля
                </h4>
                <div className="bg-blue-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="grid grid-cols-[120px,1fr] gap-2 items-start">
                    <code className="bg-white px-2 py-1 rounded font-mono text-blue-700">category_slug</code>
                    <span className="text-gray-700">Код категории из списка ниже</span>
                  </div>
                  <div className="grid grid-cols-[120px,1fr] gap-2 items-start">
                    <code className="bg-white px-2 py-1 rounded font-mono text-blue-700">description</code>
                    <span className="text-gray-700">Описание товара (2-4 предложения)</span>
                  </div>
                  <div className="grid grid-cols-[120px,1fr] gap-2 items-start">
                    <code className="bg-white px-2 py-1 rounded font-mono text-blue-700">images</code>
                    <span className="text-gray-700">Ссылки на картинки через запятую</span>
                  </div>
                  <div className="grid grid-cols-[120px,1fr] gap-2 items-start">
                    <code className="bg-white px-2 py-1 rounded font-mono text-blue-700">sku</code>
                    <span className="text-gray-700">Уникальный артикул товара</span>
                  </div>
                </div>
              </div>

              {/* Дополнительные поля */}
              <div>
                <h4 className="font-semibold text-gray-600 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  Дополнительные поля
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 space-y-1">
                  <p><code className="bg-white px-1 rounded font-mono">supplier_name</code> — название поставщика</p>
                  <p><code className="bg-white px-1 rounded font-mono">in_stock</code> — наличие (true/false)</p>
                  <p><code className="bg-white px-1 rounded font-mono">min_order</code> — минимальный заказ</p>
                  <p><code className="bg-white px-1 rounded font-mono">specifications</code> — характеристики в формате <span className="text-gray-500">Цвет:Чёрный|Размер:XL</span></p>
                  <p><code className="bg-white px-1 rounded font-mono">tags</code> — теги через запятую</p>
                </div>
              </div>

              {/* Список категорий */}
              <div>
                <h4 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Доступные категории
                  <span className="text-xs font-normal text-gray-500">— используйте значение из колонки «slug»</span>
                </h4>

                {/* Поиск по категориям */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Поиск категории..."
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Таблица категорий */}
                <div className="border rounded-lg overflow-hidden max-h-[250px] overflow-y-auto">
                  {loadingCategories ? (
                    <div className="p-8 text-center">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                      <p className="text-sm text-gray-500 mt-2">Загрузка категорий...</p>
                    </div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="text-left px-4 py-2 font-medium text-gray-600">Категория</th>
                          <th className="text-left px-4 py-2 font-medium text-gray-600">slug (используйте это)</th>
                          <th className="w-10"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredCategories.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                              {categorySearch ? 'Категории не найдены' : 'Нет категорий'}
                            </td>
                          </tr>
                        ) : (
                          filteredCategories.map((cat) => (
                            <tr key={cat.id} className="hover:bg-gray-50">
                              <td className="px-4 py-2">
                                <span style={{ paddingLeft: `${(cat.level - 1) * 16}px` }} className="flex items-center gap-1">
                                  {cat.level > 1 && <ChevronRight className="w-3 h-3 text-gray-300" />}
                                  {cat.name}
                                </span>
                              </td>
                              <td className="px-4 py-2">
                                <code className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-mono">
                                  {cat.slug}
                                </code>
                              </td>
                              <td className="px-2">
                                <button
                                  onClick={() => copySlug(cat.slug)}
                                  className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                                  title="Копировать slug"
                                >
                                  <Copy className="w-3.5 h-3.5 text-gray-500" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Пример заполнения */}
              <div>
                <h4 className="font-semibold text-purple-600 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Пример заполнения строки
                </h4>
                <div className="bg-purple-50 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                  <table className="text-left">
                    <tbody>
                      <tr><td className="pr-4 text-purple-600">name:</td><td>Смартфон Xiaomi Redmi Note 13 Pro 8/256GB</td></tr>
                      <tr><td className="pr-4 text-purple-600">price:</td><td>28990</td></tr>
                      <tr><td className="pr-4 text-purple-600">sku:</td><td>PHONE-001</td></tr>
                      <tr><td className="pr-4 text-purple-600">category_slug:</td><td>smartphones</td></tr>
                      <tr><td className="pr-4 text-purple-600">description:</td><td>Флагманский смартфон с камерой 200 МП...</td></tr>
                      <tr><td className="pr-4 text-purple-600">images:</td><td>https://example.com/img1.jpg, https://example.com/img2.jpg</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer с кнопками скачивания */}
            <div className="p-6 border-t bg-gray-50 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Выберите формат для скачивания шаблона
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    downloadTemplate('csv')
                    setShowTemplateModal(false)
                  }}
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Скачать CSV
                </Button>
                <Button
                  onClick={() => {
                    downloadTemplate('xlsx')
                    setShowTemplateModal(false)
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Скачать Excel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step: Upload */}
      {step === 'upload' && (
        <Card className="p-8">
          <div
            className={cn(
              'border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer',
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelect}
              className="hidden"
            />

            {isLoading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-12 h-12 text-gray-400 animate-spin mb-4" />
                <p className="text-gray-600">Обработка файла...</p>
              </div>
            ) : (
              <>
                <FileSpreadsheet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Перетащите файл сюда
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  или нажмите для выбора файла
                </p>
                <p className="text-xs text-gray-400">
                  Поддерживаемые форматы: Excel (.xlsx, .xls), CSV
                </p>
              </>
            )}
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Как это работает:</h4>
            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
              <li>Скачайте шаблон Excel с примерами заполнения</li>
              <li>Заполните данные о товарах</li>
              <li>Загрузите файл</li>
              <li>Проверьте и отредактируйте данные при необходимости</li>
              <li>Запустите импорт</li>
            </ol>
          </div>
        </Card>
      )}

      {/* Step: Preview */}
      {step === 'preview' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{parsedProducts.length}</p>
                  <p className="text-sm text-gray-500">Всего строк</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{validCount}</p>
                  <p className="text-sm text-gray-500">Готово к импорту</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{invalidCount}</p>
                  <p className="text-sm text-gray-500">С ошибками</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Options */}
          <Card className="p-4">
            <h3 className="font-medium mb-3">Опции импорта</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.skipDuplicates}
                    onChange={(e) => setOptions(prev => ({ ...prev, skipDuplicates: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Пропускать дубликаты (по SKU)</span>
                </label>
                <div className="group relative">
                  <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                    Товары с одинаковым артикулом (SKU) будут пропущены
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.updateExisting}
                    onChange={(e) => setOptions(prev => ({ ...prev, updateExisting: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Обновлять существующие товары</span>
                </label>
                <div className="group relative">
                  <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                    Если товар с таким SKU уже есть — обновить его данные
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.autoCreateCategories}
                    onChange={(e) => setOptions(prev => ({ ...prev, autoCreateCategories: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Создавать категории автоматически</span>
                </label>
                <div className="group relative">
                  <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                    Если категория не найдена — создать новую автоматически
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.autoCreateSuppliers}
                    onChange={(e) => setOptions(prev => ({ ...prev, autoCreateSuppliers: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Создавать поставщиков автоматически</span>
                </label>
                <div className="group relative">
                  <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                    Если поставщик не найден — создать нового автоматически
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.linkToExisting}
                    onChange={(e) => setOptions(prev => ({ ...prev, linkToExisting: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">🔗 Объединять одинаковые товары</span>
                </label>
                <div className="group relative">
                  <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 max-w-xs z-50 shadow-lg">
                    Если товар с таким названием уже есть — привязать нового поставщика к нему вместо создания дубликата. Цена товара = минимальная из всех поставщиков.
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Products Table */}
          <Card className="overflow-hidden">
            <div className="max-h-[400px] overflow-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Статус</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Фото</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Название</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Цена</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">SKU</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Категория</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Поставщик</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {parsedProducts.map((product) => (
                    <tr
                      key={product.id}
                      className={cn(
                        'hover:bg-gray-50',
                        !product.isValid && 'bg-red-50'
                      )}
                    >
                      <td className="px-4 py-3">
                        {product.isValid ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <div className="flex items-center gap-1">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            <span className="text-xs text-red-600">{product.errors[0]}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {product.images ? (
                          (() => {
                            const imageUrls = product.images.split(',').map(u => u.trim()).filter(Boolean)
                            const firstImage = imageUrls[0]
                            const count = imageUrls.length
                            return (
                              <div className="flex items-center gap-2">
                                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={firstImage}
                                    alt=""
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement
                                      target.style.display = 'none'
                                      target.nextElementSibling?.classList.remove('hidden')
                                    }}
                                  />
                                  <div className="hidden absolute inset-0 flex items-center justify-center">
                                    <ImageOff className="w-4 h-4 text-gray-400" />
                                  </div>
                                </div>
                                {count > 1 && (
                                  <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                    +{count - 1}
                                  </span>
                                )}
                              </div>
                            )
                          })()
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <ImageOff className="w-4 h-4 text-gray-300" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editingId === product.id ? (
                          <Input
                            value={product.name}
                            onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                            className="h-8"
                            autoFocus
                          />
                        ) : (
                          <span className={cn(!product.name && 'text-red-500 italic')}>
                            {product.name || 'Не указано'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editingId === product.id ? (
                          <Input
                            type="number"
                            value={product.price}
                            onChange={(e) => updateProduct(product.id, 'price', e.target.value)}
                            className="h-8 w-24"
                          />
                        ) : (
                          <span className={cn(
                            isNaN(parseFloat(String(product.price))) && 'text-red-500'
                          )}>
                            {product.price} ₽
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {product.sku || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <CategorySelector
                          value={product.category_slug || product.category_name}
                          categories={categories}
                          validSlugs={validCategorySlugs}
                          onChange={(slug) => updateProduct(product.id, 'category_slug', slug)}
                          productName={product.name}
                        />
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {product.supplier_name || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button
                            onClick={() => setEditingId(editingId === product.id ? null : product.id)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Edit2 className="w-4 h-4 text-gray-500" />
                          </button>
                          <button
                            onClick={() => removeProduct(product.id)}
                            className="p-1 hover:bg-red-100 rounded"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={reset}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Загрузить другой файл
            </Button>
            <Button
              onClick={startImport}
              disabled={validCount === 0}
              className="bg-gray-900 hover:bg-gray-800"
            >
              <Upload className="w-4 h-4 mr-2" />
              Импортировать {validCount} товаров
            </Button>
          </div>
        </>
      )}

      {/* Step: Importing */}
      {step === 'importing' && (
        <Card className="p-8">
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Импорт товаров...</h3>
            <p className="text-gray-500 mb-6">Пожалуйста, не закрывайте страницу</p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${importProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500">{importProgress}%</p>
          </div>
        </Card>
      )}

      {/* Step: Result */}
      {step === 'result' && importResult && (
        <>
          {/* Result Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{importResult.success}</p>
                  <p className="text-sm text-gray-500">Успешно</p>
                </div>
              </div>
            </Card>
            {importResult.linkedToExisting > 0 && (
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-blue-600 text-lg">🔗</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{importResult.linkedToExisting}</p>
                    <p className="text-sm text-gray-500">Привязано</p>
                  </div>
                </div>
              </Card>
            )}
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">{importResult.skipped}</p>
                  <p className="text-sm text-gray-500">Пропущено</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">{importResult.failed}</p>
                  <p className="text-sm text-gray-500">Ошибок</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Created Categories/Suppliers */}
          {(importResult.createdCategories.length > 0 || importResult.createdSuppliers.length > 0) && (
            <Card className="p-4">
              <h3 className="font-medium mb-3">Автоматически создано:</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {importResult.createdCategories.length > 0 && (
                  <div>
                    <p className="text-gray-500 mb-1">Категории:</p>
                    <div className="flex flex-wrap gap-1">
                      {importResult.createdCategories.map((cat, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {importResult.createdSuppliers.length > 0 && (
                  <div>
                    <p className="text-gray-500 mb-1">Поставщики:</p>
                    <div className="flex flex-wrap gap-1">
                      {importResult.createdSuppliers.map((sup, i) => (
                        <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                          {sup}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Errors */}
          {importResult.errors.length > 0 && (
            <Card className="p-4">
              <h3 className="font-medium mb-3 text-red-600">Ошибки ({importResult.errors.length})</h3>
              <div className="max-h-[200px] overflow-auto space-y-2">
                {importResult.errors.map((err, i) => (
                  <div key={i} className="p-2 bg-red-50 rounded text-sm">
                    <span className="font-medium">Строка {err.row}:</span>{' '}
                    <span className="text-red-600">{err.message}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={reset}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Загрузить ещё
            </Button>
            <Button
              onClick={() => {
                if (onClose) {
                  onClose()
                }
                router.push('/admin/products')
                router.refresh()
              }}
              className="bg-gray-900 hover:bg-gray-800"
            >
              Перейти к товарам
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
