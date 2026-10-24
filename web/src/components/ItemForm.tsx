import { useState, type FormEvent } from 'react'
import { toUserMessage } from '../api'
import type { CreateItemRequest } from '../types'
import { StatusMessage } from './StatusMessage'

interface ItemFormProps {
  onSubmit: (request: CreateItemRequest) => Promise<void>
}

export function ItemForm({ onSubmit }: ItemFormProps) {
  const [name, setName] = useState('')
  const [building, setBuilding] = useState('')
  const [foundDate, setFoundDate] = useState('')
  const [storage, setStorage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = name.trim() !== '' && building.trim() !== '' && !submitting

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    // 비워 둔 선택 항목은 보내지 않는다 (빈 문자열은 LocalDate 파싱에서 400이 된다)
    const request: CreateItemRequest = { name: name.trim(), building: building.trim() }
    if (foundDate) request.foundDate = foundDate
    if (storage.trim()) request.storage = storage.trim()

    try {
      await onSubmit(request)
    } catch (e) {
      setError(toUserMessage(e))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="item-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="item-name">물건 이름</label>
        <input
          id="item-name"
          type="text"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="item-building">습득 건물</label>
        <input
          id="item-building"
          type="text"
          required
          value={building}
          onChange={(event) => setBuilding(event.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="item-found-date">습득 일자</label>
        <input
          id="item-found-date"
          type="date"
          value={foundDate}
          onChange={(event) => setFoundDate(event.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="item-storage">보관 장소</label>
        <input
          id="item-storage"
          type="text"
          value={storage}
          onChange={(event) => setStorage(event.target.value)}
        />
      </div>

      {error && <StatusMessage kind="error">{error}</StatusMessage>}

      <button type="submit" className="button button--primary" disabled={!canSubmit}>
        등록
      </button>
    </form>
  )
}
