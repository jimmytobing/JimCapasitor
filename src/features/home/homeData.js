export function getAssetUrl(path) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}

export const groupPurchaseCards = [
  {
    title: 'Nitip Bahan Project Kelas 7',
    location: 'Bekasi',
    rating: '4.9',
    price: 'Kumpulin Rp 15k',
    unit: ' / siswa',
    description:
      'Daftar untuk ikut nitip bahan project kelas 7. Kumpulin duitnya ke HypeZone supaya benang wool, jarum, kain, dan manik-manik bisa di pesenin sekalian buat mu.',
    image: '/resources/images/hotel-1.jpg',
    gradient: 'from-emerald-500 to-cyan-500',
    action: 'Nitip Bahan Project Kelas 7',
  },
  {
    title: 'Nitip Pesenin Bakso Rusuk',
    location: 'Bekasi',
    rating: '4.8',
    price: 'Kumpulin Rp 22k',
    unit: ' / porsi',
    description:
      'Nitip pesenin Bakso Rusuk untuk di anterin pas lagi lunch-break, jadi kamu tinggal ambil dan makan bareng teman-teman.',
    image: '/resources/images/hotel-2.jpg',
    gradient: 'from-amber-500 to-orange-500',
    action: 'Nitip Pesenin Bakso Rusuk',
  },
  {
    title: 'Nitip Tiket Bioskop Nobar Circle',
    location: 'Bekasi',
    rating: '4.7',
    price: 'Kumpulin Rp 35k',
    unit: ' / orang',
    description:
      'Nitip pesenin tiket bioskop untuk Nobar Circle supaya kursinya berdekatan dan kamu tidak perlu rebutan jam tayang.',
    image: '/resources/images/hotel-1.jpg',
    gradient: 'from-indigo-500 to-sky-500',
    action: 'Nitip Tiket Bioskop Nobar Circle',
  },
  {
    title: 'Nitip Paket Buku Kelas 8',
    location: 'Bekasi',
    rating: '4.9',
    price: 'Kumpulin Rp 180k',
    unit: ' / paket',
    description:
      'Nitip pesenin paket buku untuk di prepare kenaikan ke kelas 8, jadi nanti pas udah naik kelas semua buku pelajaran tinggal di ambil di depan sekolah.',
    image: '/resources/images/hotel-2.jpg',
    gradient: 'from-rose-500 to-orange-400',
    action: 'Nitip Paket Buku Kelas 8',
  },
  {
    title: 'Nitip Print dan Jilid Tugas',
    location: 'Bekasi',
    rating: '4.8',
    price: 'Kumpulin Rp 12k',
    unit: ' / set',
    description:
      'Nitip print dan jilid tugas biar hasilnya rapi, lalu tinggal kamu ambil sebelum masuk kelas.',
    image: '/resources/images/suggested-1.jpg',
    gradient: 'from-teal-500 to-emerald-400',
    action: 'Nitip Print dan Jilid Tugas',
  },
  {
    title: 'Nitip Snack Box Buat Study Group',
    location: 'Bekasi',
    rating: '4.7',
    price: 'Kumpulin Rp 18k',
    unit: ' / box',
    description:
      'Nitip snack box buat study group supaya pas kumpul belajar semuanya sudah siap tanpa harus beli satu-satu.',
    image: '/resources/images/hotel-1.jpg',
    gradient: 'from-fuchsia-500 to-pink-400',
    action: 'Nitip Snack Box Buat Study Group',
  },
]

export const communitySuggestions = [
  {
    title: 'Bakso Rusuk Joss enak banget',
    by: 'Rekomendasi Bayu',
    rating: '4.8',
    tag: 'Kuliner',
    image: '/resources/images/suggested-1.jpg',
    action: 'Bakso Rusuk Joss',
  },
  {
    title: 'Summarecon Mall Bekasi seru banget',
    by: 'Rekomendasi Vina',
    rating: '4.7',
    tag: 'Hangout',
    image: '/resources/images/hotel-1.jpg',
    action: 'Summarecon Mall Bekasi',
  },
  {
    title: 'Game Stardew Valley keren',
    by: 'Rekomendasi Joshua',
    rating: '4.9',
    tag: 'Game',
    image: '/resources/images/hotel-2.jpg',
    action: 'Stardew Valley',
  },
]
