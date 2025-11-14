# 🚀 Руководство по деплою на VPS сервер

**Сервер:** 155.212.164.197  
**Репозиторий:** https://github.com/Stasnakamodov/technomodern-platform

---

## 📋 Предварительные требования

- SSH доступ к серверу (root или sudo пользователь)
- Ubuntu/Debian сервер (или аналогичный)
- Минимум 1GB RAM, 10GB диск

---

## 🔧 Шаг 1: Подключение к серверу

```bash
ssh root@155.212.164.197
# Или
ssh admin@155.212.164.197
```

---

## 📦 Шаг 2: Установка необходимого ПО

### Обновление системы
```bash
apt update && apt upgrade -y
```

### Установка Node.js 20.x (LTS)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node --version  # Должна быть версия 20.x
npm --version
```

### Установка Git
```bash
apt install -y git
git --version
```

### Установка PM2 (Process Manager)
```bash
npm install -g pm2
pm2 --version
```

### Установка Nginx
```bash
apt install -y nginx
systemctl status nginx
systemctl enable nginx
```

---

## 📥 Шаг 3: Клонирование репозитория

```bash
# Создать директорию для проектов
mkdir -p /var/www
cd /var/www

# Клонировать приватный репозиторий
# Нужен GitHub Personal Access Token для приватных репо
git clone https://github.com/Stasnakamodov/technomodern-platform.git

# Если требуется аутентификация:
# git clone https://YOUR_GITHUB_TOKEN@github.com/Stasnakamodov/technomodern-platform.git

cd technomodern-platform
```

**Как получить GitHub Token:**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token → Выбрать `repo` scope
3. Скопировать token и использовать в команде выше

---

## ⚙️ Шаг 4: Настройка переменных окружения

```bash
# Создать .env.local файл
cat > .env.local << 'ENVEOF'
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://rbngpxwamfkunktxjtqh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmdweHdhbWZrdW5rdHhqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTk5NDcsImV4cCI6MjA2NDE3NTk0N30.cpW1S5MK7eOfYSZx9gHP_AP-wH5BRIigUFwlBYNA2MI

# Контакты компании
NEXT_PUBLIC_TELEGRAM_URL=https://t.me/technomodern_support
NEXT_PUBLIC_WHATSAPP_NUMBER=79991234567

# Unsplash API Configuration
UNSPLASH_ACCESS_KEY=hqFoDoRVmIBT9YnswQsPEyfwwC2MBMggezWakuIfz3M

# Pexels API Configuration
PEXELS_API_KEY=5jjdYAJtucoGUjLZMMQQMyHpyxios2sTTNXlj3UNFSzC8UTkoXxGQj2G
ENVEOF

# Проверить что файл создан
cat .env.local
```

---

## 🏗️ Шаг 5: Установка зависимостей и сборка

```bash
# Установить зависимости
npm install

# Собрать production версию
npm run build

# Проверить что build успешен
ls -la .next/
```

**Если есть ошибки при сборке:**
- Проверь что все environment variables установлены
- Проверь логи ошибок
- Запусти `npm run build` снова

---

## 🚀 Шаг 6: Запуск приложения через PM2

```bash
# Запустить приложение
pm2 start npm --name "technomodern" -- start

# Проверить статус
pm2 status

# Посмотреть логи
pm2 logs technomodern

# Сделать автозапуск при перезагрузке
pm2 startup
pm2 save
```

**PM2 команды:**
```bash
pm2 restart technomodern  # Перезапустить
pm2 stop technomodern     # Остановить
pm2 delete technomodern   # Удалить из PM2
pm2 logs technomodern     # Посмотреть логи
pm2 monit                 # Мониторинг в реальном времени
```

---

## 🌐 Шаг 7: Настройка Nginx

### Создать конфиг для сайта
```bash
cat > /etc/nginx/sites-available/technomodern << 'NGINXEOF'
server {
    listen 80;
    server_name 155.212.164.197;  # Или ваш домен

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Кеширование статики
    location /_next/static {
        proxy_cache STATIC;
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /public {
        proxy_cache STATIC;
        proxy_ignore_headers Cache-Control;
        proxy_cache_valid 60m;
        proxy_pass http://localhost:3000;
    }
}
NGINXEOF

# Включить сайт
ln -s /etc/nginx/sites-available/technomodern /etc/nginx/sites-enabled/

# Проверить конфигурацию
nginx -t

# Перезапустить Nginx
systemctl restart nginx
```

---

## ✅ Шаг 8: Проверка

### Проверить что все работает
```bash
# 1. Проверить что Node.js приложение запущено
pm2 status
# Должен быть status: online

# 2. Проверить что Nginx запущен
systemctl status nginx
# Должен быть active (running)

# 3. Проверить что порт 3000 слушается
netstat -tlnp | grep 3000
# Или
ss -tlnp | grep 3000

# 4. Проверить через curl
curl http://localhost:3000
# Должен вернуть HTML

# 5. Проверить через внешний IP
curl http://155.212.164.197
```

### Открыть в браузере
Откройте: `http://155.212.164.197`

Должна загрузиться главная страница проекта.

---

## 🔒 Шаг 9: Настройка HTTPS (опционально, но рекомендуется)

### Установка Certbot для Let's Encrypt SSL
```bash
# Установить Certbot
apt install -y certbot python3-certbot-nginx

# Получить SSL сертификат (если есть домен)
certbot --nginx -d your-domain.com

# Автообновление сертификата
certbot renew --dry-run
```

---

## 🔥 Шаг 10: Настройка Firewall

```bash
# Установить UFW (если нет)
apt install -y ufw

# Разрешить SSH, HTTP, HTTPS
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp

# Включить firewall
ufw enable

# Проверить статус
ufw status
```

---

## 🔄 Обновление проекта

```bash
# Перейти в директорию проекта
cd /var/www/technomodern-platform

# Получить последние изменения
git pull origin main

# Установить новые зависимости (если есть)
npm install

# Пересобрать
npm run build

# Перезапустить приложение
pm2 restart technomodern
```

---

## 📊 Мониторинг и логи

```bash
# Логи PM2
pm2 logs technomodern

# Логи Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Мониторинг системы
pm2 monit

# Использование диска
df -h

# Использование RAM
free -h

# Top процессы
htop
```

---

## 🐛 Troubleshooting

### Приложение не запускается
```bash
# Проверить логи
pm2 logs technomodern --lines 100

# Попробовать запустить вручную
npm start

# Проверить переменные окружения
cat .env.local
```

### Nginx возвращает 502 Bad Gateway
```bash
# Проверить что приложение запущено
pm2 status

# Проверить порт 3000
netstat -tlnp | grep 3000

# Перезапустить приложение
pm2 restart technomodern
```

### Нет подключения к Supabase
```bash
# Проверить переменные окружения
cat .env.local | grep SUPABASE

# Проверить доступность Supabase
curl https://rbngpxwamfkunktxjtqh.supabase.co
```

---

## 📝 Checklist готовности

- [ ] Node.js 20.x установлен
- [ ] Git установлен
- [ ] PM2 установлен
- [ ] Nginx установлен
- [ ] Репозиторий склонирован
- [ ] .env.local создан с правильными переменными
- [ ] npm install выполнен успешно
- [ ] npm run build выполнен успешно
- [ ] PM2 приложение запущено (status: online)
- [ ] Nginx настроен и запущен
- [ ] Firewall настроен
- [ ] Сайт открывается по IP в браузере
- [ ] Каталог загружается
- [ ] Контакты работают

---

## 🎉 Готово!

После выполнения всех шагов ваш проект будет доступен по адресу:
- **HTTP:** http://155.212.164.197
- **HTTPS:** https://your-domain.com (если настроен SSL)

**Следующие шаги:**
1. Настроить домен (если есть)
2. Настроить SSL сертификат
3. Настроить автоматический деплой через GitHub Actions
4. Настроить бэкапы базы данных

---

**Создано:** Claude Code  
**Дата:** 2025-11-13
