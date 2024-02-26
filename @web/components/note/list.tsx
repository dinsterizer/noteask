import { End } from '../end'
import { Button } from '../ui/button'
import { ViewportBlock } from '../viewport-block'
import { NoteCard, NoteCardSkeleton } from './card'
import { trpc } from '@web/lib/trpc'
import { useNavigate } from 'react-router-dom'
import { match } from 'ts-pattern'

export function NoteList() {
  const query = trpc.note.list.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  )

  return (
    <div className="@container space-y-4">
      <AddNoteButton />

      <ul className="grid @md:grid-cols-2 @2xl:grid-cols-3 gap-6">
        {match(query)
          .with({ status: 'pending' }, () => (
            <>
              <NoteCardSkeleton />
              <NoteCardSkeleton />
              <NoteCardSkeleton />
            </>
          ))
          .with({ status: 'error' }, () => 'TODO error')
          .with({ status: 'success' }, (query) => {
            if (!query.data.pages?.[0]?.items.length) return 'TODO empty'

            return (
              <>
                {query.data.pages.map((page) => {
                  return page.items.map((note) => {
                    return (
                      <li key={note.id} className="shadow rounded">
                        <NoteCard note={note} />
                      </li>
                    )
                  })
                })}

                {!query.isFetching && query.hasNextPage && (
                  <ViewportBlock onEnterViewport={() => query.fetchNextPage()} />
                )}
                {query.hasNextPage ? (
                  <NoteCardSkeleton />
                ) : (
                  <div className="col-span-full">
                    <End />
                  </div>
                )}
              </>
            )
          })
          .exhaustive()}
      </ul>
    </div>
  )
}

function AddNoteButton() {
  const navigate = useNavigate()

  return (
    <Button
      variant={'secondary'}
      className="w-full"
      type="button"
      onClick={() => {
        navigate(`/notes/${crypto.randomUUID()}/edit?new`)
      }}
    >
      Add Note
    </Button>
  )
}
