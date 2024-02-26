import { authProcedure } from '@api/core/trpc'
import { match } from 'ts-pattern'
import { z } from 'zod'

export const noteListRoute = authProcedure
  .input(
    z.object({
      sort: z.enum(['-createdAt', '+createdAt']).default('-createdAt'),
      limit: z.number().min(1).max(20).default(10),
      cursor: z.number().min(0).default(0),
    }),
  )
  .query(async ({ ctx, input }) => {
    const items = await ctx.db.query.Notes.findMany({
      where(t, { eq }) {
        return eq(t.tenantId, ctx.tenant.id)
      },
      orderBy(t, { desc, asc }) {
        return match(input.sort)
          .with('-createdAt', () => [desc(t.createdAt), asc(t.id)])
          .with('+createdAt', () => [asc(t.createdAt), asc(t.id)])
          .exhaustive()
      },
      limit: input.limit,
      offset: input.cursor,
    })

    return {
      items,
      nextCursor: items.length < input.limit ? null : input.cursor + input.limit,
    }
  })
