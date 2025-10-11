/**
 * Universal API client with method control, payload mode (JSON or Form),
 * and optional retry using exponential backoff.
 *
 * Author: LazyNoons Dev Showcase
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type PayloadType = 'json' | 'form' // determines content-type

interface ApiRequestOptions<T = any> {
  method: HttpMethod
  url: string
  operation?: string
  payload?: T
  headers?: Record<string, string>
  retry?: boolean
  maxRetries?: number
  payloadType?: PayloadType
}

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  status?: number
}

/**
 * Converts object payload to URL-encoded form string
 */
const encodeForm = (data: Record<string, any> = {}): string =>
  Object.entries(data)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')

export async function apiRequest<T = any>(
  options: ApiRequestOptions
): Promise<ApiResponse<T>> {
  const {
    method,
    url,
    operation,
    payload,
    headers = {},
    retry = false,
    maxRetries = 3,
    payloadType = 'json',
  } = options

  let attempt = 0
  let backoffDelay = 500 // ms

  const log = (msg: string) =>
    console.info(`[API][${operation ?? 'UnknownOp'}] ${msg}`)

  const fetchAttempt = async (): Promise<ApiResponse<T>> => {
    try {
      let body: BodyInit | undefined
      const isGet = method === 'GET'

      const contentType =
        payloadType === 'form'
          ? 'application/x-www-form-urlencoded'
          : 'application/json'

      if (!isGet && payload) {
        body =
          payloadType === 'form'
            ? encodeForm(payload as Record<string, any>)
            : JSON.stringify(payload)
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': contentType,
          ...headers,
        },
        body: isGet ? undefined : body,
      })

      const text = await response.text()
      let data: any
      try {
        data = text ? JSON.parse(text) : null
      } catch {
        data = text
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${data?.message ?? 'Error'}`)
      }

      log(`✅ Success (Status: ${response.status})`)
      return { success: true, data, status: response.status }
    } catch (err: any) {
      log(`❌ Failed attempt ${attempt + 1}: ${err.message}`)

      if (retry && attempt < maxRetries) {
        attempt++
        log(`Retrying in ${backoffDelay}ms...`)
        await new Promise((res) => setTimeout(res, backoffDelay))
        backoffDelay *= 2
        return fetchAttempt()
      }

      return {
        success: false,
        error: err.message,
        status: err.status ?? 500,
      }
    }
  }

  return fetchAttempt()
}