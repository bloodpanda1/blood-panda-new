import * as React from 'react'
import { ShieldIcon } from 'lucide-react'
import { useSession } from '#/lib/auth-client'

import { IconLockCog, IconReceipt } from '@tabler/icons-react'
import {
  CalendarIcon,
  CameraIcon,
  ChartBarIcon,
  CircleHelpIcon,
  DatabaseIcon,
  FileChartColumnIcon,
  FileIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  SearchIcon,
  Settings2Icon,
  UsersIcon,
} from 'lucide-react'
// import { Link } from "react-router"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '#/components/ui/sidebar'
import { NavDocuments } from '#/features/admin/components/nav-documents'
import { NavMain } from '#/features/admin/components/nav-main'
import { NavSecondary } from '#/features/admin/components/nav-secondary'
import { NavUser } from '#/features/admin/components/nav-user'
import { Link } from '@tanstack/react-router'

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/admin/dashboard',
      icon: <LayoutDashboardIcon />,
    },
    {
      title: 'Accounts',
      url: '/admin/accounts',
      icon: <UsersIcon />,
    },
    {
      title: 'Patients',
      url: '/admin/patients',
      icon: <UsersIcon />,
    },
    {
      title: 'Bookings',
      url: '/admin/bookings',
      icon: <ChartBarIcon />,
    },
    {
      title: 'Calendar',
      url: '/admin/calendar',
      icon: <CalendarIcon />,
    },
    {
      title: 'Subscribers',
      url: '/admin/subscribers',
      icon: <IconReceipt />,
    },
    {
      title: 'Prescriptions',
      url: '/admin/prescriptions',
      icon: <FileChartColumnIcon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  const userRole = (session?.user as any)?.role

  const navMainWithStaff = React.useMemo(() => {
    const nav = [...data.navMain]
    if (userRole === 'SUPER_ADMIN') {
      nav.splice(6, 0, {
        title: 'Staff',
        url: '/admin/staff',
        icon: <ShieldIcon />,
      })
    }
    return nav
  }, [userRole])

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link to="/" viewTransition>
                <img src="/logo-idol.png" alt="Blood Panda Logo" className="size-6 shrink-0 object-contain" />
                <span className="text-base font-semibold">Blood Panda</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainWithStaff} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
