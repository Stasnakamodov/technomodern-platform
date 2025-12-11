# План интеграции поиска по картинке и ссылке из Get2B в TechnoModern

## Контекст
Необходимо скопировать функциональность поиска товаров по изображению и по URL из проекта **godplisgomvp-forvercel** (Get2B) в текущий проект **TechnoModern** (code).

**Исходный проект:** `/Users/user/Desktop/godplisgomvp-forvercel`
**Целевой проект:** `/Users/user/Downloads/code`

## Архитектура функционала

### 1. Поиск по изображению
**Принцип работы:**
1. Пользователь загружает изображение (drag&drop или file input)
2. Изображение конвертируется в base64
3. API отправляет изображение в Yandex Vision для:
   - Классификации (определение категории товара)
   - OCR (распознавание текста на изображении)
4. YandexGPT анализирует результаты и генерирует ключевые слова
5. Поиск товаров в Supabase по ключевым словам
6. Отображение результатов пользователю

### 2. Поиск по URL
**Принцип работы:**
1. Пользователь вводит URL товара с маркетплейса
2. API пытается спарсить страницу через:
   - Claude Web Fetch (AI парсинг) - быстро, для простых сайтов
   - Playwright (браузерный парсинг) - fallback для защищенных сайтов
3. YandexGPT анализирует метаданные (название, описание)
4. Поиск товаров в Supabase по ключевым словам
5. Отображение результатов пользователю

**Особенность для Ozon:** Специальная модалка с выбором метода (скриншот или ручной поиск)

---

## Шаг 1: Копирование API Routes

### 1.1 Создать API endpoint для поиска по изображению

**Откуда:**
```
/Users/user/Desktop/godplisgomvp-forvercel/app/api/catalog/search-by-image/route.ts
```

**Куда:**
```
/Users/user/Downloads/code/app/api/catalog/search-by-image/route.ts
```

**Действие:** Скопировать файл целиком

---

### 1.2 Создать API endpoint для поиска по URL

**Откуда:**
```
/Users/user/Desktop/godplisgomvp-forvercel/app/api/catalog/search-by-url/route.ts
```

**Куда:**
```
/Users/user/Downloads/code/app/api/catalog/search-by-url/route.ts
```

**Действие:** Скопировать файл целиком

---

## Шаг 2: Копирование Services (Библиотеки)

### 2.1 YandexVisionService - Распознавание изображений

**Откуда:**
```
/Users/user/Desktop/godplisgomvp-forvercel/lib/services/YandexVisionService.ts
```

**Куда:**
```
/Users/user/Downloads/code/lib/services/YandexVisionService.ts
```

**Зависимости:**
- `xlsx` npm package (для работы с Excel - может не понадобиться)
- `@/lib/supabaseClient` (уже есть в проекте)

**Переменные окружения:**
- `YANDEX_VISION_API_KEY` - API ключ Yandex Vision
- `YANDEX_FOLDER_ID` - ID папки Yandex Cloud

---

### 2.2 YandexGPTService - AI анализ

**Откуда:**
```
/Users/user/Desktop/godplisgomvp-forvercel/lib/services/YandexGPTService.ts
```

**Куда:**
```
/Users/user/Downloads/code/lib/services/YandexGPTService.ts
```

**Зависимости:**
- Нет внешних зависимостей

**Переменные окружения:**
- `YANDEX_GPT_API_KEY` - API ключ YandexGPT
- `YANDEX_FOLDER_ID` - ID папки Yandex Cloud

---

### 2.3 UrlParserService - Парсинг URL

**Откуда:**
```
/Users/user/Desktop/godplisgomvp-forvercel/lib/services/UrlParserService.ts
```

**Куда:**
```
/Users/user/Downloads/code/lib/services/UrlParserService.ts
```

**Зависимости:**
- `PlaywrightParserService` (см. ниже)
- `ClaudeWebFetchService` (см. ниже)

---

### 2.4 HtmlParserService - Парсинг HTML

**Откуда:**
```
/Users/user/Desktop/godplisgomvp-forvercel/lib/services/HtmlParserService.ts
```

**Куда:**
```
/Users/user/Downloads/code/lib/services/HtmlParserService.ts
```

**Зависимости:**
- `cheerio` npm package (для парсинга HTML)

---

### 2.5 ClaudeWebFetchService - AI парсинг через Claude

**Откуда:**
```
/Users/user/Desktop/godplisgomvp-forvercel/lib/services/ClaudeWebFetchService.ts
```

**Куда:**
```
/Users/user/Downloads/code/lib/services/ClaudeWebFetchService.ts
```

**Зависимости:**
- `@anthropic-ai/sdk` npm package
- `UrlParserService` (для типов)

**Переменные окружения:**
- `ANTHROPIC_API_KEY` - API ключ Claude

---

### 2.6 PlaywrightParserService - Браузерный парсинг

**Откуда:**
```
/Users/user/Desktop/godplisgomvp-forvercel/lib/services/PlaywrightParserService.ts
```

**Куда:**
```
/Users/user/Downloads/code/lib/services/PlaywrightParserService.ts
```

**Зависимости:**
- `playwright` npm package

**Переменные окружения:**
- Нет (опционально)

---

### 2.7 BrowserParserService (опционально)

**Откуда:**
```
/Users/user/Desktop/godplisgomvp-forvercel/lib/services/BrowserParserService.ts
```

**Куда:**
```
/Users/user/Downloads/code/lib/services/BrowserParserService.ts
```

**Примечание:** Может не понадобиться, если Playwright достаточно

---

## Шаг 3: Обновление Frontend компонента

### 3.1 Добавить функциональность в header-search.tsx

**Файл для редактирования:**
```
/Users/user/Downloads/code/components/header-search.tsx
```

**Что нужно добавить:**

1. **Обработчики для загрузки изображения:**
```typescript
const handleImageUpload = (file: File) => {
  // Проверка типа и размера
  // Конвертация в base64
  // Отправка на /api/catalog/search-by-image
}
```

2. **Обработчики для поиска по URL:**
```typescript
const handleUrlSearch = async () => {
  // Проверка URL
  // Отправка на /api/catalog/search-by-url
  // Обработка результатов
}
```

3. **Состояния:**
```typescript
const [uploadedImage, setUploadedImage] = useState<string | null>(null)
const [isDragging, setIsDragging] = useState(false)
const [searchUrl, setSearchUrl] = useState('')
const [isSearching, setIsSearching] = useState(false)
```

**Источник для копирования логики:**
```
/Users/user/Desktop/godplisgomvp-forvercel/components/CatalogDropdown.tsx
```

**Диапазон строк для изучения:**
- Строки 218-265: Drag & Drop обработчики
- Строки 281-342: handleImageSearch
- Строки 344-433: handleUrlSearch
- Строки 915-1054: Модальное окно загрузки изображения
- Строки 1057-1195: Модальное окно поиска по URL
- Строки 1198-1405: Модальное окно выбора метода для Ozon

---

## Шаг 4: Переменные окружения

### 4.1 Добавить в .env.local

**Файл:**
```
/Users/user/Downloads/code/.env.local
```

**Добавить переменные:**
```env
# Yandex Vision API
YANDEX_VISION_API_KEY=your_yandex_vision_api_key_here
YANDEX_FOLDER_ID=your_yandex_folder_id_here

# Yandex GPT API
YANDEX_GPT_API_KEY=your_yandex_gpt_api_key_here

# Claude API (опционально, для улучшенного парсинга)
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### 4.2 Обновить .env.example

**Файл:**
```
/Users/user/Downloads/code/.env.example
```

**Добавить:**
```env
# Поиск по изображению и URL
YANDEX_VISION_API_KEY=
YANDEX_FOLDER_ID=
YANDEX_GPT_API_KEY=
ANTHROPIC_API_KEY=
```

---

## Шаг 5: Установка зависимостей

### 5.1 NPM пакеты

**Файл:**
```
/Users/user/Downloads/code/package.json
```

**Установить:**
```bash
npm install @anthropic-ai/sdk
npm install playwright
npm install cheerio
npm install @types/cheerio --save-dev
```

**Примечание:** `xlsx` может не понадобиться, если не используется функция экспорта

---

## Шаг 6: Создание директорий

### 6.1 Создать папку для services

```bash
mkdir -p /Users/user/Downloads/code/lib/services
```

### 6.2 Создать папку для API

```bash
mkdir -p /Users/user/Downloads/code/app/api/catalog/search-by-image
mkdir -p /Users/user/Downloads/code/app/api/catalog/search-by-url
```

---

## Шаг 7: Адаптация UI компонентов

### 7.1 Стиль модальных окон

**Текущий стиль в TechnoModern:**
- Белый фон (`bg-white`)
- Фиолетово-розовые акценты
- Тонкие рамки (`border-gray-100`)
- Минималистичный дизайн

**Что адаптировать из CatalogDropdown.tsx:**
- Модальные окна перенести на белый фон
- Градиентные кнопки заменить на фиолетово-розовые
- Убрать лишние декоративные элементы
- Сохранить функциональность drag&drop

---

## Шаг 8: Тестирование

### 8.1 Проверить API endpoints

```bash
# Тест поиска по изображению
curl -X POST http://localhost:3000/api/catalog/search-by-image \
  -H "Content-Type: application/json" \
  -d '{"image": "base64_encoded_image_here"}'

# Тест поиска по URL
curl -X POST http://localhost:3000/api/catalog/search-by-url \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.wildberries.ru/catalog/12345/detail.aspx"}'
```

### 8.2 Проверить UI

1. Открыть главную страницу
2. Кликнуть на иконку камеры
3. Загрузить изображение
4. Проверить результаты поиска

5. Кликнуть на иконку ссылки
6. Ввести URL товара
7. Проверить результаты поиска

---

## Структура файлов после интеграции

```
/Users/user/Downloads/code/
├── app/
│   └── api/
│       └── catalog/
│           ├── search-by-image/
│           │   └── route.ts          # API поиска по изображению
│           └── search-by-url/
│               └── route.ts          # API поиска по URL
├── components/
│   └── header-search.tsx            # Обновлен с модальными окнами
├── lib/
│   └── services/
│       ├── YandexVisionService.ts   # Распознавание изображений
│       ├── YandexGPTService.ts      # AI анализ
│       ├── UrlParserService.ts      # Парсинг URL
│       ├── HtmlParserService.ts     # Парсинг HTML
│       ├── ClaudeWebFetchService.ts # Claude AI парсинг
│       └── PlaywrightParserService.ts # Браузерный парсинг
├── .env.local                       # Переменные окружения
└── .env.example                     # Примеры переменных
```

---

## Порядок выполнения (для нового чата)

### Приоритет 1: Инфраструктура
1. Создать директории `lib/services`, `app/api/catalog/search-by-image`, `app/api/catalog/search-by-url`
2. Скопировать все сервисы из `lib/services`
3. Скопировать API routes

### Приоритет 2: Зависимости
4. Установить NPM пакеты
5. Добавить переменные окружения

### Приоритет 3: Frontend
6. Обновить `header-search.tsx` с логикой из `CatalogDropdown.tsx`
7. Адаптировать UI под текущий стиль

### Приоритет 4: Тестирование
8. Протестировать API endpoints
9. Протестировать UI
10. Проверить интеграцию с Supabase

---

## Важные замечания

### 1. Таблица в Supabase
Убедиться что в Supabase есть таблица `catalog_verified_products` или обновить название в:
- `/app/api/catalog/search-by-image/route.ts` (строка 114)
- `/app/api/catalog/search-by-url/route.ts` (строка 139)

На название из текущего проекта (возможно `products`)

### 2. Структура товаров
Проверить что поля товаров совпадают:
- `name` - название
- `description` - описание
- `is_active` - активность
- `category` - категория
- `image_url` - изображение
- `price` - цена

### 3. Yandex API ключи
Нужно получить в Yandex Cloud:
1. Создать сервисный аккаунт
2. Получить API ключ для Vision
3. Получить API ключ для GPT
4. Узнать Folder ID

Документация: https://cloud.yandex.ru/docs/vision/quickstart
Документация GPT: https://cloud.yandex.ru/docs/yandexgpt/quickstart

### 4. Claude API (опционально)
Получить на: https://console.anthropic.com/

---

## Контрольный список

- [ ] Созданы директории для services
- [ ] Скопированы все 6 сервисов
- [ ] Созданы директории для API
- [ ] Скопированы 2 API route
- [ ] Установлены NPM пакеты
- [ ] Добавлены переменные окружения в .env.local
- [ ] Обновлен .env.example
- [ ] Обновлен header-search.tsx с модальными окнами
- [ ] Проверено название таблицы Supabase
- [ ] Протестирован API поиска по изображению
- [ ] Протестирован API поиска по URL
- [ ] Протестирован UI загрузки изображения
- [ ] Протестирован UI ввода URL
- [ ] Проверена интеграция с каталогом товаров

---

## Команды для быстрого копирования

```bash
# Создать директории
mkdir -p /Users/user/Downloads/code/lib/services
mkdir -p /Users/user/Downloads/code/app/api/catalog/search-by-image
mkdir -p /Users/user/Downloads/code/app/api/catalog/search-by-url

# Скопировать сервисы
cp /Users/user/Desktop/godplisgomvp-forvercel/lib/services/YandexVisionService.ts /Users/user/Downloads/code/lib/services/
cp /Users/user/Desktop/godplisgomvp-forvercel/lib/services/YandexGPTService.ts /Users/user/Downloads/code/lib/services/
cp /Users/user/Desktop/godplisgomvp-forvercel/lib/services/UrlParserService.ts /Users/user/Downloads/code/lib/services/
cp /Users/user/Desktop/godplisgomvp-forvercel/lib/services/HtmlParserService.ts /Users/user/Downloads/code/lib/services/
cp /Users/user/Desktop/godplisgomvp-forvercel/lib/services/ClaudeWebFetchService.ts /Users/user/Downloads/code/lib/services/
cp /Users/user/Desktop/godplisgomvp-forvercel/lib/services/PlaywrightParserService.ts /Users/user/Downloads/code/lib/services/

# Скопировать API routes
cp /Users/user/Desktop/godplisgomvp-forvercel/app/api/catalog/search-by-image/route.ts /Users/user/Downloads/code/app/api/catalog/search-by-image/
cp /Users/user/Desktop/godplisgomvp-forvercel/app/api/catalog/search-by-url/route.ts /Users/user/Downloads/code/app/api/catalog/search-by-url/

# Установить зависимости
cd /Users/user/Downloads/code
npm install @anthropic-ai/sdk playwright cheerio
npm install @types/cheerio --save-dev
```

---

**Конец плана интеграции**
