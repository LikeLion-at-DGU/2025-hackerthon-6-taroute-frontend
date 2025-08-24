import { BrowserRouter } from 'react-router-dom'
import { SavedPlaceProvider } from './contexts/SavedPlaceContext.jsx'
import AppRoutes from './routes/AppRoutes.jsx'
import { RecoilRoot } from 'recoil'
import './lang/i18n'
import LanguageGate from './components/common/LanguageGate.jsx'

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <SavedPlaceProvider>
          <LanguageGate>
          <AppRoutes />
          </LanguageGate>
        </SavedPlaceProvider>
      </BrowserRouter>
    </RecoilRoot>
  )
}

export default App