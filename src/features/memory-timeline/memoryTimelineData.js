import { chatThreads } from '../chat/chatData.js'

function buildProfile(friend) {
  const nameScore = friend.name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
  const age = 12 + (nameScore % 4)
  const hobbySet = new Set()
  const circleLabels = []

  if (friend.circles?.includes('game-friend')) {
    hobbySet.add('main game')
    circleLabels.push('Game Friend')
  }
  if (friend.circles?.includes('school-friend')) {
    hobbySet.add('nongkrong')
    circleLabels.push('School Friend')
  }
  if (friend.circles?.includes('secret-circle')) {
    hobbySet.add('curhat')
    circleLabels.push('Secret Circle')
  }
  if (friend.circles?.includes('best-friend')) {
    hobbySet.add('chat malam')
    circleLabels.push('Best Friend')
  }

  if (hobbySet.size === 0) {
    hobbySet.add('ngobrol')
  }

  return {
    gender: friend.gender === 'wanita' ? 'Wanita' : 'Pria',
    age: `${age} tahun`,
    hobby: [...hobbySet].join(', '),
    circles: circleLabels.join(', ') || '-',
  }
}

function buildTimeline(friend) {
  const firstChatTime = friend.messages?.[0]?.time || '09:10'
  const sharedMoments = [
    {
      date: '12 Januari 2026',
      title: `Pertama kali kenal ${friend.name}`,
      detail: `Mulai saling notice dan masuk ke circle yang sama. Dari sini obrolan mulai sering terjadi.`,
    },
    {
      date: '4 Februari 2026',
      title: `Mulai chat bareng ${friend.name}`,
      detail: `Percakapan pertama yang tersimpan dimulai sekitar jam ${firstChatTime} dan terus berlanjut sampai jadi kebiasaan.`,
    },
    {
      date: '18 Maret 2026',
      title: 'Punya inside joke pertama',
      detail: 'Ada momen receh yang akhirnya sering diulang dan jadi bagian dari memori persahabatan.',
    },
  ]

  if (friend.circles?.includes('game-friend')) {
    sharedMoments.push({
      date: '7 April 2026',
      title: 'Mulai mabar rutin',
      detail: 'Sering ketemu di sesi game malam dan mulai punya ritme ngobrol yang konsisten.',
    })
  }

  if (friend.circles?.includes('school-friend')) {
    sharedMoments.push({
      date: '29 Mei 2026',
      title: 'Sering ketemu di aktivitas harian',
      detail: 'Mulai banyak momen bareng di luar chat, jadi hubungan terasa lebih dekat dan natural.',
    })
  }

  return sharedMoments
}

export function formatTimelineDate(date) {
  const [day, month, year] = date.split(' ')
  const monthMap = {
    Januari: 'Jan',
    Februari: 'Feb',
    Maret: 'Mar',
    April: 'Apr',
    Mei: 'Mei',
    Juni: 'Jun',
    Juli: 'Jul',
    Agustus: 'Agu',
    September: 'Sep',
    Oktober: 'Okt',
    November: 'Nov',
    Desember: 'Des',
  }

  return {
    day,
    month: monthMap[month] ?? month?.slice(0, 3) ?? '',
    year,
    short: `${day}-${monthMap[month] ?? month?.slice(0, 3) ?? ''}`,
  }
}

export function getMemoryTimelineData(friendId) {
  const friend = chatThreads.find((item) => item.id === friendId) ?? null

  return {
    friend,
    timeline: friend ? buildTimeline(friend) : [],
    profile: friend ? buildProfile(friend) : null,
  }
}
