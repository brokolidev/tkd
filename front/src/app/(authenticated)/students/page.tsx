'use client'

import { Avatar } from '@/components/avatar'
import { Heading, Subheading } from '@/components/heading'
import { Select } from '@/components/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { useEffect, useState } from 'react'
import useUser from "@/hooks/swrHooks";
import axios from "@/lib/axios";
import { getSchedules } from '@/services/schdeuleServices'



export default function StudentsPage() {

  const { user, isError, isLoading } = useUser()

  return (
    <>
      <Heading>
        Students
      </Heading>
      <Table className="mt-4 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Student Id</TableHeader>
            <TableHeader>Promotion Availability</TableHeader>
            <TableHeader>Name</TableHeader>
            <TableHeader>Level</TableHeader>
            <TableHeader className="text-right">Expired Date</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow title={`Customer Name}`}>
            <TableCell className="text-zinc-500">
              3000
            </TableCell>
            <TableCell>available</TableCell>
            <TableCell>Customer Name</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar src="#" className="size-6" />
                <span>Belt Color</span>
              </div>
            </TableCell>
            <TableCell className="text-right">May 9, 2025</TableCell>
          </TableRow>
          {/*{schedules.map((schedule) => (*/}
          {/*  <TableRow key={schedule.id} title={`Schedule #${schedule.id}`}>*/}
          {/*    <TableCell className="text-zinc-500">*/}
          {/*      {schedule.timeSlot.startsAt} - {schedule.timeSlot.endsAt}*/}
          {/*    </TableCell>*/}
          {/*    <TableCell>{schedule.dayOfWeekString}</TableCell>*/}
          {/*    <TableCell>{schedule.mainInstructorName}</TableCell>*/}
          {/*    <TableCell>*/}
          {/*      <div className="flex items-center gap-2">*/}
          {/*        <Avatar src={schedule.levelImageUrl} className="size-6" />*/}
          {/*        <span>{schedule.level}</span>*/}
          {/*      </div>*/}
          {/*    </TableCell>*/}
          {/*    <TableCell className="text-center">{schedule.classSize}</TableCell>*/}
          {/*  </TableRow>*/}
          {/*))}*/}
        </TableBody>
      </Table>
    </>
  )
}
