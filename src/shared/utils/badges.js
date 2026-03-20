export const getRandomBadges = () => {
  const randomBadge = () => Math.floor(Math.random() * 9) + 1
  return {
    home: randomBadge(),
    circle: randomBadge(),
    chat: randomBadge(),
    memory: randomBadge(),
    insideJoke: randomBadge(),
  }
}
