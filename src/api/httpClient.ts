const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
const DEFAULT_TIMEOUT_MS = 15_000

export type ApiErrorKind = 'http' | 'network' | 'timeout'

export class ApiError extends Error {
  kind: ApiErrorKind
  status?: number

  constructor(kind: ApiErrorKind, message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.kind = kind
    this.status = status
  }
}

const FALLBACK_MESSAGES: Record<number, string> = {
  400: 'Permintaan tidak valid. Periksa kembali data yang diisi.',
  401: 'ID atau password salah.',
  403: 'Anda tidak memiliki akses.',
  404: 'Layanan tidak ditemukan.',
  429: 'Terlalu banyak percobaan. Coba lagi beberapa saat.',
}

function fallbackMessage(status: number) {
  if (FALLBACK_MESSAGES[status]) return FALLBACK_MESSAGES[status]
  if (status >= 500) return 'Terjadi gangguan pada server. Coba lagi nanti.'
  return `Permintaan gagal (HTTP ${status}).`
}

async function parseBody(res: Response): Promise<unknown> {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

function extractMessage(body: unknown): string | undefined {
  if (body && typeof body === 'object' && 'message' in body) {
    const { message } = body as { message: unknown }
    if (typeof message === 'string' && message.trim()) return message
  }
}

export async function post<TResponse, TBody = unknown>(
  path: string,
  body: TBody,
  { timeoutMs = DEFAULT_TIMEOUT_MS }: { timeoutMs?: number } = {},
): Promise<TResponse> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('timeout', 'Server tidak merespons. Periksa User Server lalu coba lagi.')
    }
    throw new ApiError('network', 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.')
  } finally {
    clearTimeout(timer)
  }

  const data = await parseBody(res)
  if (!res.ok) {
    throw new ApiError('http', extractMessage(data) ?? fallbackMessage(res.status), res.status)
  }
  return data as TResponse
}
