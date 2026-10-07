import { useLocation, useNavigate } from 'react-router-dom'
import { Card } from '../components/ui'
import { LoginForm } from '../features/auth/LoginForm'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/dashboard'

  return (
    <main className="center-screen">
      <Card title="Masuk" subtitle="Silakan login untuk melanjutkan">
        <LoginForm onSuccess={() => navigate(redirectTo, { replace: true })} />
      </Card>
    </main>
  )
}
