import { Route, Routes } from 'react-router-dom'
import Home from '../features/home/Home.jsx'
import InsideJokePage from '../features/inside-joke/InsideJokePage.jsx'
import DailyPage from '../features/daily/DailyPage.jsx'
import TodayFriendsPage from '../features/today-friends/TodayFriendsPage.jsx'
import CircleSquadPage from '../features/circle-squad/CircleSquadPage.jsx'
import MiniChallengePage from '../features/mini-challenge/MiniChallengePage.jsx'
import FriendRadarPage from '../features/friend-radar/FriendRadarPage.jsx'
import ActivitySuggestionPage from '../features/activity-suggestion/ActivitySuggestionPage.jsx'
import TodayMemoryPage from '../features/today-memory/TodayMemoryPage.jsx'
import FriendStatsPage from '../features/friend-stats/FriendStatsPage.jsx'
import FriendRankingPage from '../features/friend-ranking/FriendRankingPage.jsx'
import ActivityPage from '../features/activity/ActivityPage.jsx'
import ChatPage from '../features/chat/ChatPage.jsx'
import ChatDetailPage from '../features/chat/ChatDetailPage.jsx'

export default function AppRoutes({ showToast }) {
  return (
    <Routes
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Route path="/" element={<Home showToast={showToast} />} />
      <Route path="/inside-joke" element={<InsideJokePage />} />
      <Route path="/daily" element={<DailyPage showToast={showToast} />} />
      <Route path="/today-friends" element={<TodayFriendsPage showToast={showToast} />} />
      <Route path="/circle-squad" element={<CircleSquadPage showToast={showToast} />} />
      <Route path="/mini-challenge" element={<MiniChallengePage showToast={showToast} />} />
      <Route path="/friend-radar" element={<FriendRadarPage showToast={showToast} />} />
      <Route
        path="/activity-suggestion"
        element={<ActivitySuggestionPage showToast={showToast} />}
      />
      <Route path="/today-memory" element={<TodayMemoryPage />} />
      <Route path="/friend-stats" element={<FriendStatsPage showToast={showToast} />} />
      <Route path="/friend-ranking" element={<FriendRankingPage showToast={showToast} />} />
      <Route path="/activity" element={<ActivityPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/chat/:threadId" element={<ChatDetailPage />} />
    </Routes>
  )
}
