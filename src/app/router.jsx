import { Route, Routes } from 'react-router-dom'
import Home from '../features/home/Home.jsx'
import Module1Page from '../features/module-1/Module1Page.jsx'
import Module2Page from '../features/module-2/Module2Page.jsx'
import PromoPage from '../features/promo/PromoPage.jsx'
import ActivityPage from '../features/activity/ActivityPage.jsx'
import ChatPage from '../features/chat/ChatPage.jsx'

export default function AppRoutes({ showToast }) {
  return (
    <Routes
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Route path="/" element={<Home showToast={showToast} />} />
      <Route path="/module-1" element={<Module1Page />} />
      <Route path="/module-2" element={<Module2Page />} />
      <Route path="/promo" element={<PromoPage />} />
      <Route path="/activity" element={<ActivityPage />} />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  )
}
