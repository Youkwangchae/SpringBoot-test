import type { CreateItemRequest, ItemResponse } from './types'

// 서버가 돌려준 HTTP 상태 코드와 ProblemDetail의 detail 메시지를 함께 담는다
export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, init)

  if (!response.ok) {
    let message = `요청이 실패했습니다 (${response.status})`
    try {
      const body = (await response.json()) as { detail?: string }
      if (body.detail) message = body.detail
    } catch {
      // 본문이 JSON이 아니면 기본 메시지를 쓴다
    }
    throw new ApiError(response.status, message)
  }

  return (await response.json()) as T
}

export function listItems(building?: string): Promise<ItemResponse[]> {
  const query = building ? `?building=${encodeURIComponent(building)}` : ''
  return request<ItemResponse[]>(`/items${query}`)
}

export function createItem(body: CreateItemRequest): Promise<ItemResponse> {
  return request<ItemResponse>('/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export function returnItem(id: number): Promise<ItemResponse> {
  return request<ItemResponse>(`/items/${id}/return`, { method: 'PATCH' })
}

// 화면에 보여 줄 메시지. 서버 메시지가 있으면 그대로, 없으면 일반 안내
export function toUserMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message
  return '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
}
