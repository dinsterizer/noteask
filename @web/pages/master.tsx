import { Header } from '@web/components/navigation/header'
import { NoteCard } from '@web/components/note/card'
import { SubscriptionCard } from '@web/components/subscription-card'
import { Button } from '@web/components/ui/button'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@web/components/ui/resizable'
import { WithRevealMenuLayout } from '@web/layouts/with-reveal-menu'
import { trpc } from '@web/lib/trpc'
import { Helmet } from 'react-helmet-async'
import { Link, Outlet, useNavigate, useOutlet } from 'react-router-dom'
import { useMedia } from 'react-use'
import { match } from 'ts-pattern'

export function Component() {
  const outlet = useOutlet()
  const isWide = useMedia('(min-width: 768px)')

  return (
    <>
      <Helmet>
        <title>Noteask</title>
      </Helmet>

      {/* TODO: prevent scroll on resize panel */}
      <ResizablePanelGroup direction="horizontal">
        {isWide ? (
          <ResizablePanel defaultSize={25} className="min-w-[280px]">
            <WithRevealMenuLayout>
              <div className="container max-w-5xl">
                <div className="py-6">
                  <Header />
                </div>

                <div className="pt-8">
                  <AddNoteButton />
                </div>

                <div className="pt-8">
                  <NoteList />
                </div>

                <section className="my-6 md:my-8 xl:my-12">
                  <div className="rounded-2xl border lg:mx-0 ">
                    <SubscriptionCard />
                  </div>
                </section>
              </div>
            </WithRevealMenuLayout>
          </ResizablePanel>
        ) : null}

        {outlet && isWide ? <ResizableHandle withHandle /> : null}
        <Outlet />
      </ResizablePanelGroup>
    </>
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

function NoteList() {
  const query = trpc.note.list.useQuery({}, {})

  return match(query)
    .with({ status: 'pending' }, () => 'TODO pending')
    .with({ status: 'error' }, () => 'TODO error')
    .with({ status: 'success' }, (query) => (
      <ul className="grid grid-cols-4 gap-4">
        {query.data.items.map((note) => {
          return (
            <li key={note.id} className="shadow rounded">
              <NoteCard note={note} />
            </li>
          )
        })}
      </ul>
    ))
    .exhaustive()
}
