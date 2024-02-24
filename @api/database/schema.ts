import { sql } from 'drizzle-orm'
import { mysqlTableCreator, timestamp, varchar, char, primaryKey } from 'drizzle-orm/mysql-core'

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

    title: varchar('title', { length: 255 }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.tenantId, t.id] }),
  }),
)
