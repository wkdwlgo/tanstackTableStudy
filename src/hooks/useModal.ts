import { useCallback, useState } from 'react'

/**
 * 범용 모달 상태 관리 훅
 * @template T 모달에 전달할 데이터의 타입 (예: User 객체, string ID 등)
 * @returns {object} 모달 상태 및 제어 함수
 */
export function useModal<T = undefined>() {
  // 모달의 열림/닫힘 상태
  const [isOpen, setIsOpen] = useState(false)

  // 모달에 전달할 데이터 (null 또는 T 타입)
  const [modalData, setModalData] = useState<T | null>(null)

  /**
   * 모달을 열고 데이터를 설정합니다.
   * @param data 모달에 전달할 데이터 (선택적)
   */
  const openModal = useCallback((data?: T) => {
    if (data !== undefined) {
      setModalData(data)
    } else {
      setModalData(null) // 데이터 없이 모달을 열 때는 null로 설정 (예: 추가 모드)
    }
    setIsOpen(true)
  }, [])

  /**
   * Radix Dialog 등의 컴포넌트 onOpenChange prop에 연결하여 모달을 제어합니다.
   */
  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open)

    // 모달이 닫힐 때만 데이터를 초기화하여 메모리 누수를 방지
    if (!open) {
      setModalData(null)
    }
  }, [])

  /**
   * 모달을 닫고 데이터를 초기화합니다.
   */
  const closeModal = useCallback(() => {
    setIsOpen(false)
    setModalData(null)
  }, [])

  return {
    isOpen,
    modalData,
    openModal,
    closeModal,
    handleOpenChange,
  }
}
