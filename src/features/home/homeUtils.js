import { getRandomBadges } from '../../shared/utils/badges.js'

export function refillBottomNavBadges() {
  const nextBadges = getRandomBadges()
  localStorage.setItem('bottomNavBadges', JSON.stringify(nextBadges))
  window.dispatchEvent(new CustomEvent('bottomNavBadgesUpdate', { detail: nextBadges }))
}
