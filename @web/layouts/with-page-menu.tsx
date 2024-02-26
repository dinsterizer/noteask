import { ScrollArea } from '@web/components/ui/scroll-area'
import { Outlet } from 'react-router-dom'

export function WithPageMenuLayout(props: { children?: React.ReactNode }) {
  return (
    <div>
      <ScrollArea className="h-screen">
        <div className="container p-4">
          <PageMenu />
        </div>
        <div>{props.children ? props.children : <Outlet />}</div>
      </ScrollArea>
    </div>
  )
}

function PageMenu() {
  return 'TODO menu'
}
