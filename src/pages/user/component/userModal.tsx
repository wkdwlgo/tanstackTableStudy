import { DialogClose, DialogDescription, DialogTitle } from '@radix-ui/react-dialog' // 필요한 다른 컴포넌트 추가
import { SubmitHandler, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { DialogFooter, DialogHeader } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { userDTO } from '@/types/user.types'

type User = userDTO['get']

export default function UserModal({ user }: { user: User }) {
  const defaultValues: User = {
    id: user?.id || 0,
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    sms_yn: user?.sms_yn || 'N',
    activated: user?.activated ?? true, // 기본값 true
    lang_key: user?.lang_key || 'ko',
    created_date: user?.created_date || '',
    reset_date: user?.reset_date || '',
    authorities: user?.authorities || [],
  }
  const {
    register, // 필드를 폼에 등록하는 함수
    handleSubmit, // 폼 제출을 처리하는 함수
    formState: { errors, isSubmitting }, // 폼 상태 (에러, 로딩 상태 등)
  } = useForm<User>({
    defaultValues: defaultValues,
  })

  const onSubmit: SubmitHandler<User> = async (data) => {
    console.log('폼 제출 데이터:', data)

    if (user) {
      // 수정 로직 (API 호출 등)
      console.log('사용자 수정:', user.id)
    } else {
      // 추가 로직 (API 호출 등)
      console.log('사용자 추가')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogHeader>
        <DialogTitle>{user ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <div className="py-4 space-y-4">
        {/* 1. First Name 필드 */}
        <div className="space-y-1">
          <Label htmlFor="first_name">이름</Label>
          <Input
            id="first_name"
            // React Hook Form에 필드 등록 및 유효성 검사 규칙 적용
            {...register('first_name', { required: '이름은 필수 항목입니다.' })}
          />
          {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name.message}</p>}
        </div>

        {/* 2. Last Name 필드 */}
        <div className="space-y-1">
          <Label htmlFor="last_name">성</Label>
          <Input id="last_name" {...register('last_name', { required: '성은 필수 항목입니다.' })} />
          {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name.message}</p>}
        </div>
        {/* 3. Email 필드 */}
        <div className="space-y-1">
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            type="email"
            {...register('email', {
              required: '이메일은 필수 항목입니다.',
              pattern: {
                value: /^\S+@\S+$/i,
                message: '유효한 이메일 형식이 아닙니다.',
              },
            })}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={isSubmitting} variant="secondary">
          {isSubmitting ? '저장 중...' : user ? '수정 완료' : '추가'}
        </Button>
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            닫기
          </Button>
        </DialogClose>
      </DialogFooter>
    </form>
  )
}
