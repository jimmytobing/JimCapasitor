import { Navigate, Route, Routes } from 'react-router-dom'
import EntryPage from './pages/EntryPage.jsx'
import InstallPage from './pages/InstallPage.jsx'
import HomePage from './pages/HomePage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<EntryPage />} />
      <Route path="/install" element={<InstallPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
