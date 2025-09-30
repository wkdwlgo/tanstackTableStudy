import { Dialog, DialogContent } from '@radix-ui/react-dialog'
import {
  ColumnDef,
  type ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { mockUser } from '@/data/user'
import { useModal } from '@/hooks/useModal'
import { useUrlPagination } from '@/hooks/useUrlPagination'
import type { userDTO } from '@/types/user.types'

import UserModal from './userModal'
type User = userDTO['get']

export default function UserTable() {
  const [data] = useState<User[]>(() => [...mockUser])
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const { pagination, onPaginationChange } = useUrlPagination()
  const {
    isOpen: isModalOpen,
    modalData: selectedUser,
    openModal,
    handleOpenChange: setIsModalOpen,
  } = useModal<User>()
  const columnHelper = useMemo(() => createColumnHelper<User>(), [])

  const columns = useMemo<ColumnDef<User, unknown>[]>(
    () => [
      {
        id: 'userInfo',
        header: '사용자정보',
        columns: [
          columnHelper.accessor('first_name', {
            header: '사용자명',
            cell: (info) => {
              const first = info.getValue()
              const last = info.row.original.last_name
              return `${last}${first}`
            },
          }),
          columnHelper.accessor('authorities', {
            header: '사용자권한',
            cell: (info) => {
              const roles = info?.getValue()
              if (!Array.isArray(roles) || roles.length === 0) return ''
              return roles.includes('ROLE_ADMIN') ? 'ROLE_ADMIN' : 'ROLE_USER'
            },
            filterFn: (row, id, value) => {
              if (!value) return true
              const v = row.getValue<string>(id)
              return v.includes(value)
            },
          }),
          columnHelper.accessor('email', { header: '이메일' }),
          columnHelper.accessor('phone', {
            header: '휴대전화',
            cell: (info) => {
              const value = info.getValue()
              return value.replace(/\D/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
            },
          }),
        ],
      },
      {
        id: 'userSettings',
        header: '사용자 설정',
        columns: [
          columnHelper.accessor('sms_yn', {
            header: 'SMS수신',
            cell: ({ getValue }) => {
              const yes = getValue() === 'Y'
              return (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 10px',
                    borderRadius: 8,
                    background: yes ? '#22c55e' : '#3a3f45',
                    color: yes ? '#fff' : '#d1d5db',
                    fontWeight: 600,
                  }}
                >
                  <input type="checkbox" checked={yes} readOnly />
                  {yes ? 'Yes' : 'No'}
                </span>
              )
            },
            filterFn: (row, id, value) => {
              if (!value) return true
              const v = row.getValue<string>(id)
              return v === value
            },
          }),
          columnHelper.accessor('activated', {
            header: '활성',
            cell: ({ getValue }) => {
              const value = getValue()
              return (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 10px',
                    borderRadius: 8,
                    background: value ? '#22c55e' : '#3a3f45',
                    color: value ? '#fff' : '#d1d5db',
                    fontWeight: 600,
                  }}
                >
                  <input type="checkbox" checked={value} readOnly />
                  {value ? '활성' : '비활성'}
                </span>
              )
            },
            filterFn: (row, id, value) => {
              if (!value) return true
              const v = row.getValue<boolean>(id)
              const want = value === 'true'
              return v === want
            },
          }),
          columnHelper.accessor('lang_key', {
            header: '언어',
            filterFn: (row, id, value) => {
              if (!value) return true
              const v = row.getValue<string>(id)
              return v === value
            },
          }),
        ],
      },
      {
        id: 'others',
        header: '기타',
        columns: [
          columnHelper.accessor('created_date', { header: '생성일' }),
          columnHelper.accessor('reset_date', { header: '수정일' }),
          columnHelper.display({
            id: 'detail',
            header: '상세정보',
            cell: ({ row }) => {
              const user = row.original as User
              return (
                <Button variant="ghost" size="sm" onClick={() => openModal(user)}>
                  상세정보
                </Button>
              )
            },
          }),
        ],
      },
    ],
    [columnHelper],
  )

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, globalFilter, pagination },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <>
      <div className="py-1">
        <div className="py-3">
          <div className="flex flex-col gap-3">
            <h6>검색</h6>
            <div className="flex gap-3 items-center">
              <select
                className="h-9 px-2 rounded border border-gray-300"
                value={(table.getColumn('authorities')?.getFilterValue() as string) ?? ''}
                onChange={(e) => {
                  table.getColumn('authorities')?.setFilterValue(e.target.value)
                }}
              >
                <option value="">권한(전체)</option>
                <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                <option value="ROLE_USER">ROLE_USER</option>
              </select>
              <select
                className="h-9 px-2 rounded border border-gray-300"
                value={(table.getColumn('sms_yn')?.getFilterValue() as string) ?? ''}
                onChange={(e) => {
                  table.getColumn('sms_yn')?.setFilterValue(e.target.value)
                }}
              >
                <option value="">SMS수신(전체)</option>
                <option value="Y">YES</option>
                <option value="N">NO</option>
              </select>
              <select
                className="h-9 px-2 rounded border border-gray-300"
                value={(table.getColumn('activated')?.getFilterValue() as string) ?? ''}
                onChange={(e) => {
                  const v = e.target.value
                  table.getColumn('activated')?.setFilterValue(v === '' ? undefined : v)
                }}
              >
                <option value="">활성(전체)</option>
                <option value="true">활성</option>
                <option value="false">비활성</option>
              </select>
              <select
                className="h-9 px-2 rounded border border-gray-300"
                value={(table.getColumn('lang_key')?.getFilterValue() as string) ?? ''}
                onChange={(e) => {
                  const v = e.target.value
                  table.getColumn('lang_key')?.setFilterValue(v === '' ? undefined : v)
                }}
              >
                <option value="">언어(전체)</option>
                <option value="ko">ko</option>
                <option value="en">en</option>
              </select>
              <input
                className="h-9 px-3 rounded border border-gray-300 w-65"
                placeholder="검색: 이름/이메일/전화번호"
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
              <button
                className="h-9 py-2 rounded border border-gray-300"
                onClick={() => {
                  setGlobalFilter('')
                  table.resetColumnFilters()
                }}
              >
                필터 초기화
              </button>
              <Button variant="ghost" size="sm" onClick={() => openModal()}>
                ADD
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p>Total:{table.getRowCount()}</p>
            <div className="flex gap-1 items-center">
              <span>pageTerm:</span>
              <select
                className="h-9 px-2 rounded border border-gray-300"
                value={pagination.pageSize} // 👈 useMemo로 계산된 pagination 사용
                onChange={(e) => {
                  const newSize = Number(e.target.value)
                  // TanStack Table의 onPaginationChange 시그니처에 맞게 함수를 전달
                  table.setPagination((old) => ({
                    ...old,
                    pageIndex: 0, // pageSize가 변경될 땐 항상 첫 페이지(0)로 리셋
                    pageSize: newSize,
                  }))
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
        </div>

        <Table className="w-full text-sm">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort()
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan} // 헤더 그룹핑을 위한 병합처리
                      className={canSort ? 'cursor-pointer' : 'cursor-default'}
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                    >
                      <div className="flex gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === 'asc' ? (
                          <ChevronUp size={16} />
                        ) : header.column.getIsSorted() === 'desc' ? (
                          <ChevronDown size={16} />
                        ) : null}
                      </div>
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getPaginationRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-between py-3">
          <button
            className="px-4 py-2 rounded bg-gray-300"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            이전
          </button>
          <span>
            페이지 {pagination.pageIndex + 1} / {table.getPageCount()}
          </span>
          <button
            className="px-4 py-2 rounded bg-gray-300"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            다음
          </button>
        </div>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] fixed z-50 bg-white p-6 shadow-lg rounded-lg w-full max-w-md top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
          <UserModal user={selectedUser} />
        </DialogContent>
      </Dialog>
    </>
  )
}
