import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout.jsx'
import HomePage from './pages/Home.jsx'
import NotFoundPage from './pages/NotFound.jsx'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
