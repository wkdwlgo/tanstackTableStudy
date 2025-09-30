import { PaginationState } from '@tanstack/react-table' // TanStack Table에서 타입 import
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

// TanStack Table의 PaginationState 타입을 그대로 사용합니다.
export function useUrlPagination() {
  const [searchParams, setSearchParams] = useSearchParams()

  // 1. URL 쿼리 파라미터에서 현재 페이지네이션 상태를 읽어옵니다.
  const pagination: PaginationState = useMemo(() => {
    // URL에서 pageIndex와 pageSize를 읽어오며, 값이 없으면 기본값 사용
    const pageIndex = parseInt(searchParams.get('pageIndex') ?? '0', 10)
    const pageSize = parseInt(searchParams.get('pageSize') ?? '10', 10)

    return {
      pageIndex: Math.max(0, pageIndex),
      pageSize: pageSize > 0 ? pageSize : 10,
    }
  }, [searchParams])

  // 2. TanStack Table의 onPaginationChange prop에 연결될 핸들러 함수입니다.
  const onPaginationChange = (
    updater: ((old: PaginationState) => PaginationState) | PaginationState,
  ) => {
    // updater 함수를 실행하여 새로운 상태를 얻습니다.
    // TanStack Table의 내부 setPagination 로직을 따릅니다.
    const newPagination = typeof updater === 'function' ? updater(pagination) : updater

    // URL 쿼리 파라미터를 업데이트합니다.
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set('pageIndex', String(newPagination.pageIndex))
    newParams.set('pageSize', String(newPagination.pageSize))

    // 브라우저 히스토리에 새로운 엔트리를 추가하는 대신 현재 엔트리를 대체(replace: true)하여
    // 뒤로 가기 버튼 클릭 시 불필요한 페이지 이동을 방지합니다.
    setSearchParams(newParams, { replace: true })
  }

  return {
    pagination,
    onPaginationChange,
  }
}
