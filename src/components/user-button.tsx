import { Button } from '#/components/ui/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { signOut } from '#/lib/auth-client'
import {
  IconCalendarTime,
  IconLogout,
  IconReceiptRupee,
  IconSettingsSpark,
  IconShoppingCartShare,
  IconUserScan,
} from '@tabler/icons-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from './ui/avatar'

type UserButtonProps = {
  user: {
    id: string
    createdAt: Date
    updatedAt: Date
    email: string
    emailVerified: boolean
    name: string
    image: string
  } & {
    role: string
  } & {}
}

export default function UserButton({ user }: UserButtonProps) {
  const navigate = useNavigate()

  function handleSignOut() {
    toast.promise(signOut(), {
      loading: 'Signing out...',
      success: ({ data }) => {
        if (data?.success) {
          setTimeout(() => {
            // navigate('/', {
            //   viewTransition: true,
            //   replace: true,
            //   state: { from: window.location.pathname },
            // })
            navigate({
              to: '/',
              replace: true,
              // state: {
              //   __tempLocation: location,
              // },
              hash: 'login',
              viewTransition: true,
              search: `?redirectTo=${encodeURIComponent(location.pathname)}`,
            })
          }, 1200)
        }
        return 'Signed out successfully'
      },
      error: (err) => {
        return err.message || 'Error signing out'
      },
    })
  }

  const fallbackName =
    user.name
      .split(' ')
      .map((n) => n[0])
      .join('') || 'U'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={'icon-sm'} className={'mt-1'}>
          <Avatar>
            <AvatarImage
              // src="https://github.com/shadcn.png"
              src={user.image}
              alt={user.name}
            />
            <AvatarFallback>{fallbackName}</AvatarFallback>
            <AvatarBadge className="bg-green-600 dark:bg-green-800" />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className={'font-semibold'}>
            {user.name || user.email || 'User'}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/profile" viewTransition>
              <IconUserScan className={'size-4'} /> Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/cart" viewTransition>
              <IconShoppingCartShare className={'size-4'} /> My Cart
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/booking" viewTransition>
              <IconCalendarTime className={'size-4'} /> Booking
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconReceiptRupee className={'size-4'} /> Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconSettingsSpark className={'size-4'} />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Button className={'w-full bg-destructive'} onClick={handleSignOut}>
              Log out
              <IconLogout className={'size-4'} />
            </Button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
