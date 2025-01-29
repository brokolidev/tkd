'use client'

import { Avatar } from '@/components/avatar'
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@/components/dropdown'
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from '@/components/navbar'
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from '@/components/sidebar'
import { SidebarLayout } from '@/components/sidebar-layout'
import { Spinner } from '@/components/spinner'
import { getEvents } from '@/data'
import useUser from '@/hooks/swrHooks'
import axios from '@/lib/axios'
import { setCookie } from '@/lib/cookie'
import {
  ArrowRightStartOnRectangleIcon,
  ChevronUpIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from '@heroicons/react/16/solid'
import {
  CalendarDaysIcon,
  Cog6ToothIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  Square2StackIcon,
  UsersIcon,
} from '@heroicons/react/20/solid'
import { redirect, usePathname } from 'next/navigation'

let interceptorId: number | null = null

const logout = async () => {
  if (interceptorId !== null) {
    axios.interceptors.request.eject(interceptorId)
    interceptorId = null
  }

  localStorage.removeItem('tkd-access-token')
  await setCookie('tkd-access-token', '')

  redirect('/login')
}

function AccountDropdownMenu({ anchor, onLogout }: { anchor: 'top start' | 'bottom end'; onLogout: () => void }) {
  return (
    <DropdownMenu className="min-w-64" anchor={anchor}>
      <DropdownItem href="#">
        <UserCircleIcon />
        <DropdownLabel>My account</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href="#">
        <ShieldCheckIcon />
        <DropdownLabel>Privacy policy</DropdownLabel>
      </DropdownItem>
      <DropdownItem href="#">
        <LightBulbIcon />
        <DropdownLabel>Share feedback</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href="#" onClick={onLogout}>
        <ArrowRightStartOnRectangleIcon />
        <DropdownLabel>Sign out</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  )
}

export function ApplicationLayout({
  events,
  children,
}: {
  events: Awaited<ReturnType<typeof getEvents>>
  children: React.ReactNode
}) {
  const { user, isError, isLoading } = useUser()

  let pathname = usePathname()

  if (isLoading) return <Spinner></Spinner>

  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>
            <Dropdown>
              <p>This sis</p>
              <DropdownButton as={NavbarItem}>
                <Avatar src={user && user.profileImage} square />
              </DropdownButton>
              <AccountDropdownMenu anchor="bottom end" onLogout={logout} />
            </Dropdown>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <Avatar src="/logo.svg" className="bg-black" />
                <SidebarLabel>TaekwondoOn</SidebarLabel>
              </DropdownButton>
              {/*<DropdownMenu className="min-w-80 lg:min-w-64" anchor="bottom start">*/}
              {/*  <DropdownItem href="/settings">*/}
              {/*    <Cog8ToothIcon />*/}
              {/*    <DropdownLabel>Settings</DropdownLabel>*/}
              {/*  </DropdownItem>*/}
              {/*  <DropdownDivider />*/}
              {/*  <DropdownItem href="#">*/}
              {/*    <Avatar slot="icon" src="/teams/catalyst.svg" />*/}
              {/*    <DropdownLabel>Catalyst</DropdownLabel>*/}
              {/*  </DropdownItem>*/}
              {/*  <DropdownItem href="#">*/}
              {/*    <Avatar slot="icon" initials="BE" className="bg-purple-500 text-white" />*/}
              {/*    <DropdownLabel>Big Events</DropdownLabel>*/}
              {/*  </DropdownItem>*/}
              {/*  <DropdownDivider />*/}
              {/*  <DropdownItem href="#">*/}
              {/*    <PlusIcon />*/}
              {/*    <DropdownLabel>New team&hellip;</DropdownLabel>*/}
              {/*  </DropdownItem>*/}
              {/*</DropdownMenu>*/}
            </Dropdown>
          </SidebarHeader>

          <SidebarBody>
            <SidebarSection>
              <SidebarItem href="/" current={pathname === '/'}>
                <HomeIcon />
                <SidebarLabel>Home</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/users" current={pathname.startsWith('/users')}>
                <UsersIcon />
                <SidebarLabel>Users</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="#">
                <CalendarDaysIcon />
                <SidebarLabel>Schedules</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="#">
                <Square2StackIcon />
                <SidebarLabel>Events</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/settings" current={pathname.startsWith('/settings')}>
                <Cog6ToothIcon />
                <SidebarLabel>Settings</SidebarLabel>
              </SidebarItem>
            </SidebarSection>

            <SidebarSection className="max-lg:hidden">
              <SidebarHeading>Upcoming Events</SidebarHeading>
              {events.map((event) => (
                <SidebarItem key={event.id} href="#">
                  {event.name}
                </SidebarItem>
              ))}
            </SidebarSection>

            <SidebarSpacer />

            <SidebarSection>
              <SidebarItem href="#">
                <QuestionMarkCircleIcon />
                <SidebarLabel>Support</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="#">
                <SparklesIcon />
                <SidebarLabel>Changelog</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>

          <SidebarFooter className="max-lg:hidden">
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <span className="flex min-w-0 items-center gap-3">
                  <Avatar src={user && user.profileImage} className="size-10" square alt="" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
                      {user && user.firstName}
                    </span>
                    <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                      {user && user.email}
                    </span>
                  </span>
                </span>
                <ChevronUpIcon />
              </DropdownButton>
              <AccountDropdownMenu anchor="top start" onLogout={logout} />
            </Dropdown>
          </SidebarFooter>
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  )
}
