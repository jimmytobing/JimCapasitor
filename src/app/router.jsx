import { Route, Routes } from 'react-router-dom'
import Home from '../features/home/Home.jsx'
import ExplorePage from '../features/explore/ExplorePage.jsx'
import DailyPage from '../features/daily/DailyPage.jsx'
import TodayFriendsPage from '../features/today-friends/TodayFriendsPage.jsx'
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
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/daily" element={<DailyPage showToast={showToast} />} />
      <Route path="/today-friends" element={<TodayFriendsPage showToast={showToast} />} />
      <Route path="/promo" element={<PromoPage />} />
      <Route path="/activity" element={<ActivityPage />} />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  )
}
