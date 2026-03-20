const buildUnsplashUrl = (photoId) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&crop=faces&w=320&h=320&q=80`

const avatarProfiles = {
  gracia: {
    avatar: 'G',
    avatarTone: 'from-pink-400 to-rose-500',
    avatarImage: buildUnsplashUrl('photo-1494790108377-be9c29b29330'),
  },
  bayu: {
    avatar: 'B',
    avatarTone: 'from-sky-400 to-blue-500',
    avatarImage: buildUnsplashUrl('photo-1500648767791-00dcc994a43e'),
  },
  angga: {
    avatar: 'A',
    avatarTone: 'from-amber-400 to-orange-500',
    avatarImage: buildUnsplashUrl('photo-1506794778202-cad84cf45f1d'),
  },
  vina: {
    avatar: 'V',
    avatarTone: 'from-fuchsia-400 to-pink-500',
    avatarImage: buildUnsplashUrl('photo-1488426862026-3ee34a7d66df'),
  },
  joshua: {
    avatar: 'J',
    avatarTone: 'from-orange-400 to-amber-500',
    avatarImage: buildUnsplashUrl('photo-1506277886164-e25aa3f4ef7f'),
  },
  fikri: {
    avatar: 'F',
    avatarTone: 'from-violet-400 to-fuchsia-500',
    avatarImage: buildUnsplashUrl('photo-1504593811423-6dd665756598'),
  },
  nanda: {
    avatar: 'N',
    avatarTone: 'from-cyan-400 to-blue-500',
    avatarImage: buildUnsplashUrl('photo-1544005313-94ddf0286df2'),
  },
  ryan: {
    avatar: 'R',
    avatarTone: 'from-emerald-400 to-teal-500',
    avatarImage: buildUnsplashUrl('photo-1504257432389-52343af06ae3'),
  },
  graciella: {
    avatar: 'G',
    avatarTone: 'from-pink-400 to-rose-500',
    avatarImage: buildUnsplashUrl('photo-1524504388940-b1c1722653e1'),
  },
  dina: {
    avatar: 'D',
    avatarTone: 'from-slate-500 to-slate-700',
    avatarImage: buildUnsplashUrl('photo-1517841905240-472988babdf9'),
  },
  caca: {
    avatar: 'C',
    avatarTone: 'from-rose-400 to-pink-500',
    avatarImage: buildUnsplashUrl('photo-1524504388940-b1c1722653e1'),
  },
  rafi: {
    avatar: 'R',
    avatarTone: 'from-lime-400 to-emerald-500',
    avatarImage: buildUnsplashUrl('photo-1508214751196-bcfd4ca60f91'),
  },
  dion: {
    avatar: 'D',
    avatarTone: 'from-indigo-400 to-blue-500',
    avatarImage: buildUnsplashUrl('photo-1502685104226-ee32379fefbe'),
  },
  fitri: {
    avatar: 'F',
    avatarTone: 'from-fuchsia-400 to-pink-500',
    avatarImage: buildUnsplashUrl('photo-1438761681033-6461ffad8d80'),
  },
  lola: {
    avatar: 'L',
    avatarTone: 'from-orange-400 to-amber-500',
    avatarImage: buildUnsplashUrl('photo-1521119989659-a83eee488004'),
  },
  zaki: {
    avatar: 'Z',
    avatarTone: 'from-sky-400 to-cyan-500',
    avatarImage: buildUnsplashUrl('photo-1503443207922-dff7d543fd0e'),
  },
  putri: {
    avatar: 'P',
    avatarTone: 'from-purple-400 to-violet-500',
    avatarImage: buildUnsplashUrl('photo-1544005313-94ddf0286df2'),
  },
  yusuf: {
    avatar: 'Y',
    avatarTone: 'from-teal-400 to-emerald-500',
    avatarImage: buildUnsplashUrl('photo-1500648767791-00dcc994a43e'),
  },
  kevin: {
    avatar: 'K',
    avatarTone: 'from-violet-400 to-indigo-500',
    avatarImage: buildUnsplashUrl('photo-1506794778202-cad84cf45f1d'),
  },
  salma: {
    avatar: 'S',
    avatarTone: 'from-pink-400 to-rose-500',
    avatarImage: buildUnsplashUrl('photo-1488426862026-3ee34a7d66df'),
  },
  bimo: {
    avatar: 'B',
    avatarTone: 'from-slate-300 to-slate-500',
    avatarImage: buildUnsplashUrl('photo-1506277886164-e25aa3f4ef7f'),
  },
  tara: {
    avatar: 'T',
    avatarTone: 'from-slate-300 to-slate-500',
    avatarImage: buildUnsplashUrl('photo-1517841905240-472988babdf9'),
  },
  mira: {
    avatar: 'M',
    avatarTone: 'from-slate-300 to-slate-500',
    avatarImage: buildUnsplashUrl('photo-1438761681033-6461ffad8d80'),
  },
  tono: {
    avatar: 'T',
    avatarTone: 'from-slate-300 to-slate-500',
    avatarImage: buildUnsplashUrl('photo-1502685104226-ee32379fefbe'),
  },
  raka: {
    avatar: 'R',
    avatarTone: 'from-slate-300 to-slate-500',
    avatarImage: buildUnsplashUrl('photo-1508214751196-bcfd4ca60f91'),
  },
  nisa: {
    avatar: 'N',
    avatarTone: 'from-slate-300 to-slate-500',
    avatarImage: buildUnsplashUrl('photo-1544005313-94ddf0286df2'),
  },
  leo: {
    avatar: 'L',
    avatarTone: 'from-slate-300 to-slate-500',
    avatarImage: buildUnsplashUrl('photo-1503443207922-dff7d543fd0e'),
  },
  maya: {
    avatar: 'M',
    avatarTone: 'from-slate-300 to-slate-500',
    avatarImage: buildUnsplashUrl('photo-1524504388940-b1c1722653e1'),
  },
}

const aliases = {
  me: 'gracia',
  'bimo-best': 'bimo',
  'tara-best': 'tara',
  'mira-school': 'mira',
  'tono-school': 'tono',
  'raka-game': 'raka',
  'nisa-game': 'nisa',
  'leo-secret': 'leo',
  'maya-secret': 'maya',
}

const normalizeKey = (value) => value?.toString().trim().toLowerCase() ?? ''

export function getAvatarProfileByName(value) {
  const key = normalizeKey(value)
  const aliasKey = aliases[key] ?? key
  return avatarProfiles[aliasKey] ?? null
}

export function buildAvatarProfile(person) {
  const profile = getAvatarProfileByName(person.id) ?? getAvatarProfileByName(person.name)

  return {
    ...person,
    avatar: person.avatar ?? profile?.avatar ?? person.name?.slice(0, 1)?.toUpperCase() ?? '?',
    avatarTone: person.avatarTone ?? profile?.avatarTone ?? 'from-slate-300 to-slate-500',
    avatarImage: person.avatarImage ?? profile?.avatarImage ?? null,
  }
}
