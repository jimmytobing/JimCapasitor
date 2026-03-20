import { Navigate, Route, Routes } from 'react-router-dom'
import Home from '../features/home/Home.jsx'
import JokesPage from '../features/jokes/JokesPage.jsx'
import DailyPage from '../features/daily/DailyPage.jsx'
import TodayFriendsPage from '../features/today-friends/TodayFriendsPage.jsx'
import CirclePage from '../features/circle/CirclePage.jsx'
import MiniChallengePage from '../features/mini-challenge/MiniChallengePage.jsx'
import FriendRadarPage from '../features/friend-radar/FriendRadarPage.jsx'
import ActivitySuggestionPage from '../features/activity-suggestion/ActivitySuggestionPage.jsx'
import MemoryPage from '../features/memory/MemoryPage.jsx'
import FriendStatsPage from '../features/friend-stats/FriendStatsPage.jsx'
import FriendRankingPage from '../features/friend-ranking/FriendRankingPage.jsx'
import FriendQuizPage from '../features/friend-quiz/FriendQuizPage.jsx'
import NewFriendQuizPage from '../features/friend-quiz/NewFriendQuizPage.jsx'
import MemoryTimelinePage from '../features/memory-timeline/MemoryTimelinePage.jsx'
import UserProfilePage from '../features/user-profile/UserProfilePage.jsx'
import EditUserProfilePage from '../features/user-profile/EditUserProfilePage.jsx'
import ActivityPage from '../features/activity/ActivityPage.jsx'
import ActivityDetailPage, { ActivityTypePage } from '../features/activity/ActivityDetailPage.jsx'
import EditActivityCategoryPage from '../features/activity/EditActivityCategoryPage.jsx'
import ChatPage from '../features/chat/ChatPage.jsx'
import ChatDetailPage from '../features/chat/ChatDetailPage.jsx'
import SettingsPage from '../features/settings/SettingsPage.jsx'

export default function AppRoutes({ showToast, themeMode, setThemeMode }) {
  return (
    <Routes
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Route path="/home" element={<Home showToast={showToast} themeMode={themeMode} />} />
      <Route path="/jokes" element={<JokesPage />} />
      <Route path="/daily" element={<DailyPage showToast={showToast} />} />
      <Route path="/today-friends" element={<TodayFriendsPage showToast={showToast} />} />
      <Route path="/circle" element={<CirclePage showToast={showToast} />} />
      <Route path="/mini-challenge" element={<MiniChallengePage showToast={showToast} />} />
      <Route path="/friend-radar" element={<FriendRadarPage showToast={showToast} />} />
      <Route
        path="/activity-suggestion"
        element={<ActivitySuggestionPage showToast={showToast} />}
      />
      <Route path="/memory" element={<MemoryPage />} />
      <Route path="/friend-stats" element={<FriendStatsPage showToast={showToast} />} />
      <Route path="/friend-quiz" element={<FriendQuizPage showToast={showToast} />} />
      <Route path="/friend-quiz/new" element={<NewFriendQuizPage showToast={showToast} />} />
      <Route path="/friend-ranking" element={<FriendRankingPage showToast={showToast} />} />
      <Route path="/memory-timeline/:friendId" element={<MemoryTimelinePage />} />
      <Route path="/user-profile" element={<UserProfilePage showToast={showToast} />} />
      <Route path="/user-profile/edit" element={<EditUserProfilePage showToast={showToast} />} />
      <Route path="/activity" element={<ActivityPage showToast={showToast} />} />
      <Route path="/activity/:activityId" element={<ActivityTypePage showToast={showToast} />} />
      <Route
        path="/activity/:activityId/edit-category"
        element={<EditActivityCategoryPage showToast={showToast} />}
      />
      <Route
        path="/activity/:activityId/new"
        element={<ActivityDetailPage showToast={showToast} />}
      />
      <Route
        path="/activity/:activityId/:entryId"
        element={<ActivityDetailPage showToast={showToast} />}
      />
      <Route path="/chat" element={<ChatPage themeMode={themeMode} />} />
      <Route path="/chat/:threadId" element={<ChatDetailPage themeMode={themeMode} />} />
      <Route
        path="/settings"
        element={
          <SettingsPage
            showToast={showToast}
            themeMode={themeMode}
            setThemeMode={setThemeMode}
          />
        }
      />
      <Route path="/inside-joke" element={<Navigate to="/jokes" replace />} />
      <Route path="/circle-squad" element={<Navigate to="/circle" replace />} />
      <Route path="/today-memory" element={<Navigate to="/memory" replace />} />
    </Routes>
  )
}
