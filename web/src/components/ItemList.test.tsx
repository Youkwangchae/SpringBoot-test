import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { ItemResponse } from '../types'
import { ItemList } from './ItemList'

const items: ItemResponse[] = [
  { id: 1, name: '지갑', building: '공학관', foundDate: '2026-10-20', storage: '1층 경비실', status: 'STORED' },
  { id: 2, name: '우산', building: '도서관', foundDate: null, storage: null, status: 'RETURNED' },
]

function renderList(overrides: Partial<Parameters<typeof ItemList>[0]> = {}) {
  const props = {
    items,
    loading: false,
    error: null,
    building: '',
    onBuildingChange: vi.fn(),
    onReturn: vi.fn(),
    ...overrides,
  }
  render(<ItemList {...props} />)
  return props
}

describe('ItemList', () => {
  it('항목의 이름·건물·습득일·보관 장소·상태를 보여 준다', () => {
    renderList()

    expect(screen.getByText('지갑')).toBeInTheDocument()
    expect(screen.getByText('공학관')).toBeInTheDocument()
    expect(screen.getByText('2026-10-20')).toBeInTheDocument()
    expect(screen.getByText('1층 경비실')).toBeInTheDocument()
    expect(screen.getByText('STORED')).toBeInTheDocument()
  })

  it('STORED 항목에만 반환 처리 버튼을 보여 준다', () => {
    renderList()

    const buttons = screen.getAllByRole('button', { name: /반환 처리/ })
    expect(buttons).toHaveLength(1)
    expect(buttons[0]).toHaveAccessibleName('지갑 반환 처리')
  })

  it('반환 처리 버튼을 누르면 해당 항목 id로 onReturn을 호출한다', async () => {
    const user = userEvent.setup()
    const { onReturn } = renderList()

    await user.click(screen.getByRole('button', { name: '지갑 반환 처리' }))

    expect(onReturn).toHaveBeenCalledWith(1)
  })

  it('건물 필터 입력은 label과 연결되고 값 변경을 알린다', async () => {
    const user = userEvent.setup()
    const { onBuildingChange } = renderList()

    const filter = screen.getByLabelText('건물 필터')
    await user.type(filter, '공')

    expect(onBuildingChange).toHaveBeenCalledWith('공')
  })

  it('로딩 중이면 로딩 문구를 보여 준다', () => {
    renderList({ items: [], loading: true })

    expect(screen.getByRole('status')).toHaveTextContent('불러오는 중')
  })

  it('에러 메시지(예: 409 안내)를 alert로 보여 준다', () => {
    renderList({ error: '이미 반환된 물건입니다. id=1' })

    expect(screen.getByRole('alert')).toHaveTextContent('이미 반환된 물건입니다. id=1')
  })
})
