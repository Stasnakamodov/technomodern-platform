# 🚀 Быстрый старт - Поиск по картинке и ссылке

## 1️⃣ Исправить npm кэш (ОБЯЗАТЕЛЬНО!)

```bash
sudo chown -R 501:20 "/Users/user/.npm"
```

## 2️⃣ Установить зависимости

```bash
cd /Users/user/Downloads/code
rm -rf node_modules package-lock.json
npm install
```

## 3️⃣ Создать .env.local

```bash
cp .env.example .env.local
```

Откройте `.env.local` и заполните:

```env
# Yandex Cloud (https://console.cloud.yandex.ru/)
YANDEX_CLOUD_API_KEY=ваш_ключ
YANDEX_CLOUD_FOLDER_ID=ваш_folder_id

# Claude API (https://console.anthropic.com/)
ANTHROPIC_API_KEY=sk-ant-ваш_ключ
```

## 4️⃣ Запустить

```bash
npm run dev
```

Откройте http://localhost:3000

## 5️⃣ Протестировать

1. Нажмите на иконку 📷 (камера)
2. Загрузите фото товара
3. Нажмите "Найти товар"

## ❗ Если не работает

Читайте полную инструкцию: `SEARCH_INTEGRATION_COMPLETE.md`
