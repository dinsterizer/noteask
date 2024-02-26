import { noteCreateRoute } from './create'
import { noteDetailRoute } from './detail'
import { noteListRoute } from './list'
import { noteUpdateRoute } from './update'
import { router } from '@api/core/trpc'

export const noteRouter = router({
  list: noteListRoute,
  detail: noteDetailRoute,
  create: noteCreateRoute,
  update: noteUpdateRoute,
})
