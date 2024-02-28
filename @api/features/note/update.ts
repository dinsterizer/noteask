import { authProcedure } from '@api/core/trpc'
import { Notes } from '@api/database/schema'
import { JSONContentSchema } from '@api/lib/novel'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

export const noteUpdateRoute = authProcedure
  .input(
    z.object({
      note: z.object({
        id: z.string(),
        title: z.string(),
        content: JSONContentSchema,
      }),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    await ctx.db
      .update(Notes)
      .set({
        title: input.note.title,
        content: input.note.content,
      })
      .where(and(eq(Notes.tenantId, ctx.tenant.id), eq(Notes.id, input.note.id)))
  })
