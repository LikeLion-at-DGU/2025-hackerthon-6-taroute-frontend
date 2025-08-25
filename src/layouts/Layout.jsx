import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function Layout() {
  useTranslation()
  return (
      <Outlet />
  )
}

export default Layout

