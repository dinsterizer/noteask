import { sql } from 'drizzle-orm'
import {
  mysqlTableCreator,
  timestamp,
  varchar,
  char,
  primaryKey,
  json,
} from 'drizzle-orm/mysql-core'
import type { JSONContent } from 'novel'

/**
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 * @see https://orm.drizzle.team/kit-docs/conf#multi-project-schema
 */
const mysqlTable = mysqlTableCreator((name) => `noteask_${name}`)

export const Notes = mysqlTable(
  'notes',
  {
    tenantId: varchar('tenant_id', { length: 255 }).notNull(),
    id: char('id', { length: 36 })
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    updatedAt: timestamp('updated_at')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .onUpdateNow(),
    createdAt: timestamp('created_at')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),

    title: varchar('title', { length: 255 }).notNull(),
    content: json('content').$type<JSONContent>().notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.tenantId, t.id] }),
  }),
)
