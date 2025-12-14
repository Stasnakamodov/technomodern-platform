import { AdminLayout } from '@/components/admin/AdminLayout'
import { Card } from '@/components/ui/card'
import { Settings, Bell, Shield, Store } from 'lucide-react'

export default function SettingsPage() {
  return (
    <AdminLayout
      title="Настройки"
      description="Управление параметрами магазина"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Store className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Магазин</h3>
              <p className="text-sm text-gray-500">Основные настройки</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Название</span>
              <span className="font-medium text-gray-900">TechnoModern</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Сайт</span>
              <a href="https://techno-modern.ru" target="_blank" className="font-medium text-blue-600 hover:underline">
                techno-modern.ru
              </a>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Валюта</span>
              <span className="font-medium text-gray-900">RUB (₽)</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Bell className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Уведомления</h3>
              <p className="text-sm text-gray-500">Telegram интеграция</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Telegram бот</span>
              <span className="font-medium text-green-600">Подключен ✓</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Chat ID</span>
              <span className="font-mono text-gray-900">6725753966</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Заказы</span>
              <span className="font-medium text-gray-900">Отправляются в чат</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Безопасность</h3>
              <p className="text-sm text-gray-500">Доступ к админке</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Авторизация</span>
              <span className="font-medium text-gray-900">По паролю</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Сессия</span>
              <span className="font-medium text-gray-900">7 дней</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">JWT токен</span>
              <span className="font-medium text-green-600">Активен</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Система</h3>
              <p className="text-sm text-gray-500">Техническая информация</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Фреймворк</span>
              <span className="font-medium text-gray-900">Next.js 14</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">База данных</span>
              <span className="font-medium text-gray-900">Supabase</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Хостинг</span>
              <span className="font-medium text-gray-900">VPS (Nginx)</span>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}
