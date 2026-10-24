import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError, createItem, listItems, returnItem } from './api'

const fetchMock = vi.fn()

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  fetchMock.mockReset()
  vi.unstubAllGlobals()
})

describe('listItems', () => {
  it('건물 필터가 없으면 쿼리 없이 목록을 요청한다', async () => {
    fetchMock.mockResolvedValue(jsonResponse([]))

    await listItems()

    expect(fetchMock).toHaveBeenCalledWith('/items', undefined)
  })

  it('건물 필터는 URL 인코딩해서 전달한다', async () => {
    fetchMock.mockResolvedValue(jsonResponse([]))

    await listItems('공학관')

    expect(fetchMock).toHaveBeenCalledWith('/items?building=%EA%B3%B5%ED%95%99%EA%B4%80', undefined)
  })
})

describe('createItem', () => {
  it('JSON 본문으로 POST 요청하고 생성된 항목을 돌려준다', async () => {
    const created = { id: 1, name: '지갑', building: '공학관', foundDate: null, storage: null, status: 'STORED' }
    fetchMock.mockResolvedValue(jsonResponse(created, 201))

    const result = await createItem({ name: '지갑', building: '공학관' })

    expect(fetchMock).toHaveBeenCalledWith('/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '지갑', building: '공학관' }),
    })
    expect(result).toEqual(created)
  })
})

describe('returnItem', () => {
  it('이미 반환된 물건(409)이면 서버 detail 메시지를 담은 ApiError를 던진다', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ title: 'Conflict', status: 409, detail: '이미 반환된 물건입니다. id=1' }, 409),
    )

    const error = await returnItem(1).catch((e: unknown) => e)

    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ status: 409, message: '이미 반환된 물건입니다. id=1' })
  })
})
