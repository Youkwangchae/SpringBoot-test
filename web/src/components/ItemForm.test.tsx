import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ApiError } from '../api'
import { ItemForm } from './ItemForm'

describe('ItemForm', () => {
  it('이름이나 건물이 비어 있으면 등록 버튼이 비활성화된다', async () => {
    const user = userEvent.setup()
    render(<ItemForm onSubmit={vi.fn()} />)

    const submit = screen.getByRole('button', { name: '등록' })
    expect(submit).toBeDisabled()

    await user.type(screen.getByLabelText('물건 이름'), '지갑')
    expect(submit).toBeDisabled()

    await user.type(screen.getByLabelText('습득 건물'), '공학관')
    expect(submit).toBeEnabled()
  })

  it('모든 입력 필드는 label로 접근할 수 있다', () => {
    render(<ItemForm onSubmit={vi.fn()} />)

    expect(screen.getByLabelText('물건 이름')).toBeInTheDocument()
    expect(screen.getByLabelText('습득 건물')).toBeInTheDocument()
    expect(screen.getByLabelText('습득 일자')).toBeInTheDocument()
    expect(screen.getByLabelText('보관 장소')).toBeInTheDocument()
  })

  it('비워 둔 선택 항목은 제외하고 onSubmit을 호출한다', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<ItemForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('물건 이름'), '지갑')
    await user.type(screen.getByLabelText('습득 건물'), '공학관')
    await user.click(screen.getByRole('button', { name: '등록' }))

    expect(onSubmit).toHaveBeenCalledWith({ name: '지갑', building: '공학관' })
  })

  it('선택 항목을 입력하면 함께 전달한다', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<ItemForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('물건 이름'), '지갑')
    await user.type(screen.getByLabelText('습득 건물'), '공학관')
    await user.type(screen.getByLabelText('습득 일자'), '2026-10-20')
    await user.type(screen.getByLabelText('보관 장소'), '1층 경비실')
    await user.click(screen.getByRole('button', { name: '등록' }))

    expect(onSubmit).toHaveBeenCalledWith({
      name: '지갑',
      building: '공학관',
      foundDate: '2026-10-20',
      storage: '1층 경비실',
    })
  })

  it('등록이 실패하면 서버 메시지를 alert로 보여 준다', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockRejectedValue(new ApiError(400, '요청 값을 확인해 주세요.'))
    render(<ItemForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('물건 이름'), '지갑')
    await user.type(screen.getByLabelText('습득 건물'), '공학관')
    await user.click(screen.getByRole('button', { name: '등록' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('요청 값을 확인해 주세요.')
  })
})
