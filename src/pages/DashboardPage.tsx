import { useNavigate } from 'react-router-dom'
import { Button, Card } from '../components/ui'
import { useAuth } from '../features/auth/useAuth'

export function DashboardPage() {
  const { session, logout } = useAuth()
  const navigate = useNavigate()
  const user = session!.user

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <main className="center-screen">
      <Card title={`Halo, ${user.name}`} subtitle="Anda berhasil login">
        <dl className="info">
          <dt>User ID</dt>
          <dd>{user.id}</dd>
          <dt>Jabatan</dt>
          <dd>{user.jabatanName}</dd>
          <dt>Cabang</dt>
          <dd>{user.branchName}</dd>
        </dl>
        <Button variant="secondary" fullWidth onClick={handleLogout}>
          Logout
        </Button>
      </Card>
    </main>
  )
}
