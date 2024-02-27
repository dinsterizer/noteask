import { NoteList } from '@web/components/note/list'
import { SubscriptionCard } from '@web/components/subscription-card'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@web/components/ui/resizable'
import { ScrollArea } from '@web/components/ui/scroll-area'
import { Helmet } from 'react-helmet-async'
import { Outlet, useOutlet } from 'react-router-dom'
import { useMedia } from 'react-use'

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
            <ScrollArea className="h-screen">
              <div className="container max-w-5xl">
                <div className="pt-8">
                  <NoteList />S
                </div>

                <section className="my-6 md:my-8 xl:my-12">
                  <div className="rounded-2xl border lg:mx-0 ">
                    <SubscriptionCard />
                  </div>
                </section>
              </div>
            </ScrollArea>
          </ResizablePanel>
        ) : null}

        {outlet && isWide ? <ResizableHandle withHandle /> : null}
        <Outlet />
      </ResizablePanelGroup>
    </>
  )
}
