import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Админ-панель | TechnoModern',
  robots: 'noindex, nofollow',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
