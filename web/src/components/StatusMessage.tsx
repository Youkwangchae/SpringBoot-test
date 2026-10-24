import type { ReactNode } from 'react'

interface StatusMessageProps {
  kind: 'loading' | 'error'
  children: ReactNode
}

// 로딩은 role="status", 에러는 role="alert"로 알려 준다 (스크린리더가 바로 읽음)
export function StatusMessage({ kind, children }: StatusMessageProps) {
  return (
    <p
      className={`status status--${kind}`}
      role={kind === 'error' ? 'alert' : 'status'}
    >
      {children}
    </p>
  )
}
