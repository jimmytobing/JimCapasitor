import { getAvatarProfileByName } from '../../shared/data/avatarDirectory.js'

export const nearbyFriends = [
  {
    name: 'Joshua',
    gender: 'pria',
    place: '0.4 km dari kamu',
    area: 'Lagi di cafe Sudirman',
    ...getAvatarProfileByName('Joshua'),
  },
  {
    name: 'Bayu',
    gender: 'pria',
    place: '0.9 km dari kamu',
    area: 'Dekat kampus barat',
    ...getAvatarProfileByName('Bayu'),
  },
  {
    name: 'Angga',
    gender: 'pria',
    place: '1.3 km dari kamu',
    area: 'Main di taman kota',
    ...getAvatarProfileByName('Angga'),
  },
]

export const onlineFriends = [
  {
    name: 'Ryan',
    gender: 'pria',
    activity: 'Online 2 menit lalu',
    status: 'Sedang buka chat',
    ...getAvatarProfileByName('Ryan'),
  },
  {
    name: 'Vina',
    gender: 'wanita',
    activity: 'Online sekarang',
    status: 'Baru update story',
    ...getAvatarProfileByName('Vina'),
  },
  {
    name: 'Graciella',
    gender: 'wanita',
    activity: 'Online 5 menit lalu',
    status: 'Lagi cek circle',
    ...getAvatarProfileByName('Graciella'),
  },
]
