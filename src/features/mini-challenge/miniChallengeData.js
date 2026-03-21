import { buildAvatarProfile } from '../../shared/data/avatarDirectory.js'
import { currentUser } from '../chat/chatData.js'

export const challengeItems = [
  {
    id: 'quiz',
    icon: '⚡',
    title: 'Siapa paling cepat jawab quiz',
    description: 'Quick challenge untuk lihat siapa yang paling responsif di grup.',
    accent: 'bg-amber-50 text-amber-700',
  },
  {
    id: 'guess-image',
    icon: '🖼️',
    title: 'Tebak gambar',
    description: 'Main cepat dengan gambar random yang bikin semua ikut komentar.',
    accent: 'bg-pink-50 text-pink-700',
  },
  {
    id: 'truth-dare',
    icon: '🎲',
    title: 'Truth or dare',
    description: 'Challenge santai buat pecah suasana dan bikin chat makin hidup.',
    accent: 'bg-violet-50 text-violet-700',
  },
]

export const pollOptions = [
  buildAvatarProfile({
    name: currentUser.name,
    gender: currentUser.gender,
    votes: 32,
    avatar: currentUser.avatar,
    avatarTone: currentUser.avatarTone,
    avatarImage: currentUser.avatarImage,
  }),
  buildAvatarProfile({ name: 'Bayu', gender: 'pria', votes: 21 }),
  buildAvatarProfile({ name: 'Angga', gender: 'pria', votes: 27 }),
  buildAvatarProfile({ name: 'Ryan', gender: 'pria', votes: 14 }),
]
