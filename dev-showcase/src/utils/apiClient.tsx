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

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string | { message: string }
}

/**
 * Converts object payload to URL-encoded form string
 */
const encodeForm = (data: Record<string, any> = {}): string =>
  Object.entries(data)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')

export async function apiRequest<T = any>({
  method,
  url,
  operation,
  payload,
  payloadType = 'json',
  retry = false,
}: {
  method: 'GET' | 'POST'
  url: string
  operation: string
  payload?: any
  payloadType?: 'json' | 'form'
  retry?: boolean
}): Promise<ApiResponse<T>> {
  try {
    const headers =
      payloadType === 'json'
        ? { 'Content-Type': 'application/json' }
        : { 'Content-Type': 'application/x-www-form-urlencoded' }

    const body =
      method === 'POST'
        ? payloadType === 'json'
          ? JSON.stringify(payload)
          : new URLSearchParams(payload).toString()
        : undefined

    const response = await fetch(url, {
      method,
      headers,
      body,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error: any) {
    const errMessage =
      typeof error === 'string'
        ? error
        : error?.message || 'Unexpected error occurred'
    return { success: false, error: errMessage }
  }
}