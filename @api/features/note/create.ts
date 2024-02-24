import { authProcedure } from '@api/core/trpc'
import { Notes } from '@api/database/schema'
import { z } from 'zod'

export const noteCreateRoute = authProcedure
  .input(
    z.object({
      note: z.object({
        id: z.string().optional(),
        title: z.string(),
      }),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const note = {
      tenantId: ctx.tenant.id,
      id: input.note.id ?? crypto.randomUUID(),
      title: input.note.title,
    } satisfies Partial<typeof Notes.$inferSelect>

    await ctx.db.insert(Notes).values(note).onDuplicateKeyUpdate({ set: note })

    return {
      note,
    }
  })
