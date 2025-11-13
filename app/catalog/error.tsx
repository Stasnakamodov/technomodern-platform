'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home, Package } from 'lucide-react'
import Link from 'next/link'

export default function CatalogError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Catalog error caught:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-primary/5 px-4">
      <div className="max-w-lg w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Package className="w-10 h-10 text-primary" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Не удалось загрузить каталог</h1>
          <p className="text-muted-foreground">
            Возникла проблема при загрузке товаров из базы данных.
            Это может быть временная проблема с подключением.
          </p>
        </div>

        <div className="p-4 bg-muted/50 border border-border rounded-lg text-left">
          <p className="font-semibold mb-2 text-sm">Возможные причины:</p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Проблема с подключением к базе данных</li>
            <li>Временный сбой сервиса</li>
            <li>Некорректные данные в каталоге</li>
          </ul>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg text-left">
            <p className="text-xs font-semibold mb-1 text-destructive">
              Development Mode - Error Details:
            </p>
            <p className="text-xs font-mono text-destructive break-all">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            className="bg-primary hover:bg-primary/90"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Обновить каталог
          </Button>

          <Link href="/">
            <Button variant="outline">
              <Home className="w-4 h-4 mr-2" />
              На главную
            </Button>
          </Link>
        </div>

        {error.digest && (
          <p className="text-xs text-muted-foreground">
            ID ошибки: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
