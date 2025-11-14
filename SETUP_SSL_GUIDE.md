# 🔐 Настройка SSL (HTTPS) для techno-modern.ru

## Предварительные требования

✅ DNS настроен и домен указывает на 155.212.164.197  
✅ Сайт работает по HTTP

---

## 📋 Шаг 1: Проверь что DNS работает

Перед настройкой SSL убедись что домен разрешается:

```bash
# На локальной машине
nslookup techno-modern.ru
nslookup www.techno-modern.ru

# Должны вернуть IP: 155.212.164.197
```

Можно также проверить в браузере:
- http://techno-modern.ru (должен открыться сайт)
- http://www.techno-modern.ru (должен открыться сайт)

---

## 🔧 Шаг 2: Установи Certbot на сервере

```bash
# Подключись к серверу
ssh root@155.212.164.197

# Установи Certbot
apt update
apt install -y certbot python3-certbot-nginx

# Проверь версию
certbot --version
```

---

## 🎯 Шаг 3: Получи SSL сертификат

```bash
# Остановим nginx временно (если нужно)
# systemctl stop nginx

# Получим сертификат для обоих доменов
certbot --nginx -d techno-modern.ru -d www.techno-modern.ru

# Certbot задаст несколько вопросов:
# 1. Email для уведомлений - введи свой email
# 2. Согласие с Terms of Service - введи Y
# 3. Согласие на рассылку - введи N (или Y если хочешь)
# 4. Redirect HTTP to HTTPS - выбери 2 (рекомендуется)
```

**Certbot автоматически:**
- Получит SSL сертификат
- Обновит конфигурацию Nginx
- Настроит автоматическое продление сертификата

---

## ✅ Шаг 4: Проверь что HTTPS работает

После успешной установки:

```bash
# Проверь статус Nginx
systemctl status nginx

# Проверь конфигурацию
nginx -t

# Перезапусти Nginx
systemctl restart nginx
```

Открой в браузере:
- https://techno-modern.ru ✅
- https://www.techno-modern.ru ✅
- http://techno-modern.ru (должен редиректить на HTTPS)

---

## 🔄 Автопродление сертификата

Certbot автоматически настраивает cron для продления:

```bash
# Проверь что автопродление работает
certbot renew --dry-run

# Если все ОК, увидишь:
# Congratulations, all simulated renewals succeeded
```

Сертификат будет автоматически продлеваться каждые 60 дней.

---

## 🐛 Troubleshooting

### Ошибка: "Domain not found"
**Решение:** Подожди пока DNS обновится (до 24 часов)

### Ошибка: "Port 80 is already in use"
**Решение:** 
```bash
systemctl stop nginx
certbot certonly --standalone -d techno-modern.ru -d www.techno-modern.ru
systemctl start nginx
```

### Ошибка: "Too many certificates"
**Решение:** Let's Encrypt имеет лимит 5 сертификатов в неделю на домен. Подожди неделю.

### Проверить статус сертификата:
```bash
certbot certificates
```

---

## 🔒 Финальная конфигурация Nginx

После установки Certbot, твой Nginx конфиг будет выглядеть так:

```nginx
server {
    listen 80;
    server_name techno-modern.ru www.techno-modern.ru;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name techno-modern.ru www.techno-modern.ru;

    ssl_certificate /etc/letsencrypt/live/techno-modern.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/techno-modern.ru/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

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
}
```

---

## ✅ Готово!

После настройки SSL твой сайт будет:
- ✅ Доступен по HTTPS
- ✅ Иметь зеленый замочек в браузере
- ✅ Автоматически редиректить HTTP → HTTPS
- ✅ Сертификат будет автоматически продлеваться

**Создано:** Claude Code  
**Дата:** 2025-11-13
