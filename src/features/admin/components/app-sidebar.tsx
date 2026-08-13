import * as React from 'react'

import { IconLockCog, IconReceipt } from '@tabler/icons-react'
import {
  CameraIcon,
  ChartBarIcon,
  CircleHelpIcon,
  DatabaseIcon,
  FileChartColumnIcon,
  FileIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  PandaIcon,
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
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: <LayoutDashboardIcon />,
    },
    {
      title: 'Patients',
      url: '/patients',
      icon: <UsersIcon />,
    },
    {
      title: 'Bookings',
      url: '/bookings',
      icon: <ChartBarIcon />,
    },
    {
      title: 'Subscribers',
      url: '/subscribers',
      icon: <IconReceipt />,
    },
    {
      title: 'Prescriptions',
      url: '/prescriptions',
      icon: <FileChartColumnIcon />,
    },
    {
      title: 'Settings',
      url: '#',
      icon: <IconLockCog />,
    },
  ],
  navClouds: [
    {
      title: 'Capture',
      icon: <CameraIcon />,
      isActive: true,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
    {
      title: 'Proposal',
      icon: <FileTextIcon />,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
    {
      title: 'Prompts',
      icon: <FileTextIcon />,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '#',
      icon: <Settings2Icon />,
    },
    {
      title: 'Get Help',
      url: '#',
      icon: <CircleHelpIcon />,
    },
    {
      title: 'Search',
      url: '#',
      icon: <SearchIcon />,
    },
  ],
  documents: [
    {
      name: 'Data Library',
      url: '#',
      icon: <DatabaseIcon />,
    },
    {
      name: 'Reports',
      url: '#',
      icon: <FileChartColumnIcon />,
    },
    {
      name: 'Word Assistant',
      url: '#',
      icon: <FileIcon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
                <PandaIcon className="size-5!" />
                <span className="text-base font-semibold">Blood Panda</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
