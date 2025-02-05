'use client'

import { Avatar } from '@/components/avatar'
import { Badge } from '@/components/badge'
import { Divider } from '@/components/divider'
import { Heading, Subheading } from '@/components/heading'
import { Select } from '@/components/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { useEffect, useState } from 'react'
import useUser from "@/hooks/swrHooks";
import axios from "@/lib/axios";

function Stat({ title, value, change }: { title: string; value: string; change: string }) {
  return (
    <div>
      <Divider />
      <div className="mt-6 text-lg/6 font-medium sm:text-sm/6">{title}</div>
      <div className="mt-3 text-3xl/8 font-semibold sm:text-2xl/8">{value}</div>
      <div className="mt-3 text-sm/6 sm:text-xs/6">
        <Badge color={change.startsWith('+') ? 'lime' : 'pink'}>{change}</Badge>{' '}
        <span className="text-zinc-500">from last week</span>
      </div>
    </div>
  )
}

export default function Home() {
  
  const [schedules, setSchedules] = useState([])

  const { user, isError, isLoading } = useUser()
  
  const getGreeting = () => {
    const currentHour = new Date().getHours()

    if (currentHour >= 6 && currentHour < 12) {
      return 'morning'
    } else if (currentHour >= 12 && currentHour < 18) {
      return 'afternoon'
    } else {
      return 'evening'
    }
  }
  
  async function loadSchedules(): Promise<void> {
    await axios.get('/api/schedule').then((response) => {
      setSchedules(response.data);
    });
  }

  useEffect(() => {
    loadSchedules();
  }, []);
  
  return (
    <>
      <Heading>
        Good {getGreeting()}, {user && user.firstName}
      </Heading>
      <div className="mt-8 flex items-end justify-between">
        <Subheading>Overview</Subheading>
        <div>
          <Select name="period">
            <option value="last_week">Last week</option>
            <option value="last_two">Last two weeks</option>
            <option value="last_month">Last month</option>
            <option value="last_quarter">Last quarter</option>
          </Select>
        </div>
      </div>
      <div className="mt-4 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
        <Stat title="Total revenue" value="$2.6M" change="+4.5%" />
        <Stat title="Total Customers" value="488" change="-0.5%" />
        <Stat title="Employees" value="8" change="+30%" />
      </div>
      <Subheading className="mt-14">Registered Schedules</Subheading>
      <Table className="mt-4 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Timeslot</TableHeader>
            <TableHeader>Date</TableHeader>
            <TableHeader>Main Instructor</TableHeader>
            <TableHeader>Level</TableHeader>
            <TableHeader className="text-center">Class Size</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {schedules.map((schedule) => (
            <TableRow key={schedule.id} title={`Schedule #${schedule.id}`}>
              <TableCell className="text-zinc-500">
                {schedule.timeSlot.startsAt} - {schedule.timeSlot.endsAt}
              </TableCell>
              <TableCell>{schedule.dayOfWeekString}</TableCell>
              <TableCell>{schedule.mainInstructorName}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar src={schedule.levelImageUrl} className="size-6" />
                  <span>{schedule.level}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">{schedule.classSize}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
