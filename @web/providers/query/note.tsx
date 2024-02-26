import { useListenToTRPCMutation } from '@web/hooks/use-listen-to-trpc-mutation'
import { parseMessageFromTRPCClientError, trpc } from '@web/lib/trpc'
import { toast } from 'sonner'

export function NoteQuery() {
  const utils = trpc.useUtils()

  useListenToTRPCMutation(trpc.note.create, {
    onMutate({ id }) {
      // TODO: remove this toast and create in-page indicator instead
      toast.loading('Creating your note...', {
        id,
      })
    },
    onSuccess({ id }) {
      // TODO: add created note to list query

      toast.success('Your note has been created successfully!', {
        id,
      })
    },
    onError({ id, error }) {
      toast.error(parseMessageFromTRPCClientError(error), {
        id,
      })
    },
    onSettled() {
      utils.note.list.invalidate()
    },
  })

  return null
}
