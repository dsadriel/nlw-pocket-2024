import dayjs from 'dayjs'
import { db } from '../db'
import { goalCompletions, goals } from '../db/schema'
import { count, gte, lte, and, eq, sql } from 'drizzle-orm'

export async function getWeekPendingGoals() {
  const lastDayOfWeek = dayjs().endOf('week').toDate()
  const firstDayOfWeek = dayjs().startOf('week').toDate()

  // Seleciona as goals criadas na semana atual ou antes desta.
  const goaslCreatedUpToWeek = db.$with('goas_created_up_to_week').as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        createdAt: goals.createdAt,
      })
      .from(goals)
      .where(lte(goals.createdAt, lastDayOfWeek))
  )

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
          lte(goalCompletions.createdAt, lastDayOfWeek)
        )
      )
  )

  const pendingGoals = await db
    .with(goaslCreatedUpToWeek, goalCompletionCount)
    .select({
      id: goaslCreatedUpToWeek.id,
      title: goaslCreatedUpToWeek.title,
      desiredWeeklyFrequency: goaslCreatedUpToWeek.desiredWeeklyFrequency,
      completionCount: sql /*sql*/`
        COALESCE(${goalCompletionCount.completionCount}, 0)
        `.mapWith(Number), // Se completionCount for null devolve 0
    })
    .from(goaslCreatedUpToWeek)
    .leftJoin(
      goalCompletionCount,
      eq(goalCompletionCount.goaldId, goaslCreatedUpToWeek.id)
    )

  return { pendingGoals }
}
