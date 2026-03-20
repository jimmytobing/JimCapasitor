export const activityCategoriesByType = {
  'school-task': ['PR Sulit', 'Persiapan Ujian', 'Diskusi Kelompok'],
  'project-group': ['Presentasi', 'Prakarya', 'Lomba'],
  'study-help': ['Butuh Penjelasan', 'Cari Guru Private', 'Belajar Bareng'],
  'hangout-meet': ['Kerja Kelompok', 'Nongkrong', 'Main Bareng'],
  'need-request': ['Pinjam Barang', 'Cari Barang', 'Beli Kebutuhan'],
  'fun-challenge': ['Game', 'Challenge', 'Poll'],
}

export const predefinedActionOptionsByCategory = {
  'PR Sulit': ['Butuh Penjelasan', 'Belajar Bareng', 'Bagi Jawaban'],
  'Persiapan Ujian': ['Belajar Bareng', 'Latihan Soal', 'Bahas Kisi-Kisi'],
  'Diskusi Kelompok': ['Bagi Tugas', 'Bahas Materi', 'Jadwal Meet'],
  Presentasi: ['Bikin Slide', 'Latihan Presentasi', 'Bagi Narasi'],
  Prakarya: ['Cari Bahan', 'Bagi Alat', 'Susun Desain'],
  Lomba: ['Susun Tim', 'Cari Ide', 'Latihan Bareng'],
  'Butuh Penjelasan': ['Minta Teman Bantu', 'Cari Tutor', 'Belajar Bareng'],
  'Cari Guru Private': ['Tutor Online', 'Tutor Dekat Rumah', 'Rekomendasi Teman'],
  'Belajar Bareng': ['Online', 'Offline', 'Bahas Soal'],
  'Kerja Kelompok': ['Di Sekolah', 'Di Cafe', 'Di Rumah Teman'],
  Nongkrong: ['Cafe', 'Mall', 'Taman'],
  'Main Bareng': ['Arcade', 'Game Online', 'Olahraga'],
  'Pinjam Barang': ['Pinjam Dari Teman', 'Pinjam Dari Kelas Sebelah'],
  'Cari Barang': ['Tanya Circle', 'Cari Di Koperasi', 'Nitip Beli'],
  'Beli Kebutuhan': ['Nitip Beli', 'Beli Sendiri', 'Patungan'],
  Game: ['Mabar', 'Custom Room', 'Tournament Mini'],
  Challenge: ['Vote Dulu', 'Random Picker', 'Punishment'],
  Poll: ['Action', 'Comedy', 'Animation'],
}

export const activityTypes = [
  {
    id: 'school-task',
    icon: '1',
    emoji: '📚',
    title: 'School Task Activity',
    shortLabel: 'School Task',
    accent: 'from-blue-600 via-sky-500 to-cyan-400',
    description: 'Untuk PR, tugas, atau belajar bareng.',
    categories: activityCategoriesByType['school-task'],
    lastActivity: {
      id: 'pr-matematika-bab-5',
      title: 'PR Matematika Bab 5',
      description: 'Ada yang ngerti soal nomor 10-20?',
      time: 'Hari ini jam 19:00',
      participants: ['Jimmy', 'Bayu', 'Angga'],
      cta: 'Gabung belajar malam ini',
    },
    activeGroups: [
      {
        category: 'PR Sulit',
        items: [
          {
            id: 'pr-matematika-bab-5',
            title: 'PR Matematika Bab 5',
            description: 'Ada yang ngerti soal nomor 10-20?',
            time: 'Hari ini jam 19:00',
            participants: ['Jimmy', 'Bayu', 'Angga'],
            needs: [
              { label: 'Buku Matematika', status: 'sudah ada' },
              { label: 'Kalkulator', status: 'belum ada' },
              { label: 'Catatan Rumus', status: 'sudah ada' },
              { label: 'Pensil Cadangan', status: 'belum ada' },
            ],
            cta: 'Gabung belajar malam ini',
          },
          {
            id: 'pr-bahasa-indonesia',
            title: 'PR Bahasa Indonesia',
            description: 'Butuh bantu rangkum cerpen buat besok pagi.',
            time: 'Malam ini jam 20:00',
            participants: ['Vina', 'Joshua'],
            needs: [
              { label: 'Buku Paket Bahasa Indonesia', status: 'sudah ada' },
              { label: 'Lembar Tugas', status: 'sudah ada' },
              { label: 'Contoh Rangkuman', status: 'belum ada' },
            ],
            cta: 'Bantu rangkum bareng',
          },
        ],
      },
      {
        category: 'Persiapan Ujian',
        items: [
          {
            id: 'review-ipa-bab-pernapasan',
            title: 'Review IPA Bab Pernapasan',
            description: 'Mau latihan soal dan bahas kisi-kisi ulangan.',
            time: 'Besok jam 17:30',
            participants: ['Jimmy', 'Ryan', 'Bayu'],
            needs: [
              { label: 'Buku IPA', status: 'sudah ada' },
              { label: 'Bank Soal', status: 'belum ada' },
              { label: 'Catatan Bab Pernapasan', status: 'sudah ada' },
            ],
            cta: 'Masuk sesi review',
          },
        ],
      },
      {
        category: 'Diskusi Kelompok',
        items: [
          {
            id: 'diskusi-pkn-kelompok-2',
            title: 'Diskusi PKN Kelompok 2',
            description: 'Bagi tugas presentasi dan cocokin materi.',
            time: 'Jumat jam 16:00',
            participants: ['Angga', 'Nadia', 'Bayu'],
            needs: [
              { label: 'Materi PKN', status: 'sudah ada' },
              { label: 'Catatan Pembagian Tugas', status: 'belum ada' },
              { label: 'Referensi Tambahan', status: 'belum ada' },
            ],
            cta: 'Lihat pembagian tugas',
          },
        ],
      },
    ],
  },
  {
    id: 'project-group',
    icon: '2',
    emoji: '🛠️',
    title: 'Project / Tugas Kelompok',
    shortLabel: 'Project Group',
    accent: 'from-amber-500 via-orange-500 to-rose-400',
    description: 'Untuk kerja kelompok dan project sekolah.',
    categories: activityCategoriesByType['project-group'],
    lastActivity: {
      id: 'miniatur-rumah',
      title: 'Tugas Prakarya - Miniatur Rumah',
      description: 'Butuh karton, lem, sama ide desain.',
      needs: [
        { label: 'Karton', status: 'belum ada' },
        { label: 'Lem', status: 'sudah ada' },
        { label: 'Gunting', status: 'sudah ada' },
      ],
      cta: 'Lihat kebutuhan kelompok',
    },
    activeGroups: [
      {
        category: 'Presentasi',
        items: [
          {
            id: 'presentasi-sejarah',
            title: 'Presentasi Sejarah Kelompok 3',
            description: 'Butuh yang bantu bikin slide dan bagi narasi.',
            time: 'Sabtu jam 10:00',
            participants: ['Jimmy', 'Bayu', 'Vina'],
            needs: [
              { label: 'Laptop Untuk Presentasi', status: 'sudah ada' },
              { label: 'Template Slide', status: 'belum ada' },
              { label: 'Materi Sejarah Utama', status: 'sudah ada' },
              { label: 'Gambar Pendukung', status: 'belum ada' },
              { label: 'Pointer Presentasi', status: 'belum ada' },
            ],
            cta: 'Gabung susun presentasi',
          },
        ],
      },
      {
        category: 'Prakarya',
        items: [
          {
            id: 'miniatur-rumah',
            title: 'Tugas Prakarya - Miniatur Rumah',
            description: 'Butuh karton, lem, sama ide desain.',
            needs: [
              { label: 'Karton', status: 'belum ada' },
              { label: 'Lem', status: 'sudah ada' },
              { label: 'Gunting', status: 'sudah ada' },
            ],
            participants: ['Jimmy', 'Bayu', 'Angga'],
            cta: 'Lihat kebutuhan kelompok',
          },
        ],
      },
      {
        category: 'Lomba',
        items: [
          {
            id: 'lomba-poster-sekolah',
            title: 'Lomba Poster Sekolah',
            description: 'Cari ide desain, warna utama, dan siapa yang pegang final art.',
            participants: ['Vina', 'Joshua', 'Ryan'],
            needs: [
              { label: 'Brief Lomba', status: 'sudah ada' },
              { label: 'Referensi Desain', status: 'belum ada' },
              { label: 'Aplikasi Desain', status: 'sudah ada' },
              { label: 'Palet Warna', status: 'belum ada' },
            ],
            cta: 'Masuk tim lomba',
          },
        ],
      },
    ],
  },
  {
    id: 'study-help',
    icon: '3',
    emoji: '🧠',
    title: 'Study Help (Tutor / Belajar)',
    shortLabel: 'Study Help',
    accent: 'from-emerald-500 via-teal-500 to-cyan-400',
    description: 'Cari bantuan belajar, dari teman atau tutor.',
    categories: activityCategoriesByType['study-help'],
    lastActivity: {
      id: 'bantuan-ipa',
      title: 'Butuh bantuan IPA',
      description: 'Ga ngerti sistem pernapasan 😭',
      options: ['Minta teman bantu', 'Cari tutor (berbayar)'],
      cta: 'Pilih bantuan yang cocok',
    },
    activeGroups: [
      {
        category: 'Butuh Penjelasan',
        items: [
          {
            id: 'bantuan-ipa',
            title: 'Butuh bantuan IPA',
            description: 'Ga ngerti sistem pernapasan 😭',
            options: ['Minta teman bantu', 'Cari tutor (berbayar)'],
            needs: [
              { label: 'Buku IPA', status: 'sudah ada' },
              { label: 'Catatan Ringkas', status: 'belum ada' },
            ],
            cta: 'Pilih bantuan yang cocok',
          },
        ],
      },
      {
        category: 'Cari Guru Private',
        items: [
          {
            id: 'tutor-matematika-smp',
            title: 'Cari tutor Matematika SMP',
            description: 'Mau fokus pecahan dan aljabar untuk persiapan ujian.',
            time: 'Weekend ini',
            options: ['Tanya rekomendasi teman', 'Cari tutor dekat rumah'],
            needs: [
              { label: 'Jadwal Belajar', status: 'belum ada' },
              { label: 'Daftar Materi Prioritas', status: 'sudah ada' },
            ],
            cta: 'Cari tutor sekarang',
          },
        ],
      },
      {
        category: 'Belajar Bareng',
        items: [
          {
            id: 'belajar-bareng-bahasa-inggris',
            title: 'Belajar bareng Bahasa Inggris',
            description: 'Latihan speaking dan vocabulary buat presentasi.',
            participants: ['Jimmy', 'Vina', 'Bayu'],
            time: 'Kamis jam 18:30',
            needs: [
              { label: 'Daftar Vocabulary', status: 'sudah ada' },
              { label: 'Topik Speaking', status: 'belum ada' },
              { label: 'Latihan Dialog', status: 'belum ada' },
            ],
            cta: 'Gabung sesi belajar',
          },
        ],
      },
    ],
  },
  {
    id: 'hangout-meet',
    icon: '4',
    emoji: '☕',
    title: 'Hangout / Meet Activity',
    shortLabel: 'Hangout',
    accent: 'from-fuchsia-500 via-pink-500 to-rose-400',
    description: 'Untuk ketemuan, nongkrong, atau kerja kelompok offline.',
    categories: activityCategoriesByType['hangout-meet'],
    lastActivity: {
      id: 'kerja-kelompok-bing',
      title: 'Kerja kelompok Bahasa Inggris',
      location: 'Cafe dekat sekolah',
      time: 'Besok jam 16:00',
      participants: ['Jimmy', 'Bayu', 'Vina'],
      cta: 'Cek lokasi dan peserta',
    },
    activeGroups: [
      {
        category: 'Kerja Kelompok',
        items: [
          {
            id: 'kerja-kelompok-bing',
            title: 'Kerja kelompok Bahasa Inggris',
            location: 'Cafe dekat sekolah',
            time: 'Besok jam 16:00',
            participants: ['Jimmy', 'Bayu', 'Vina'],
            needs: [
              { label: 'Laptop', status: 'sudah ada' },
              { label: 'Catatan Kelompok', status: 'sudah ada' },
              { label: 'Meja Besar', status: 'belum ada' },
            ],
            cta: 'Cek lokasi dan peserta',
          },
        ],
      },
      {
        category: 'Nongkrong',
        items: [
          {
            id: 'nongkrong-summarecon',
            title: 'Nongkrong sore di Summarecon',
            description: 'Mau cari tempat duduk enak sambil ngobrol santai.',
            location: 'Summarecon Mall Bekasi',
            time: 'Sabtu jam 15:00',
            participants: ['Joshua', 'Vina', 'Ryan'],
            needs: [
              { label: 'List Tempat Nongkrong', status: 'belum ada' },
              { label: 'Budget Patungan', status: 'sudah ada' },
            ],
            cta: 'Lihat plan nongkrong',
          },
        ],
      },
      {
        category: 'Main Bareng',
        items: [
          {
            id: 'main-arcade-bareng',
            title: 'Main arcade bareng',
            description: 'Siapa yang mau ikut main basket dan racing game?',
            location: 'Timezone Bekasi',
            time: 'Minggu jam 14:00',
            participants: ['Jimmy', 'Bayu'],
            needs: [
              { label: 'Kartu Game', status: 'belum ada' },
              { label: 'Budget Main', status: 'sudah ada' },
            ],
            cta: 'Ikut main bareng',
          },
        ],
      },
    ],
  },
  {
    id: 'need-request',
    icon: '5',
    emoji: '🧾',
    title: 'Need / Request Activity',
    shortLabel: 'Need Request',
    accent: 'from-slate-700 via-slate-600 to-slate-400',
    description: 'Untuk minta barang, pinjam, atau beli.',
    categories: activityCategoriesByType['need-request'],
    lastActivity: {
      id: 'butuh-kalkulator',
      title: 'Butuh kalkulator',
      description: 'Besok ada ulangan 😭',
      options: ['Pinjam dari teman', 'Beli'],
      cta: 'Cari solusi tercepat',
    },
    activeGroups: [
      {
        category: 'Pinjam Barang',
        items: [
          {
            id: 'butuh-kalkulator',
            title: 'Butuh kalkulator',
            description: 'Besok ada ulangan 😭',
            options: ['Pinjam dari teman', 'Beli'],
            needs: [
              { label: 'Kalkulator', status: 'belum ada' },
              { label: 'Teman Yang Bisa Dipinjam', status: 'belum ada' },
            ],
            cta: 'Cari solusi tercepat',
          },
        ],
      },
      {
        category: 'Cari Barang',
        items: [
          {
            id: 'cari-buku-lks',
            title: 'Cari buku LKS IPS',
            description: 'Punya yang belum dipakai atau bisa dipinjam dulu?',
            options: ['Pinjam dari teman', 'Cari di koperasi'],
            needs: [
              { label: 'Buku LKS IPS', status: 'belum ada' },
              { label: 'Info Koperasi', status: 'sudah ada' },
            ],
            cta: 'Lihat opsi barang',
          },
        ],
      },
      {
        category: 'Beli Kebutuhan',
        items: [
          {
            id: 'beli-spidol-presentasi',
            title: 'Beli spidol buat presentasi',
            description: 'Butuh warna hitam dan merah untuk besok pagi.',
            options: ['Nitip beli', 'Beli sendiri pulang sekolah'],
            needs: [
              { label: 'Spidol Hitam', status: 'belum ada' },
              { label: 'Spidol Merah', status: 'belum ada' },
              { label: 'Uang Patungan', status: 'sudah ada' },
            ],
            cta: 'Atur pembelian',
          },
        ],
      },
    ],
  },
  {
    id: 'fun-challenge',
    icon: '6',
    emoji: '🎮',
    title: 'Fun / Challenge Activity',
    shortLabel: 'Fun Challenge',
    accent: 'from-violet-600 via-indigo-500 to-blue-400',
    description: 'Aktivitas santai / seru bersama teman.',
    categories: activityCategoriesByType['fun-challenge'],
    lastActivity: {
      id: 'truth-or-dare-malam-ini',
      title: 'Truth or Dare malam ini',
      participants: ['Jimmy', 'Bayu', 'Ryan'],
      description: 'Vote dulu siapa yang jadi host dan jam mainnya.',
      cta: 'Masuk ke challenge malam ini',
    },
    activeGroups: [
      {
        category: 'Game',
        items: [
          {
            id: 'mabar-stumble-guys',
            title: 'Mabar Stumble Guys',
            description: 'Kumpul di room jam 20:00, loser traktir es teh.',
            participants: ['Joshua', 'Bayu', 'Ryan'],
            time: 'Hari ini jam 20:00',
            needs: [
              { label: 'Koneksi Internet', status: 'sudah ada' },
              { label: 'Room Code', status: 'belum ada' },
            ],
            cta: 'Masuk room game',
          },
        ],
      },
      {
        category: 'Challenge',
        items: [
          {
            id: 'truth-or-dare-malam-ini',
            title: 'Truth or Dare malam ini',
            description: 'Vote dulu siapa yang jadi host dan jam mainnya.',
            participants: ['Jimmy', 'Bayu', 'Ryan'],
            needs: [
              { label: 'Daftar Pertanyaan', status: 'belum ada' },
              { label: 'Host Challenge', status: 'belum ada' },
            ],
            cta: 'Masuk ke challenge malam ini',
          },
        ],
      },
      {
        category: 'Poll',
        items: [
          {
            id: 'poll-film-nobar',
            title: 'Poll film buat nobar',
            description: 'Pilih film paling seru untuk weekend ini.',
            options: ['Action', 'Comedy', 'Animation'],
            needs: [
              { label: 'List Film Kandidat', status: 'sudah ada' },
              { label: 'Voting Peserta', status: 'belum ada' },
            ],
            cta: 'Ikut vote sekarang',
          },
        ],
      },
    ],
  },
]

export const activityTypeById = Object.fromEntries(
  activityTypes.map((activity) => [activity.id, activity])
)

export const findActivityEntry = (activityId, entryId) => {
  const activity = activityTypeById[activityId]
  if (!activity) return null

  for (const group of activity.activeGroups) {
    const entry = group.items.find((item) => item.id === entryId)
    if (entry) {
      return { activity, group, entry }
    }
  }

  return null
}
