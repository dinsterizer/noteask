import { TailwindEditor } from '@web/components/tailwind-editor'
import { ResizablePanel } from '@web/components/ui/resizable'
import { useSearchParam } from '@web/hooks/use-search-param'
import { WithPageMenuLayout } from '@web/layouts/with-page-menu'
import { useTenant } from '@web/lib/auth'
import { trpc } from '@web/lib/trpc'
import { JSONContent } from 'novel'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDebounce } from 'react-use'
import { match } from 'ts-pattern'
import { z } from 'zod'

const defaultJsonContent = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
}

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
              title: '',
              content: defaultJsonContent,
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

  const [title, setTitle] = useState('')
  const [content, setContent] = useState<JSONContent>(defaultJsonContent)

  useDebounce(
    () => {
      if (paramNew !== null) {
        createMutation.mutate({
          note: {
            id: params.noteId,
            title: title,
            content: content,
          },
        })
      } else {
        updateMutation.mutate({
          note: {
            id: params.noteId,
            title: title,
            content: content,
          },
        })
      }
    },
    5_000,
    [content, title],
  )

  return (
    <ResizablePanel minSize={50}>
      <WithPageMenuLayout>
        <div className="p-4 @container">
          {match(query)
            .with({ status: 'pending' }, () => 'TODO pending')
            .with({ status: 'error' }, () => 'TODO error')
            .with({ status: 'success' }, (query) => {
              return (
                <form onSubmit={(e) => e.preventDefault()} className="p-3 @3xl:p-12">
                  <input
                    name="name"
                    className="outline-none text-4xl"
                    maxLength={255}
                    placeholder="Untitled"
                    defaultValue={query.data.note.title}
                    onChange={(e) => {
                      setTitle(e.target.value)
                    }}
                  />

                  <div className="mt-8">
                    <TailwindEditor
                      initialContent={query.data.note.content}
                      onContentUpdate={setContent}
                    />
                  </div>
                </form>
              )
            })
            .exhaustive()}
        </div>
      </WithPageMenuLayout>
    </ResizablePanel>
  )
}
