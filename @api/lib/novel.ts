import { JSONContent } from 'novel'
import { expectType } from 'ts-expect'
import { z } from 'zod'

export const JSONContentSchema = z.custom<JSONContent>((v) => {
  const schema = z
    .object({
      type: z.string().optional(),
      attrs: z.record(z.string(), z.any()).optional(),
      marks: z
        .array(
          z
            .object({
              type: z.string(),
              attrs: z.record(z.string(), z.any()).optional(),
            })
            .and(z.record(z.string(), z.any())),
        )
        .optional(),
      text: z.string().optional(),
    })
    .and(z.record(z.string(), z.any()))

  expectType<z.infer<typeof schema>>(null as unknown as JSONContent)

  return schema.safeParse(v).success
})
