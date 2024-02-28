import { authProcedure } from '@api/core/trpc'
import { Notes } from '@api/database/schema'
import { JSONContentSchema } from '@api/lib/novel'
import { z } from 'zod'

export const noteCreateRoute = authProcedure
  .input(
    z.object({
      note: z.object({
        id: z.string().optional(),
        title: z.string(),
        content: JSONContentSchema,
      }),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const note = {
      tenantId: ctx.tenant.id,
      id: input.note.id ?? crypto.randomUUID(),
      title: input.note.title,
      content: input.note.content,
    } satisfies Partial<typeof Notes.$inferSelect>

    await ctx.db.insert(Notes).values(note).onDuplicateKeyUpdate({ set: note })

    return {
      note,
    }
  })
