import { circleTitles, currentUser } from '../chat/chatData.js'

export const quizQuestions = [
  {
    id: 'favorite-food',
    question: `${currentUser.name} paling suka makan apa?`,
    description: 'Pilih jawaban yang paling benar. Teman yang menjawab benar akan dapat point.',
    options: [
      { id: 'bakso', label: 'Bakso', isCorrect: false },
      { id: 'seblak', label: 'Seblak', isCorrect: false },
      { id: 'sushi', label: 'Sushi', isCorrect: true },
      { id: 'mie-ayam', label: 'Mie ayam', isCorrect: false },
    ],
  },
  {
    id: 'favorite-hobby',
    question: `${currentUser.name} paling suka ngapain waktu senggang?`,
    description: 'Teman yang paling kenal kamu harusnya bisa jawab ini dengan cepat.',
    options: [
      { id: 'tidur', label: 'Tidur terus', isCorrect: false },
      { id: 'menyanyi-dance', label: 'Menyanyi dan dance', isCorrect: true },
      { id: 'renang', label: 'Renang', isCorrect: false },
      { id: 'masak', label: 'Masak', isCorrect: false },
    ],
  },
]

export function getCircleTitle(circleId) {
  return circleTitles[circleId] ?? circleTitles['best-friend']
}
