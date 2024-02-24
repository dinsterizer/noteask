import { Notes } from '@api/database/schema'

type Props = {
  note: typeof Notes.$inferSelect
}

export function NoteCard(props: Props) {
  return (
    <div>
      <div>
        <img src="https://plus.unsplash.com/premium_photo-1705091310316-fc9fa5335b17?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHx8"></img>
      </div>

      <div className="p-2 space-y-2">
        <h4>Toyota</h4>
        <div className="text-muted-foreground text-sm flex justify-between gap-2">
          <span>toyota.com</span>
          <span className="font-medium">Aug 19</span>
        </div>
      </div>
    </div>
  )
}
