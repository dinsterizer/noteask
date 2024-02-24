import { authProcedure } from '@api/core/trpc'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export const noteDetailRoute = authProcedure
  .input(
    z.object({
      noteId: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const note = await ctx.db.query.Notes.findFirst({
      where(t, { eq, and }) {
        return and(eq(t.tenantId, ctx.tenant.id), eq(t.id, input.noteId))
      },
    })

    if (!note) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Note not found',
      })
    }

    return {
      note,
    }
  })
