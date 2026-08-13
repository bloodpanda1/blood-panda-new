import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandThreads,
  IconLogout,
  IconMenu4,
} from '@tabler/icons-react'
import { ShoppingBasketIcon } from 'lucide-react'
import { useState } from 'react'

import { Button, buttonVariants } from '#/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '#/components/ui/sheet'

import { cn } from '#/lib/utils'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from './ui/navigation-menu'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { miniPackagesLink, navLinks, packagesLink } from '#/constants'
import { signOut, useSession } from '#/lib/auth-client'
import { useCart } from '#/stores/useCart'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Badge } from './ui/badge'
import { Skeleton } from './ui/skeleton'

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { items } = useCart()

  const { data, isPending, isRefetching } = useSession()

  // check the splat
  // /packages/*
  const isPackagesRoute = pathname.startsWith('/packages')

  function handleClose() {
    setTimeout(() => {
      setIsOpen(false)
    }, 150)
  }

  function handleSignOut() {
    toast.promise(signOut(), {
      loading: 'Signing out...',
      success: ({ data: res }) => {
        if (res?.success) {
          setTimeout(() => {
            navigate({
              to: '/login',
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

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <IconMenu4 className={'size-4'} />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            <div className={'flex flex-col items-center justify-center py-2'}>
              <img src="/logo-idol.png" alt="logo" width={70} height={49} />
              <img src="/logo-txt.png" alt="logo" width={196} height={34} />
            </div>
          </SheetTitle>
          <SheetDescription className={'sr-only'}>&nbsp;</SheetDescription>
        </SheetHeader>
        <div className={'grid grid-cols-1 gap-4 px-4 py-2'}>
          <div>
            <NavigationMenu>
              <NavigationMenuList className={'flex-col items-start gap-2'}>
                {navLinks.map((link) => {
                  if (link.href === '/packages') {
                    return (
                      <DropdownMenu key={link.id}>
                        <DropdownMenuTrigger asChild>
                          <NavigationMenuLink
                            active={isPackagesRoute}
                            className={cn(
                              'hover:bg-transparent focus:bg-transparent',
                              'p-1',
                              'rounded-none',
                              'border-primary',
                              'data-active:bg-transparent data-active:hover:bg-transparent data-active:focus:bg-transparent',
                              'data-active:border-b-2 data-active:hover:border-b-2 data-active:focus:border-b-2',
                              'cursor-pointer',
                            )}
                          >
                            {link.label}
                          </NavigationMenuLink>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuGroup>
                            <DropdownMenuLabel>Our Packages</DropdownMenuLabel>
                            {packagesLink.map((pkg) => (
                              <DropdownMenuItem key={pkg.id} asChild>
                                <Link
                                  to={pkg.href}
                                  viewTransition
                                  onClick={handleClose}
                                >
                                  {pkg.label}
                                </Link>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            <DropdownMenuLabel>Mini Packages</DropdownMenuLabel>
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                Explore...
                              </DropdownMenuSubTrigger>
                              <DropdownMenuPortal>
                                <DropdownMenuSubContent
                                  align="end"
                                  sideOffset={-100}
                                  alignOffset={40}
                                >
                                  {miniPackagesLink.map((pkg) => (
                                    <DropdownMenuItem key={pkg.id} asChild>
                                      <Link
                                        to={pkg.href}
                                        viewTransition
                                        onClick={handleClose}
                                      >
                                        {pkg.label}
                                      </Link>
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuSubContent>
                              </DropdownMenuPortal>
                            </DropdownMenuSub>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )
                  }

                  return (
                    <NavigationMenuItem key={link.id} className={'w-full'}>
                      <NavigationMenuLink
                        active={link.href === pathname}
                        asChild
                        className={cn(
                          'hover:bg-transparent focus:bg-transparent',
                          'p-1',
                          'rounded-none',
                          'border-primary',
                          'data-active:bg-transparent data-active:hover:bg-transparent data-active:focus:bg-transparent',
                          'data-active:border-b-2 data-active:hover:border-b-2 data-active:focus:border-b-2',
                        )}
                      >
                        <Link
                          to={link.href}
                          viewTransition
                          onClick={handleClose}
                        >
                          {link.label}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className={'space-y-2'}>
            <p className={'text-sm font-semibold underline underline-offset-2'}>
              Contact the owner:
            </p>
            <address className={'space-y-1'}>
              <p className={'text-sm'}>
                8<sup>th</sup> Cross Road, Sai Sree Layout,
                <br />(<small>Near Electronic City</small>)
                <br />
                Bengaluru, Karnataka 560100
              </p>
              <p>
                <strong>Phone 1:</strong>{' '}
                <a
                  href="tel:+918277842200"
                  className={'text-primary'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +91 82778 42200
                </a>
              </p>
              <p>
                <strong>Phone 2:</strong>{' '}
                <a
                  href="tel:+919449024906"
                  className={'text-primary'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +91 94490 24906
                </a>
              </p>
              <p>
                <strong>Email:</strong>{' '}
                <a
                  href="mailto:support@bloodpanda.com"
                  className={'text-primary'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  support@bloodpanda.com
                </a>
              </p>
              <p>
                <strong>Want to chat?</strong>{' '}
                <a
                  href="https://wa.link/fvmq1j"
                  className={'text-primary'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chat Now
                </a>
              </p>
            </address>
          </div>
        </div>

        <SheetFooter>
          <ul className={'flex items-center gap-3 self-end'}>
            {isPending || isRefetching ? (
              <li className={'mt-auto'}>
                <Skeleton
                  className={buttonVariants({
                    size: 'lg',
                    variant: 'ghost',
                    className: 'size-8 rounded-full',
                  })}
                />
              </li>
            ) : !data ? (
              <li>
                <Button
                  type="button"
                  variant={'outline'}
                  size={'icon-sm'}
                  asChild
                  className={'relative'}
                >
                  <Link to="/login" viewTransition>
                    <ShoppingBasketIcon className={'size-4'} />
                    <Badge
                      variant={'destructive'}
                      className={'absolute -top-2.5 -right-1.5 px-1.5 text-xs'}
                    >
                      {items.length}
                    </Badge>
                  </Link>
                </Button>
              </li>
            ) : (
              <li>
                <Button
                  type="button"
                  variant={'outline'}
                  size={'icon-sm'}
                  asChild
                  className={'relative'}
                >
                  <Link to="/cart" viewTransition>
                    <ShoppingBasketIcon className={'size-4'} />
                    <Badge
                      variant={'destructive'}
                      className={'absolute -top-2.5 -right-1.5 px-1.5 text-xs'}
                    >
                      {items.length}
                    </Badge>
                  </Link>
                </Button>
              </li>
            )}

            <li className={'flex items-center justify-center gap-2'}>
              <a
                href="https://www.facebook.com/share/1D82dU3Uad/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: 'link', size: 'icon' })}
              >
                <IconBrandFacebook className={'size-5'} />
              </a>
              <a
                href="https://www.threads.com/@bloodpandaofficial?igshid=NTc4MTIwNjQ2YQ=="
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: 'link', size: 'icon' })}
              >
                <IconBrandThreads className={'size-5'} />
              </a>

              <a
                href="https://www.instagram.com/bloodpandaofficial?utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({
                  variant: 'link',
                  size: 'icon',
                })}
              >
                <IconBrandInstagram className={'size-5'} />
              </a>
            </li>
          </ul>
          {isPending || isRefetching ? (
            <Skeleton
              className={buttonVariants({
                // size: "lg",
                variant: 'ghost',
              })}
            />
          ) : !data ? (
            <Button
              asChild
              className={
                'w-full bg-destructive hover:bg-accent hover:text-destructive transition-all duration-300 ease-in-out'
              }
            >
              <Link to="/login" viewTransition>
                Login
              </Link>
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSignOut}
              className={
                'w-full bg-destructive hover:bg-accent hover:text-destructive transition-all duration-300 ease-in-out'
              }
            >
              LogOut <IconLogout className={'size-4'} />
            </Button>
          )}

          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
