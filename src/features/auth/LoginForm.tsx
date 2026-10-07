import { useState } from 'react'
import { ApiError } from '../../api/httpClient'
import { Alert, Button, TextField } from '../../components/ui'
import { useForm } from '../../utils/useForm'
import { required } from '../../utils/validators'
import { useAuth } from './useAuth'

interface LoginFormProps {
  onSuccess: () => void
}

const initialValues = { userServer: '', userId: '', userPassword: '' }

const rules = {
  userServer: [required('User Server')],
  userId: [required('User ID')],
  userPassword: [required('Password')],
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const { values, handleChange, handleSubmit, fieldError } = useForm(
    initialValues,
    rules,
    async (data) => {
      setApiError(null)
      setSubmitting(true)
      try {
        await login({
          userServer: data.userServer.trim(),
          userId: data.userId.trim(),
          userPassword: data.userPassword,
        })
        onSuccess()
      } catch (err) {
        setApiError(err instanceof ApiError ? err.message : 'Terjadi kesalahan tak terduga.')
        setSubmitting(false)
      }
    },
  )

  const bind = (name: keyof typeof initialValues) => ({
    name,
    value: values[name],
    onChange: handleChange,
    error: fieldError(name),
  })

  return (
    <form onSubmit={handleSubmit} noValidate className="form">
      {apiError && <Alert variant="error">{apiError}</Alert>}
      <TextField label="User Server" autoComplete="organization" autoFocus {...bind('userServer')} />
      <TextField label="User ID" autoComplete="username" {...bind('userId')} />
      <TextField
        label="Password"
        type="password"
        autoComplete="current-password"
        {...bind('userPassword')}
      />
      <Button type="submit" loading={submitting} fullWidth>
        {submitting ? 'Memproses…' : 'Login'}
      </Button>
    </form>
  )
}
