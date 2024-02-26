import { Button } from '@web/components/ui/button'
import { Input } from '@web/components/ui/input'
import { ResizablePanel } from '@web/components/ui/resizable'
import { Textarea } from '@web/components/ui/textarea'
import { useSearchParam } from '@web/hooks/use-search-param'
import { WithPageMenuLayout } from '@web/layouts/with-page-menu'
import { useTenant } from '@web/lib/auth'
import { trpc } from '@web/lib/trpc'
import { useParams } from 'react-router-dom'
import { match } from 'ts-pattern'
import { z } from 'zod'

export function Component() {
  const params = z.object({ noteId: z.string() }).parse(useParams())
  const tenant = useTenant()

  const [paramNew, setParamNew] = useSearchParam('new')
  const isEnabledQuery = paramNew === null

  const query = trpc.note.detail.useQuery(
    {
      noteId: params.noteId,
    },
    {
      initialData: isEnabledQuery
        ? undefined
        : {
            note: {
              tenantId: tenant.id,
              id: params.noteId,
              title: null,
              updatedAt: new Date(),
              createdAt: new Date(),
            },
          },
      enabled: isEnabledQuery,
    },
  )

  const createMutation = trpc.note.create.useMutation({
    onSuccess() {
      setParamNew(null)
    },
  })
  const updateMutation = trpc.note.update.useMutation()

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (paramNew !== null) {
      createMutation.mutate({
        note: {
          id: params.noteId,
          title: 'TODO title',
        },
      })
    } else {
      updateMutation.mutate({
        note: {
          id: params.noteId,
          title: 'TODO title',
        },
      })
    }
  }

  return (
    <ResizablePanel minSize={50}>
      <WithPageMenuLayout>
        <div className="p-4">
          {match(query)
            .with({ status: 'pending' }, () => 'TODO pending')
            .with({ status: 'error' }, () => 'TODO error')
            .with({ status: 'success' }, () => {
              return (
                <form onSubmit={onSubmit} className="space-y-2">
                  <Input placeholder="Untitled" />

                  <Textarea placeholder="Type something..." />

                  <Button>Save</Button>
                </form>
              )
            })
            .exhaustive()}
        </div>
      </WithPageMenuLayout>
    </ResizablePanel>
  )
}
