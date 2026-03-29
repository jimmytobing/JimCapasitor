const buildUnsplashUrl = (photoId) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&crop=faces&w=320&h=320&q=80`

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const malePhotoIds = [
  'photo-1715423058726-ddea1ec51b66',
  'photo-1656338997878-279d71d48f6e',
  'photo-1590086782792-42dd2350140d',
  'photo-1715412507413-c7416b47cacb',
  'photo-1506794778202-cad84cf45f1d',
  'photo-1500648767791-00dcc994a43e',
  'photo-1531891437562-4301cf35b7e4',
  'photo-1568602471122-7832951cc4c5',
  'photo-1525457136159-8878648a7ad0',
  'photo-1528892952291-009c663ce843',
  'photo-1596075780750-81249df16d19',
  'photo-1507003211169-0a1dd7228f2d',
  'photo-1508341591423-4347099e1f19',
  'photo-1692197393247-c76e1bd8f29e',
  'photo-1597073253968-1a87aef11ad1',
  'photo-1628697415196-c01f16651ec6',
  'photo-1617206710313-a4760e3ba711',
  'photo-1630446558530-b204617fd4ff',
  'photo-1698099402140-74eb1b9124c0',
  'photo-1613740105636-861212696b6c',
  'photo-1617206710182-b61283116d9a',
  'photo-1617206710688-e2f72026a52f',
  'photo-1641260783083-a0af6cf964ca',
  'photo-1592423297003-432e73ca8d39',
  'photo-1621273916093-f6fff3d1de90',
  'photo-1642341431810-386a471085cb',
]

const femalePhotoIds = [
  'photo-1544005313-94ddf0286df2',
  'photo-1614204424926-196a80bf0be8',
  'photo-1552699611-e2c208d5d9cf',
  'photo-1524255684952-d7185b509571',
  'photo-1634149134664-ca3598f29da5',
  'photo-1531746020798-e6953c6e8e04',
  'photo-1607569708758-0270aa4651bd',
  'photo-1438761681033-6461ffad8d80',
  'photo-1531123897727-8f129e1688ce',
  'photo-1509868918748-a554ad25f858',
  'photo-1604072366595-e75dc92d6bdc',
  'photo-1634149134165-6d679d80a800',
  'photo-1496203695688-3b8985780d6a',
  'photo-1529626455594-4ff0802cfb7e',
  'photo-1524502397800-2eeaad7c3fe5',
  'photo-1580489944761-15a19d654956',
  'photo-1557053910-d9eadeed1c58',
  'photo-1592621385612-4d7129426394',
  'photo-1610655507808-a59293f4e332',
  'photo-1609505848912-b7c3b8b4beda',
  'photo-1546961329-78bef0414d7c',
  'photo-1557053908-4793c484d06f',
  'photo-1614283233556-f35b0c801ef1',
  'photo-1581403341630-a6e0b9d2d257',
  'photo-1573496359142-b8d87734a5a2',
  'photo-1631377307692-36a9b6ae3ef6',
]

const sharedToneSeed = [
  'from-sky-400 to-blue-500',
  'from-emerald-400 to-teal-600',
  'from-amber-300 to-orange-500',
  'from-violet-400 to-indigo-600',
  'from-lime-400 to-green-600',
  'from-rose-400 to-red-500',
  'from-cyan-400 to-sky-600',
  'from-fuchsia-400 to-purple-600',
  'from-yellow-300 to-amber-500',
  'from-teal-400 to-cyan-600',
  'from-orange-400 to-red-600',
  'from-indigo-400 to-blue-600',
  'from-green-400 to-emerald-600',
  'from-pink-400 to-rose-600',
  'from-blue-300 to-cyan-500',
  'from-slate-500 to-gray-700',
  'from-red-400 to-orange-500',
  'from-purple-400 to-violet-600',
  'from-emerald-300 to-lime-500',
  'from-sky-300 to-indigo-500',
  'from-amber-400 to-yellow-500',
  'from-zinc-400 to-slate-600',
  'from-teal-300 to-emerald-500',
  'from-orange-300 to-amber-500',
  'from-cyan-300 to-blue-500',
  'from-lime-300 to-emerald-500',
]
const sharedTones = sharedToneSeed

function createLetterProfiles(photoIds, tones) {
  return Object.fromEntries(
    alphabet.map((letter, index) => [
      letter,
      {
        avatar: letter,
        avatarTone: tones[index],
        avatarImage: buildUnsplashUrl(photoIds[index]),
      },
    ])
  )
}

const genderLetterProfiles = {
  male: createLetterProfiles(malePhotoIds, sharedTones),
  female: createLetterProfiles(femalePhotoIds, sharedTones),
}

const defaultLetterProfiles = genderLetterProfiles.female

const normalizeKey = (value) => value?.toString().trim().toLowerCase() ?? ''
const normalizeGender = (value) => {
  const normalized = value?.toString().trim().toLowerCase() ?? ''

  if (normalized === 'pria') {
    return 'male'
  }

  if (normalized === 'wanita') {
    return 'female'
  }

  return normalized
}
const normalizeLetter = (value) => value?.toString().trim().slice(0, 1).toUpperCase() ?? ''

function getLetterProfile(letter) {
  return defaultLetterProfiles[letter] ?? null
}

export function getAvatarProfileByName(value) {
  const key = normalizeKey(value)
  const letter = normalizeLetter(key)
  return getLetterProfile(letter)
}

export function getDefaultContactAvatarProfile({ gender, name = '', avatar = '' } = {}) {
  const normalizedGender = normalizeGender(gender) || 'female'
  const letter = normalizeLetter(avatar || name)

  if (!letter) {
    return null
  }

  return genderLetterProfiles[normalizedGender]?.[letter] ?? defaultLetterProfiles[letter] ?? null
}

export function buildAvatarProfile(person) {
  const profile =
    getDefaultContactAvatarProfile(person) ??
    getAvatarProfileByName(person.id) ??
    getAvatarProfileByName(person.name)

  return {
    ...person,
    avatar: person.avatar ?? profile?.avatar ?? person.name?.slice(0, 1)?.toUpperCase() ?? '?',
    avatarTone: person.avatarTone ?? profile?.avatarTone ?? 'from-slate-300 to-slate-500',
    avatarImage: person.avatarImage ?? profile?.avatarImage ?? null,
  }
}
