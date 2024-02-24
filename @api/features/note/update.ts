import { authProcedure } from '@api/core/trpc'
import { Notes } from '@api/database/schema'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

export const noteUpdateRoute = authProcedure
  .input(
    z.object({
      note: z.object({
        id: z.string(),
        title: z.string(),
      }),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    await ctx.db
      .update(Notes)
      .set({
        title: input.note.title,
      })
      .where(and(eq(Notes.tenantId, ctx.tenant.id), eq(Notes.id, input.note.id)))
  })
