// 백엔드 ItemResponse / CreateItemRequest DTO와 맞춘 타입
export type ItemStatus = 'STORED' | 'RETURNED'

export interface ItemResponse {
  id: number
  name: string
  building: string
  foundDate: string | null
  storage: string | null
  status: ItemStatus
}

export interface CreateItemRequest {
  name: string
  building: string
  foundDate?: string
  storage?: string
}
