export const getRandomBadges = () => {
  const randomBadge = () => Math.floor(Math.random() * 9) + 1
  return {
    home: randomBadge(),
    explore: randomBadge(),
    promo: randomBadge(),
    activity: randomBadge(),
    chat: randomBadge(),
  }
}
