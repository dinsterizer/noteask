import { Skeleton } from '../ui/skeleton'
import { Notes } from '@api/database/schema'
import { format } from '@formkit/tempo'
import { Link } from 'react-router-dom'

type Props = {
  note: typeof Notes.$inferSelect
}

export function NoteCard(props: Props) {
  return (
    <div className="relative">
      <div>
        <img src="https://plus.unsplash.com/premium_photo-1705091310316-fc9fa5335b17?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHx8"></img>
      </div>

      <div className="p-2 space-y-2">
        <h4>{props.note.title}</h4>
        <div className="text-muted-foreground text-sm flex justify-between gap-2">
          {/* TODO */}
          <span>toyota.com</span>
          <span className="font-medium">
            {format(
              props.note.createdAt,
              props.note.createdAt.getUTCFullYear() === new Date().getUTCFullYear()
                ? 'MMM D'
                : 'MMM D, YYYY',
            )}
          </span>
        </div>
      </div>

      <Link to={`/notes/${props.note.id}/edit`} className="absolute inset-0"></Link>
    </div>
  )
}

export function NoteCardSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="w-full aspect-w-16 aspect-h-9" />

      <div className="space-y-2">
        <Skeleton className="w-2/3 h-6" />

        <div className="flex justify-between gap-2">
          <Skeleton className="w-16 h-5" />
          <Skeleton className="w-10 h-5" />
        </div>
      </div>
    </div>
  )
}
