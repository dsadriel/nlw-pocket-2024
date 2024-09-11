import { count, and, gte, lte, eq, sql } from 'drizzle-orm'
import { db } from '../db'
import { goalCompletions, goals } from '../db/schema'
import dayjs from 'dayjs'

interface CreateGoalCompletionRequest {
  goalId: string
}

export async function createGoalCompletion({ goalId }: CreateGoalCompletionRequest) {
  const lastDayOfWeek = dayjs().endOf('week').toDate()
  const firstDayOfWeek = dayjs().startOf('week').toDate()

  // Seleciona as completions dessa semana
  const goalCompletionCount = db.$with('goal_completion_count').as(
    db
      .select({
        completionCount: count(goalCompletions.id).as('completionCount'),
        goaldId: goalCompletions.goalId,
      })
      .from(goalCompletions)
      .groupBy(goalCompletions.goalId)
      .where(
        and(
          gte(goalCompletions.createdAt, firstDayOfWeek),
          lte(goalCompletions.createdAt, lastDayOfWeek),
          eq(goalCompletions.goalId, goalId)
        )
      )
  )

  const result = await db
    .with(goalCompletionCount)
    .select({
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      completionCount: sql /*sql*/`
        COALESCE(${goalCompletionCount.completionCount}, 0)
        `.mapWith(Number), // Se completionCount for null devolve 0
    })
    .from(goals)
    .leftJoin(goalCompletionCount, eq(goalCompletionCount.goaldId, goals.id))
    .where(eq(goals.id, goalId))
    .limit(1)

  const { completionCount, desiredWeeklyFrequency } = result[0]

  if (completionCount >= desiredWeeklyFrequency) {
    throw new Error('Goal already completed this week')
  }

  const insertResult = await db.insert(goalCompletions).values({ goalId }).returning()

  const goalCompletion = insertResult[0]
  return { goalCompletion }
}
