import { TailwindEditor } from '@web/components/tailwind-editor'
import { ResizablePanel } from '@web/components/ui/resizable'
import { useSearchParam } from '@web/hooks/use-search-param'
import { WithPageMenuLayout } from '@web/layouts/with-page-menu'
import { useTenant } from '@web/lib/auth'
import { trpc } from '@web/lib/trpc'
import equal from 'fast-deep-equal/react'
import { JSONContent } from 'novel'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useBeforeUnload, useDebounce } from 'react-use'
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

  const readyToSaveRef = useRef(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState<JSONContent>(defaultJsonContent)

  useEffect(() => {
    if (readyToSaveRef.current) return
    if (query.status !== 'success') return

    setTitle(query.data.note.title)
    setContent(query.data.note.content)
    readyToSaveRef.current = true
  }, [query])

  const note = useMemo(
    () => ({
      id: params.noteId,
      title: title,
      content: content,
    }),
    [params.noteId, title, content],
  )

  useDebounce(
    () => {
      if (!readyToSaveRef.current) return

      if (paramNew !== null) {
        createMutation.mutate({
          note,
        })
      } else {
        updateMutation.mutate({
          note,
        })
      }
    },
    1000,
    [note],
  )

  useBeforeUnload(() => {
    if (createMutation.status === 'success' && equal(createMutation.variables.note, note)) {
      return false
    }

    if (updateMutation.status === 'success' && equal(updateMutation.variables.note, note)) {
      return false
    }

    return true
  }, 'You have unsaved changes, are you sure?')

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
