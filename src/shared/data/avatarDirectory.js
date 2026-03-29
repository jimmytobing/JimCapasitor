const buildUnsplashUrl = (photoId) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&crop=faces&w=320&h=320&q=80`

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const neutralPhotoSeed = [
  'photo-1494790108377-be9c29b29330',
  'photo-1500648767791-00dcc994a43e',
  'photo-1506794778202-cad84cf45f1d',
  'photo-1488426862026-3ee34a7d66df',
  'photo-1506277886164-e25aa3f4ef7f',
  'photo-1504593811423-6dd665756598',
  'photo-1544005313-94ddf0286df2',
  'photo-1504257432389-52343af06ae3',
  'photo-1524504388940-b1c1722653e1',
  'photo-1517841905240-472988babdf9',
  'photo-1508214751196-bcfd4ca60f91',
  'photo-1438761681033-6461ffad8d80',
  'photo-1502685104226-ee32379fefbe',
  'photo-1521119989659-a83eee488004',
  'photo-1503443207922-dff7d543fd0e',
]

const malePhotoSeed = [
  'photo-1500648767791-00dcc994a43e',
  'photo-1506794778202-cad84cf45f1d',
  'photo-1506277886164-e25aa3f4ef7f',
  'photo-1504593811423-6dd665756598',
  'photo-1504257432389-52343af06ae3',
  'photo-1508214751196-bcfd4ca60f91',
  'photo-1502685104226-ee32379fefbe',
  'photo-1503443207922-dff7d543fd0e',
]

const femalePhotoSeed = [
  'photo-1494790108377-be9c29b29330',
  'photo-1488426862026-3ee34a7d66df',
  'photo-1544005313-94ddf0286df2',
  'photo-1524504388940-b1c1722653e1',
  'photo-1517841905240-472988babdf9',
  'photo-1438761681033-6461ffad8d80',
  'photo-1521119989659-a83eee488004',
]

const neutralToneSeed = [
  'from-pink-400 to-rose-500',
  'from-sky-400 to-blue-500',
  'from-amber-400 to-orange-500',
  'from-fuchsia-400 to-pink-500',
  'from-orange-400 to-amber-500',
  'from-violet-400 to-fuchsia-500',
  'from-cyan-400 to-blue-500',
  'from-emerald-400 to-teal-500',
  'from-slate-500 to-slate-700',
  'from-lime-400 to-emerald-500',
  'from-indigo-400 to-blue-500',
  'from-purple-400 to-violet-500',
  'from-teal-400 to-emerald-500',
  'from-violet-400 to-indigo-500',
  'from-rose-400 to-pink-500',
  'from-sky-400 to-cyan-500',
  'from-slate-300 to-slate-500',
]

const maleToneSeed = [
  'from-sky-400 to-blue-500',
  'from-indigo-400 to-blue-500',
  'from-teal-400 to-emerald-500',
  'from-slate-500 to-slate-700',
]

const femaleToneSeed = [
  'from-pink-400 to-rose-500',
  'from-fuchsia-400 to-pink-500',
  'from-purple-400 to-violet-500',
  'from-rose-400 to-pink-500',
]

function expandToAlphabet(seed) {
  return alphabet.map((_, index) => seed[index % seed.length])
}

const neutralPhotoIds = expandToAlphabet(neutralPhotoSeed)
const malePhotoIds = expandToAlphabet(malePhotoSeed)
const femalePhotoIds = expandToAlphabet(femalePhotoSeed)

const neutralTones = expandToAlphabet(neutralToneSeed)
const maleTones = expandToAlphabet(maleToneSeed)
const femaleTones = expandToAlphabet(femaleToneSeed)

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

const letterProfiles = createLetterProfiles(neutralPhotoIds, neutralTones)

const genderLetterProfiles = {
  pria: createLetterProfiles(malePhotoIds, maleTones),
  wanita: createLetterProfiles(femalePhotoIds, femaleTones),
}

const normalizeKey = (value) => value?.toString().trim().toLowerCase() ?? ''
const normalizeGender = (value) => value?.toString().trim().toLowerCase() ?? ''
const normalizeLetter = (value) => value?.toString().trim().slice(0, 1).toUpperCase() ?? ''

function getLetterProfile(letter) {
  return letterProfiles[letter] ?? null
}

export function getAvatarProfileByName(value) {
  const key = normalizeKey(value)
  const letter = normalizeLetter(key)
  return getLetterProfile(letter)
}

export function getDefaultContactAvatarProfile({ gender, name = '', avatar = '' } = {}) {
  const normalizedGender = normalizeGender(gender)
  const letter = normalizeLetter(avatar || name)

  if (!letter) {
    return null
  }

  return genderLetterProfiles[normalizedGender]?.[letter] ?? getLetterProfile(letter)
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
