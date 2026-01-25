import { handleMockRequest, USE_MOCK_DATA } from './mock/handlers'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
}

interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

type UnauthorizedHandler = () => void | Promise<void>

class ApiClient {
  private token: string | null = null
  private unauthorizedHandlers = new Set<UnauthorizedHandler>()

  setToken(token: string | null) {
    this.token = token
  }

  onUnauthorized(handler: UnauthorizedHandler) {
    this.unauthorizedHandlers.add(handler)
    return () => {
      this.unauthorizedHandlers.delete(handler)
    }
  }

  getToken(): string | null {
    return this.token
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { body, headers: customHeaders, method = 'GET', ...restOptions } = options

    // Use mock data in development when no API URL is configured
    if (USE_MOCK_DATA) {
      try {
        return await handleMockRequest<T>(endpoint, method, body)
      }
      catch (error) {
        const err = error as { status?: number, message?: string }
        throw new ApiClientError(
          err.message || 'Mock API error',
          err.status || 500,
        )
      }
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...customHeaders,
    }

    if (this.token) {
      (headers as Record<string, string>).Authorization = `Bearer ${this.token}`
    }

    const config: RequestInit = {
      ...restOptions,
      method,
      headers,
    }

    if (body) {
      config.body = JSON.stringify(body)
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: 'An error occurred',
      }))

      // If unauthorized, clear token
      if (response.status === 401) {
        this.token = null
        this.unauthorizedHandlers.forEach((handler) => {
          try {
            void handler()
          }
          catch {
            // Ignore handler errors to not mask the original request error
          }
        })
      }

      throw new ApiClientError(error.message, response.status, error.errors)
    }

    // Handle empty responses
    const text = await response.text()
    if (!text) {
      return {} as T
    }

    return JSON.parse(text) as T
  }

  get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body })
  }

  patch<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body })
  }

  delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

export class ApiClientError extends Error {
  status: number
  errors?: Record<string, string[]>

  constructor(
    message: string,
    status: number,
    errors?: Record<string, string[]>,
  ) {
    super(message)
    this.name = 'ApiClientError'
    this.status = status
    this.errors = errors
  }
}

export const apiClient = new ApiClient()
