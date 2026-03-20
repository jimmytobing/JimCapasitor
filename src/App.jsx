import { Navigate, Route, Routes } from 'react-router-dom'
import EntryPage from './pages/EntryPage.jsx'
import InstallPage from './pages/InstallPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import LegacyApp from './app/App.jsx'

const AUTH_STORAGE_KEY = 'wpa_google_auth'
const isLocalDevelopment =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

function ProtectedApp() {
  if (isLocalDevelopment) {
    return <LegacyApp />
  }

  const hasSession = Boolean(window.localStorage.getItem(AUTH_STORAGE_KEY))

  if (!hasSession) {
    return <Navigate to="/login" replace />
  }

  return <LegacyApp />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<EntryPage />} />
      <Route path="/install" element={<InstallPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/*" element={<ProtectedApp />} />
    </Routes>
  )
}
