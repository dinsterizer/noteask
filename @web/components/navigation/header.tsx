import { Logo } from '../logo'
import { OrganizationSwitcher, UserButton } from '@clerk/clerk-react'
import { cn } from '@web/lib/utils'
import { Link } from 'react-router-dom'

export function Header() {
  return (
    <header className="flex items-center justify-between gap-2">
      <div className="flex items-center">
        <Link to="/">
          <Logo size={24} variant="icon" />
        </Link>
        <span className="text-muted-foreground/50 px-3 font-thin">|</span>
        <OrganizationSwitcher
          appearance={{
            elements: {
              rootBox: '[&.cl-organizationSwitcher-root]:h-6',
              organizationSwitcherTrigger: cn(
                'w-full p-0',
                '[&_.cl-organizationPreviewMainIdentifier]:text-sm',
                '[&_.cl-userPreviewAvatarBox]:size-6',
                '[&_.cl-organizationPreviewAvatarBox]:size-6',
              ),
            },
          }}
        />
      </div>

      <div className="flex items-center gap-4">
        <UserButton
          appearance={{
            elements: {
              rootBox: '[&.cl-userButton-root]:h-7 [&.cl-userButton-root]:pl-1',
            },
          }}
        />
      </div>
    </header>
  )
}
