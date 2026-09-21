import { Button } from '#/components/ui/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
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
import { Monitor, Moon, Sun, CheckIcon, LayoutDashboard, CalendarDays } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from './ui/avatar'
import { useTheme } from './theme-provider'

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
  const { theme, setTheme } = useTheme()

  function handleSignOut() {
    toast.promise(signOut(), {
      loading: 'Signing out...',
      success: ({ data }) => {
        if (data?.success) {
          setTimeout(() => {
            navigate({
              to: '/',
              replace: true,
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
          <DropdownMenuItem asChild>
            <Link to="/my-orders" viewTransition>
              <IconReceiptRupee className={'size-4'} /> My Orders
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/calendar" viewTransition>
              <CalendarDays className={'size-4'} /> My Calendar
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/saved-addresses" viewTransition>
              <IconSettingsSpark className={'size-4'} />
              Saved Addresses
            </Link>
          </DropdownMenuItem>
          {['ADMIN', 'SUPER_ADMIN', 'COO', 'PHLEBOTOMIST'].includes(user.role) && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="text-primary font-semibold">
                {user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? (
                  <Link to="/admin/dashboard" viewTransition>
                    <LayoutDashboard className="size-4 text-primary" /> Admin Dashboard
                  </Link>
                ) : user.role === 'COO' ? (
                  <Link to="/coo/tasks" viewTransition>
                    <LayoutDashboard className="size-4 text-primary" /> COO Portal
                  </Link>
                ) : (
                  <Link to="/phlebotomist/appointments" viewTransition>
                    <LayoutDashboard className="size-4 text-primary" /> Phlebotomist Portal
                  </Link>
                )}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span>Theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <Sun className="mr-2 size-4" />
                  <span>Light</span>
                  {theme === 'light' && <CheckIcon className="ml-auto size-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <Moon className="mr-2 size-4" />
                  <span>Dark</span>
                  {theme === 'dark' && <CheckIcon className="ml-auto size-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  <Monitor className="mr-2 size-4" />
                  <span>System</span>
                  {theme === 'system' && <CheckIcon className="ml-auto size-4" />}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
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
