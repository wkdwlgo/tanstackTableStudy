import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import Dashboard from './pages/dashboard'
import SeverMonitoring from './pages/serverMonitoring'
import Tracking from './pages/tracking'
import HourTransactionStatics from './pages/transactionStatics/hourStatics'
import DayTransactionStatics from './pages/transactionStatics/dayStatics'
import MonthTransactionStatics from './pages/transactionStatics/monthStatics'
import HourTpsInfo from './pages/tps/hourInfo'
import DayTpsInfo from './pages/tps/dayInfo'
import MonthTpsInfo from './pages/tps/monthInfo'
import RealTimeTroubleLog from './pages/troubleLog/realTimeTroubleLog'
import TroubleLog from './pages/troubleLog/troubleLog'
import UserManagement from './pages/user/userManagement'
import InterfaceManagement from './pages/interface/interfaceManagement'
import InterfaceRoleManagement from './pages/interface/interfaceRoleManagement'
import LegacySystem from './pages/interface/legacySystem'
import Server from './pages/management/server'
import MonitoringConfig from './pages/management/monitoringConfig'
import Code from './pages/management/code'
import TroubleCode from './pages/management/troubleCode'

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/servermonitoring', element: <SeverMonitoring /> },
      { path: '/tracking', element: <Tracking /> },
      { path: '/transaction/hour', element: <HourTransactionStatics /> },
      { path: '/transaction/day', element: <DayTransactionStatics /> },
      { path: '/transaction/month', element: <MonthTransactionStatics /> },
      { path: '/tps/hour', element: <HourTpsInfo /> },
      { path: '/tps/day', element: <DayTpsInfo /> },
      { path: '/tps/month', element: <MonthTpsInfo /> },
      { path: '/troublelog/realtime', element: <RealTimeTroubleLog /> },
      { path: '/troublelog/record', element: <TroubleLog /> },
      { path: '/interface/management', element: <InterfaceManagement /> },
      { path: '/interface/rolemanagement', element: <InterfaceRoleManagement /> },
      { path: '/interface/legacysystem', element: <LegacySystem /> },
      { path: '/user/management', element: <UserManagement /> },
      { path: '/management/server', element: <Server /> },
      { path: '/management/monitoringcofig', element: <MonitoringConfig /> },
      { path: '/management/code', element: <Code /> },
      { path: '/management/troublecode', element: <TroubleCode /> },
      { index: true, element: <Dashboard /> },
    ],
  },
])
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
