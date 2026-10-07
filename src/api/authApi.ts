import { ApiError, post } from './httpClient'

export interface LoginCredentials {
  userServer: string
  userId: string
  userPassword: string
}

export interface AuthUser {
  id: string
  name: string
  jabatanName: string
  branchName: string
}

export interface AuthSession {
  token: string
  user: AuthUser
}

interface RawLoginResponse {
  status: string
  message?: string
  token?: string
  data?: Array<{ id: string; name: string; jabatan_name: string; branch_name: string }>
}

const STATIC_PAYLOAD = {
  from_origin: '*',
  envServer: 'dev',
  referrer: 'bodev.uruz.id',
}

export async function login(credentials: LoginCredentials): Promise<AuthSession> {
  const res = await post<RawLoginResponse>('/api/authV5', { ...STATIC_PAYLOAD, ...credentials })

  const profile = res.data?.[0]
  if (res.status !== 'OK' || !res.token || !profile) {
    throw new ApiError('http', res.message ?? 'Login gagal. Silakan coba lagi.')
  }

  return {
    token: res.token,
    user: {
      id: profile.id,
      name: profile.name,
      jabatanName: profile.jabatan_name,
      branchName: profile.branch_name,
    },
  }
}
