import {
  BookText,
  Bug,
  ChartLine,
  ChartNoAxesCombined,
  Eye,
  Logs,
  Monitor,
  Settings,
  UserCheck,
} from 'lucide-react'

type NavIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>

export type NavItem = {
  title: string
  url: string
  icon?: NavIcon
  isActive?: boolean
  items?: NavItem[]
}
export const NavItems: NavItem[] = [
  { title: 'DASHBOARD', url: '/dashboard', icon: Logs },
  { title: '서버모니터링', url: '/servermonitoring', icon: Monitor },
  { title: 'TRACKING', url: '/tracking', icon: Eye },
  {
    title: '트랜잭션통계',
    url: '/transaction/hour',
    icon: ChartLine,
    items: [
      { title: '시간별통계', url: '/transaction/hour' },
      { title: '일일통계', url: '/transaction/day' },
      { title: '월별통계', url: '/transaction/month' },
    ],
  },
  {
    title: 'TPS정보',
    url: '/tps/hour',
    icon: ChartNoAxesCombined,
    items: [
      { title: 'TPS-시간별', url: '/tps/hour' },
      { title: 'TPS-일별', url: '/tps/day' },
      { title: 'TPS-월별', url: '/tps/month' },
    ],
  },
  {
    title: '장애 및 로그',
    url: '/troublelog/realtime',
    icon: Bug,
    items: [
      { title: '실시간장애현황', url: '/troublelog/realtime' },
      { title: '장애이력', url: '/troublelog/record' },
    ],
  },
  {
    title: '인터페이스관리',
    url: '/interface/management',
    icon: BookText,
    items: [
      { title: '인터페이스 관리', url: '/interface/management' },
      { title: '인터페이스 권한 관리', url: '/interface/rolemanagement' },
      { title: '레거시시스템', url: '/interface/legacysystem' },
    ],
  },
  {
    title: '사용자관리',
    url: '/user/usermanagement',
    icon: UserCheck,
    items: [{ title: '사용자관리', url: '/user/management' }],
  },
  {
    title: '시스템관리',
    url: '/management/server',
    icon: Settings,
    items: [
      { title: '서버관리', url: '/management/server' },
      { title: '모니터링설정', url: '/management/monitoringcofig' },
      { title: '코드관리', url: '/management/code' },
      { title: '장애코드관리', url: '/management/troublecode' },
    ],
  },
]
