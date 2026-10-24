import type { ItemResponse } from '../types'
import { StatusMessage } from './StatusMessage'

interface ItemListProps {
  items: ItemResponse[]
  loading: boolean
  error: string | null
  building: string
  onBuildingChange: (value: string) => void
  onReturn: (id: number) => void
}

export function ItemList({
  items,
  loading,
  error,
  building,
  onBuildingChange,
  onReturn,
}: ItemListProps) {
  return (
    <section className="item-list">
      <div className="field">
        <label htmlFor="building-filter">건물 필터</label>
        <input
          id="building-filter"
          type="text"
          value={building}
          placeholder="예: 공학관 (비우면 전체)"
          onChange={(event) => onBuildingChange(event.target.value)}
        />
      </div>

      {loading && <StatusMessage kind="loading">불러오는 중…</StatusMessage>}
      {error && <StatusMessage kind="error">{error}</StatusMessage>}

      {!loading && !error && items.length === 0 && (
        <p className="empty">등록된 물건이 없습니다.</p>
      )}

      <ul className="cards">
        {items.map((item) => (
          <li key={item.id} className="card">
            <h3>{item.name}</h3>
            <dl>
              <dt>건물</dt>
              <dd>{item.building}</dd>
              <dt>습득일</dt>
              <dd>{item.foundDate ?? '-'}</dd>
              <dt>보관 장소</dt>
              <dd>{item.storage ?? '-'}</dd>
              <dt>상태</dt>
              <dd>{item.status}</dd>
            </dl>
            {item.status === 'STORED' && (
              <button
                type="button"
                className="button"
                aria-label={`${item.name} 반환 처리`}
                onClick={() => onReturn(item.id)}
              >
                반환 처리
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
