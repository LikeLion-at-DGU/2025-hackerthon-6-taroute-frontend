import { BrowserRouter } from 'react-router-dom'
import { SavedPlaceProvider } from './contexts/SavedPlaceContext.jsx'
import AppRoutes from './routes/AppRoutes.jsx'

function App() {
  return (
    <BrowserRouter>
      <SavedPlaceProvider>
        <AppRoutes />
      </SavedPlaceProvider>
    </BrowserRouter>
  )
}

export default App