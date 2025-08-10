import { Outlet, Link } from 'react-router-dom'

function Layout() {
  return (
    <div className="app-container">
      <header style={{ padding: '12px 0' }}>
        <nav style={{ display: 'flex', gap: 12 }}>
          <Link to="/">Home</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout

