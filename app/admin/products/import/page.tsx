import { AdminLayout } from '@/components/admin/AdminLayout'
import { BulkProductImport } from '@/components/admin/BulkProductImport'

export default function ImportProductsPage() {
  return (
    <AdminLayout
      title="Массовая загрузка"
      description="Импорт товаров из Excel или CSV"
    >
      <BulkProductImport />
    </AdminLayout>
  )
}
