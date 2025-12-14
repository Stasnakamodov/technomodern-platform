#!/bin/bash
# Скрипт для исправления прав node_modules и установки пакетов
# Запустите: ./fix-permissions.sh

echo "Исправляю права на node_modules..."
sudo chown -R $(whoami):staff node_modules

echo "Устанавливаю пакеты..."
npm install --legacy-peer-deps

echo "Готово!"
