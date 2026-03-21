import { getAvatarProfileByName } from '../../shared/data/avatarDirectory.js'

export const feedItems = [
  {
    id: 'online',
    icon: '🟢',
    title: 'Siapa online',
    badge: '3 online',
    tone: 'bg-emerald-50 text-emerald-700',
    people: [
      {
        name: 'Bayu',
        gender: 'pria',
        detail: 'lagi aktif sekarang',
        handle: '@bayu',
        ...getAvatarProfileByName('Bayu'),
      },
      {
        name: 'Nanda',
        gender: 'wanita',
        detail: 'lagi aktif sekarang',
        handle: '@nanda',
        ...getAvatarProfileByName('Nanda'),
      },
      {
        name: 'Rafi',
        gender: 'pria',
        detail: 'lagi aktif sekarang',
        handle: '@rafi',
        ...getAvatarProfileByName('Rafi'),
      },
    ],
  },
  {
    id: 'birthday',
    icon: '🎂',
    title: 'Siapa ulang tahun',
    badge: '1 birthday',
    tone: 'bg-amber-50 text-amber-700',
    people: [
      {
        name: 'Angga',
        gender: 'pria',
        detail: 'ulang tahun hari ini',
        handle: '@angga',
        ...getAvatarProfileByName('Angga'),
      },
    ],
  },
  {
    id: 'gaming',
    icon: '🎮',
    title: 'Siapa lagi main game',
    badge: '4 gaming',
    tone: 'bg-violet-50 text-violet-700',
    games: [
      {
        name: 'Mobile Legend',
        players: [
          { name: 'Joshua', gender: 'pria', handle: '@joshua', ...getAvatarProfileByName('Joshua') },
          { name: 'Fikri', gender: 'pria', handle: '@fikri', ...getAvatarProfileByName('Fikri') },
        ],
      },
      {
        name: 'Roblox',
        players: [
          { name: 'Vina', gender: 'wanita', handle: '@vina', ...getAvatarProfileByName('Vina') },
          { name: 'Graciella', gender: 'wanita', handle: '@graciella', ...getAvatarProfileByName('Graciella') },
        ],
      },
    ],
  },
  {
    id: 'sad',
    icon: '💙',
    title: 'Siapa lagi sedih',
    badge: '1 need support',
    tone: 'bg-sky-50 text-sky-700',
    people: [
      {
        name: 'Dina',
        gender: 'wanita',
        detail: 'lagi sedih dan butuh teman cerita',
        handle: '@dina',
        ...getAvatarProfileByName('Dina'),
      },
    ],
  },
]
