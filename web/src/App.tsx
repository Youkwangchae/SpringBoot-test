import { useEffect, useState } from 'react'
import { createItem, listItems, returnItem, toUserMessage } from './api'
import { ItemForm } from './components/ItemForm'
import { ItemList } from './components/ItemList'
import type { CreateItemRequest, ItemResponse } from './types'
import './App.css'

type Tab = 'list' | 'form'

function App() {
  const [tab, setTab] = useState<Tab>('list')
  const [building, setBuilding] = useState('')
  const [items, setItems] = useState<ItemResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // 값이 바뀌면 목록을 다시 불러온다 (등록·반환 후 갱신용)
  const [reloadKey, setReloadKey] = useState(0)

  // effect에서는 외부 요청 결과만 반영하고, 로딩 전환은 이벤트 핸들러에서 한다
  useEffect(() => {
    let ignore = false

    listItems(building.trim() || undefined)
      .then((data) => {
        if (!ignore) setItems(data)
      })
      .catch((e: unknown) => {
        if (!ignore) setError(toUserMessage(e))
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [building, reloadKey])

  function reload() {
    setLoading(true)
    setError(null)
    setReloadKey((key) => key + 1)
  }

  function handleBuildingChange(value: string) {
    setBuilding(value)
    setLoading(true)
    setError(null)
  }

  async function handleReturn(id: number) {
    try {
      await returnItem(id)
      reload()
    } catch (e) {
      // 이미 반환된 물건(409) 등은 목록 위에 메시지로 보여 준다
      setError(toUserMessage(e))
    }
  }

  async function handleCreate(request: CreateItemRequest) {
    await createItem(request)
    setTab('list')
    reload()
  }

  return (
    <main className="app">
      <h1>분실물</h1>

      <nav className="tabs" aria-label="화면 전환">
        <button
          type="button"
          className="button"
          aria-pressed={tab === 'list'}
          onClick={() => setTab('list')}
        >
          목록
        </button>
        <button
          type="button"
          className="button"
          aria-pressed={tab === 'form'}
          onClick={() => setTab('form')}
        >
          등록
        </button>
      </nav>

      {tab === 'list' ? (
        <ItemList
          items={items}
          loading={loading}
          error={error}
          building={building}
          onBuildingChange={handleBuildingChange}
          onReturn={handleReturn}
        />
      ) : (
        <ItemForm onSubmit={handleCreate} />
      )}
    </main>
  )
}

export default App
