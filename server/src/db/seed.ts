import { client, db } from '.'
import { goalCompletions, goals } from './schema'
import dayjs from 'dayjs'

async function seed() {
  await db.delete(goalCompletions)
  await db.delete(goals)

  const result = await db
    .insert(goals)
    .values([
      { title: 'Acordar cedo', desiredWeeklyFrequency: 5 },
      { title: 'Me exercitar', desiredWeeklyFrequency: 3 },
      { title: 'Meditar', desiredWeeklyFrequency: 2 },
      { title: 'Ler um livro', desiredWeeklyFrequency: 4 },
      { title: 'Cozinhar refeições saudáveis', desiredWeeklyFrequency: 3 },
      { title: 'Escrever no diário', desiredWeeklyFrequency: 2 },
      { title: 'Aprender algo novo', desiredWeeklyFrequency: 1 },
    ])
    .returning()

  const startOfWeek = dayjs().startOf('week')
  await db.insert(goalCompletions).values([
    { goalId: result[0].id, createdAt: startOfWeek.toDate() }, // Acordar cedo - Dia 1
    { goalId: result[0].id, createdAt: startOfWeek.add(1, 'day').toDate() }, // Acordar cedo - Dia 2
    { goalId: result[0].id, createdAt: startOfWeek.add(2, 'day').toDate() }, // Acordar cedo - Dia 3
    { goalId: result[0].id, createdAt: startOfWeek.add(3, 'day').toDate() }, // Acordar cedo - Dia 4
    { goalId: result[0].id, createdAt: startOfWeek.add(4, 'day').toDate() }, // Acordar cedo - Dia 5

    { goalId: result[1].id, createdAt: startOfWeek.toDate() }, // Me exercitar - Dia 1
    { goalId: result[1].id, createdAt: startOfWeek.add(2, 'day').toDate() }, // Me exercitar - Dia 3
    { goalId: result[1].id, createdAt: startOfWeek.add(4, 'day').toDate() }, // Me exercitar - Dia 5

    { goalId: result[2].id, createdAt: startOfWeek.add(1, 'day').toDate() }, // Meditar - Dia 2
    { goalId: result[2].id, createdAt: startOfWeek.add(3, 'day').toDate() }, // Meditar - Dia 4

    { goalId: result[3].id, createdAt: startOfWeek.add(3, 'day').toDate() }, // Ler um livro - Dia 4
    { goalId: result[4].id, createdAt: startOfWeek.add(4, 'day').toDate() }, // Cozinhar refeições saudáveis - Dia 5
    { goalId: result[5].id, createdAt: startOfWeek.add(5, 'day').toDate() }, // Escrever no diário - Dia 6
    { goalId: result[6].id, createdAt: startOfWeek.add(6, 'day').toDate() }, // Aprender algo novo - Dia 7
  ])
}

seed().finally(() => {
  client.end()
})
