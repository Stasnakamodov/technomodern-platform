'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Логируем ошибку в console (в production можно отправлять в Sentry)
    console.error('Global error caught:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-primary/5 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Что-то пошло не так</h1>
          <p className="text-muted-foreground">
            Произошла непредвиденная ошибка. Пожалуйста, попробуйте обновить страницу.
          </p>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg text-left">
            <p className="text-sm font-mono text-destructive break-all">
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
            Попробовать снова
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
            Код ошибки: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
