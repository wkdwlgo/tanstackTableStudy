import {
  type ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { mockUser } from '@/data/user'
import type { userDTO } from '@/types/user.types'
type User = userDTO['get']

export default function UserTable() {
  const [data, setData] = useState<User[]>(() => [...mockUser])
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const columnHelper = useMemo(() => createColumnHelper<User>(), [])

  const columns = useMemo<ColumnDef<User, any>[]>(
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
                <Button variant="ghost" size="sm" onClick={() => console.log(user)}>
                  상세정보
                </Button>
              )
            },
          }),
        ],
      },
    ],
    [columnHelper, setData],
  )

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="py-1">
      <div className="py-3">
        <div className="flex flex-col gap-3">
          <h6>검색</h6>
          <div className="flex gap-3">
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
          </div>
        </div>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className={headerGroup.depth === 0 ? 'bg-gray-200' : 'bg-gray-300'}
            >
              {headerGroup.headers.map((header) => {
                const isLeaf = header.column.getLeafHeaders?.()
                  ? header.column.getLeafHeaders().length === 0
                  : !header.columns
                const canSort = header.column.getCanSort()

                // 상위/하위 모두 colSpan 필수!
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={[
                      'border border-gray-400 py-3 px-7 text-center align-middle whitespace-nowrap',
                      canSort && header.isPlaceholder === false && isLeaf
                        ? 'cursor-pointer hover:bg-gray-100'
                        : 'cursor-default',
                    ].join(' ')}
                    onClick={
                      // 리프 헤더이고 정렬 가능한 경우에만 클릭 핸들러
                      canSort && isLeaf ? header.column.getToggleSortingHandler() : undefined
                    }
                    title={canSort && isLeaf ? '클릭해서 정렬' : undefined}
                  >
                    {header.isPlaceholder ? null : (
                      <span className="inline-flex items-center justify-center gap-1">
                        <span>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                        {isLeaf && canSort && (
                          <span className="ml-1 inline-flex w-4 h-4 items-center justify-center">
                            {header.column.getIsSorted() === 'asc' ? (
                              <ChevronUp size={16} />
                            ) : header.column.getIsSorted() === 'desc' ? (
                              <ChevronDown size={16} />
                            ) : null}
                          </span>
                        )}
                      </span>
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row, i) => (
            <tr key={row.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border border-gray-400 p-2 align-middle text-center">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}

          {table.getRowModel().rows.length === 0 && (
            <tr>
              <td
                colSpan={table.getAllLeafColumns().length}
                className="p-4 text-center text-gray-500"
              >
                데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
