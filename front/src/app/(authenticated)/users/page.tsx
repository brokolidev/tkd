'use client'

import { Avatar } from '@/components/avatar'
import { Button } from '@/components/button'
import { Userbutton } from '@/components/cutom/user-button'
import { Heading } from '@/components/heading'
import { Link } from '@/components/link'
import { Pagination, PaginationGap, PaginationNext, PaginationPage, PaginationPrevious } from '@/components/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { userViews, useUserViews } from '@/hooks/userViews'
import { getAdmins } from '@/services/AdminServices'
import { getInstructors } from '@/services/InstructorServices'
import { getStudents } from '@/services/StudentServices'
import { beltColors, IUser, Student } from '@/structures/users'

// @ts-ignore
import { use, useEffect, useState } from 'react'

export default function UserPage(props) {
  const searchParams: any = use(props.searchParams)

  const [users, setUsers] = useState<IUser[]>([])
  const [page, setPage] = useState<number>(1)
  const [pageInfo, setPageInfo] = useState<Object>({
    pageSize: Number,
    totalItems: Number,
    totalPages: Number
  })
  const { currentView, setCurrentView } = useUserViews()

  const loadData = () => {

    let dataToFetch = null

    //load in the correct users for the chosen view
    switch (currentView) {
      case userViews.ADMIN:
        dataToFetch = () => getAdmins(page)
        break
      case userViews.INSTRUCTOR:
        dataToFetch = () => getInstructors(page)
        break
      case userViews.STUDENT:
        dataToFetch = () => getStudents(page)
        break
      default:
        //we end up here at least once when the page reloads.
        console.log("invalid view: ", currentView)
        //exit the function. it will be called again if the current view changes
        return
    }

    dataToFetch()
      .then((data: any) => {
        console.log("The data: ", data)
        setPageInfo({
          pageSize: data.PageSize,
          totalItems: data.TotalItems,
          totalPages: data.TotalPages
        })
        setUsers(data.users)
      })
      .catch((err: string) => {
        console.log("ERROR: " + err)
      })
  }

  useEffect(() => {
    //pass the function off to load the data
    loadData()
  }, [page, currentView])

  
  const conditionalStyle = (expiredAt) => {
    const currentDate = new Date().valueOf()
    const expirationDate = new Date(expiredAt).valueOf()
    const daysUntilExpiration: number = (expirationDate - currentDate) / (1000 * 60 * 60 * 24)

    return {
      color: daysUntilExpiration <= 5 && daysUntilExpiration >= 0 ? 'red' : '',
    }
  }

  return (
    <>

      {/* The header */}
      <div className="flex items-end justify-between gap-4">
        <Heading className='capitalize'>
          Users -&gt; { Object.values(userViews)[currentView].toString().toLowerCase() } View
        </Heading>

        {/* 
          * pass the current view into the register page. little detail, but the client should
          * like it.
          */}
        <Link href="/users/register">
          <Button className="-my-0.5 cursor-pointer">Register</Button>
        </Link>
      </div>

      <div className='flex gap-5 w-full justify-center m-5 ml-0 mt-10'>
        <Userbutton
            btnText='Admins'
            btnFunction={() => setCurrentView(userViews.ADMIN)}
            selected={currentView == userViews.ADMIN}
        />
        <Userbutton
            btnText='Instructors'
            btnFunction={() => setCurrentView(userViews.INSTRUCTOR)}
            selected={currentView == userViews.INSTRUCTOR}
        />
        <Userbutton
            btnText='Students'
            btnFunction={() => setCurrentView(userViews.STUDENT)}
            selected={currentView == userViews.STUDENT}
        />
      </div>

      {/* The user table */}
      <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">

        <TableHead>
          <TableRow>
            <TableHeader className='capitalize'>ID</TableHeader>
            <TableHeader>Name</TableHeader>
            <TableHeader>
              { currentView == userViews.STUDENT ? "level" : "Profile Image" }
            </TableHeader>

            {/* Promotion availability only needed for students */}
            {
              currentView == userViews.STUDENT &&
              
              <>
                <TableHeader>Promotion Availability</TableHeader>
                <TableHeader className="text-right">Expired Date</TableHeader>
              </>
            }

          </TableRow>
        </TableHead>

        <TableBody>

          {users && //ensure the students object exists before mapping anything
            users.map((user: IUser) => (
              <TableRow key={user.id} href={`/users/${user.id}`} title={`User #${user.id}`}>
                
                {/* The student's id */}
                <TableCell>{user.id}</TableCell>
                
                {/* Student name */}
                <TableCell>{user.firstName + " " + user.lastName}</TableCell>
                
                
                
                
                {/* For the belt color and user avatar */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar src={user.profileImgUrl} className="size-6" />

                    {/* The belt color is only needed if the user is a student */}
                    {
                      user instanceof Student &&

                      <span className='capitalize'>
                        {Object.values(beltColors)[user.beltColor].toString().toLowerCase()} Belt
                      </span>
                    }

                  </div>
                </TableCell>

                {
                  currentView == userViews.STUDENT &&
                  
                  <>
                    {/* Alerts the admin if the student is available for a promotion */}
                    <TableCell className="text-zinc-500">Availability here</TableCell>

                    <TableCell className="text-right">
                        test
                    </TableCell>
                  </>
                  
                }

              </TableRow>
            ))}
        </TableBody>

      </Table>

      {/* add pagination when the backend is connected. */}
      {/* <Pagination className="mt-10">
        {links &&
          links.length > 0 &&
          links.map((link, idx) =>
            idx === 0 ? (
              <PaginationPrevious key={idx} href={link.url} />
            ) : link.url === null && idx < links.length - 1 ? (
              <PaginationGap key={idx} />
            ) : idx === links.length - 1 ? (
              <PaginationNext key={idx} href={link.url} />
            ) : (
              <PaginationPage key={idx} href={link.url} {...(link.active ? { current: true } : {})}>
                {link.label}
              </PaginationPage>
            )
          )}
      </Pagination> */}
    </>
  )
}
