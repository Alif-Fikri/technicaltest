import { Link } from 'react-router-dom'
import { Card } from '../components/ui'

export function NotFoundPage() {
  return (
    <main className="center-screen">
      <Card title="404" subtitle="Halaman tidak ditemukan">
        <Link to="/">Kembali ke beranda</Link>
      </Card>
    </main>
  )
}
