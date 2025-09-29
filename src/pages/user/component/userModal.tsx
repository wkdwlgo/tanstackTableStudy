import { DialogClose, DialogContent, DialogDescription, DialogTitle } from '@radix-ui/react-dialog' // 필요한 다른 컴포넌트 추가

import { Button } from '@/components/ui/button'
import { DialogFooter, DialogHeader } from '@/components/ui/dialog'
import type { userDTO } from '@/types/user.types'

type User = userDTO['get']

export default function UserModal({ user }: { user: User }) {
  //   const defaultValues: User = {}

  //   const {
  //     register, // 필드를 폼에 등록하는 함수
  //     handleSubmit, // 폼 제출을 처리하는 함수
  //     formState: { errors, isSubmitting }, // 폼 상태 (에러, 로딩 상태 등)
  //   } = useForm<User>({
  //     defaultValues: defaultValues,
  //   })

  //   const onSubmit: SubmitHandler<User> = async (data) => {
  //     console.log('폼 제출 데이터:', data)

  //     if (user) {
  //       // 수정 로직 (API 호출 등)
  //       console.log('사용자 수정:', user.id)
  //     } else {
  //       // 추가 로직 (API 호출 등)
  //       console.log('사용자 추가')
  //     }
  //   }

  return (
    <DialogContent className="fixed z-50 bg-white p-6 shadow-lg rounded-lg w-full max-w-md top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
      <DialogHeader>
        <DialogTitle>{user ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <div>
        <p>옴뇸뇸</p>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            닫기
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}
