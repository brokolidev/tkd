'use client'

import { Avatar } from '@/components/avatar'
import { Button } from '@/components/button'
import { Userbutton } from '@/components/cutom/user-button'
import { Heading } from '@/components/heading'
import { Link } from '@/components/link'
import { Pagination, PaginationGap, PaginationNext, PaginationPage, PaginationPrevious } from '@/components/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import useUser from '@/hooks/swrHooks'
import { userViews, useUserViews } from '@/hooks/userViews'
import { getAdmins } from '@/services/adminServices'
import { deleteRecord, getRecordsForUser } from '@/services/attendanceServices'
import { getInstructors } from '@/services/instructorServices'
import { getStudents } from '@/services/studentServices'
import { AttendancePagination, IAttendanceRecord } from '@/structures/attendance'
import { ISchedule } from '@/structures/schedule'
import { beltColors, IUser, UserPagination } from '@/structures/users'

// @ts-ignore
import { use, useEffect, useState } from 'react'

export default function UserPage(props) {
  const searchParams: any = use(props.searchParams)
  const page = searchParams.page ? parseInt(searchParams.page) : 1

  const [records, setRecords] = useState<IAttendanceRecord[]>([])
  const [pageInfo, setPageInfo] = useState<AttendancePagination>({
    total: 0,
    perPage: 0,
    currentPage: 0,
    lastPage: 0,
    firstPageUrl: "",
    lastPageUrl: "",
    nextPageUrl: "",
    prevPageUrl: "",
    from: 0,
    to: 0,
    data: []
  })

  const { currentView, setCurrentView } = useUserViews()
  const { user } = useUser()

  /**
   * Loads the users in from the BE, based on the user view chosen
   */
  const loadData = () => {

    getRecordsForUser(page, user.id)
      .then((data: AttendancePagination) => {
        console.log("The data: ", data)
        setPageInfo(data)
        setRecords(data.data)

      })
      .catch((err: string) => {
        console.log("ERROR: " + err)
      })
  }

  useEffect(() => {
    //pass the function off to load the data
    loadData()
  }, [page, currentView])

  const removeRecord = (id: number) => {
    const confirmDelete = confirm("Are you sure you want to delete record with id " + id + "?")
  
    if (confirmDelete) {
        deleteRecord(id)
            .then(r => {
                alert("Record with id " + id + " deleted successfully")
                
                //remove the record from the FE
                const newRecords = records.filter(record => record.id != id)
                setRecords(newRecords)
            })
            .catch(err => {
                console.log("ERROR: deleteRecord: " + err)
            })
    }
  }

  /**
   * Builds the pagination element list for the page. This way, it's not a whole bunch of stuff
   * trying to be done in the map function down below.
   * 
   * @returns A list of the pagination buttons for the bottom of the screen
   */
  const buildPagination = (): JSX.Element[] => {
    console.log("pagination building time")

    const elements: JSX.Element[] = []

    //push the previous button
    if (page > 1) {
        elements.push(
          <PaginationPage key={'start'} href={pageInfo.firstPageUrl}>Start</PaginationPage>
        )
        elements.push(<PaginationPrevious key={'prev'} href={pageInfo.prevPageUrl} />)
    } else {
        elements.push(<span key={'prev'} className='grow basis-0'></span>)
    }

    //this should end up showing the current page, and nine pages after that.

    //determine the number to start at (prevents 0 from being added when the page is 1)
    let start = (page == 1 ? page : page - 1)

    //push the page buttons
    for (let i = start; i < (pageInfo.lastPage + 1) && i < (page + 10); i++) {
        elements.push(
          <PaginationPage
            key={i}
            href={"?page=" + (i)}
            {...(i == page ? { current: true } : {})}
          >
            {i}
          </PaginationPage>
        )
    }

    //push the next button
    if (page < pageInfo.lastPage) {
        elements.push(<PaginationNext key={'next'} href={pageInfo.nextPageUrl} />)
        elements.push(
          <PaginationPage key={'end'} href={pageInfo.lastPageUrl}>End</PaginationPage>
        )
    } else {
        elements.push(<span key={'next'} className='grow basis-0'></span>)
    }

    //return the buttons
    return elements
  }

  return (
    <>

      {/* The header */}
      <div className="flex items-end justify-between gap-4">
        <Heading className='capitalize'>
          Attendance History for {user.firstName + " " + user.lastName}
        </Heading>
      </div>

      {/* The user table */}
      <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">

        <TableHead>
          <TableRow>
            <TableHeader className='capitalize'>ID</TableHeader>
            <TableHeader>Level</TableHeader>
            <TableHeader>Date Recorded</TableHeader>
            <TableHeader>Actions</TableHeader>

          </TableRow>
        </TableHead>

        <TableBody>

          {records && //ensure the students object exists before mapping anything
            records.map((record: IAttendanceRecord) => (
              <TableRow key={record.id} title={`Record #${record.id}`}>
                
                {/* The student's id */}
                <TableCell>{record.id}</TableCell>
                
                {/* Student name */}
                <TableCell>{record.schedule.level}</TableCell>

                {/* Date Of Record */}
                <TableCell>{record.dateRecorded.toLocaleString()}</TableCell>

                {/* Actions */}
                <TableCell>
                    <Button onClick={() => removeRecord(record.id)}>Delete</Button>
                </TableCell>

              </TableRow>
            ))
          }
        </TableBody>

      </Table>

      <Pagination className="mt-8">
        { pageInfo?.lastPage > 1 &&
          buildPagination()
        }
      </Pagination>
    </>
  )
}
