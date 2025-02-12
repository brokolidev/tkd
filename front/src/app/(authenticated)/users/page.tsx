'use client'

import { Avatar } from '@/components/avatar'
import { Button } from '@/components/button'
import { Userbutton } from '@/components/cutom/user-button'
import { Heading } from '@/components/heading'
import { Link } from '@/components/link'
import { Pagination, PaginationGap, PaginationNext, PaginationPage, PaginationPrevious } from '@/components/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { userViews, useUserViews } from '@/hooks/userViews'
import { getAdmins } from '@/services/adminServices'
import { getInstructors } from '@/services/instructorServices'
import { getStudents } from '@/services/studentServices'
import { beltColors, IUser, UserPagination } from '@/structures/users'

// @ts-ignore
import { use, useEffect, useState } from 'react'

export default function UserPage(props) {
  const searchParams: any = use(props.searchParams)
  const page = searchParams.page ? parseInt(searchParams.page) : 1

  const [users, setUsers] = useState<IUser[]>([])
  const [pageInfo, setPageInfo] = useState<UserPagination>({
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

  /**
   * Loads the users in from the BE, based on the user view chosen
   */
  const loadData = () => {
    
    let loadFunction = null

    //load in the correct users for the chosen view
    switch (currentView) {
      case userViews.ADMIN:
        loadFunction = getAdmins
          
        break
      case userViews.INSTRUCTOR:
        loadFunction = getInstructors
        break
      case userViews.STUDENT:
        loadFunction = getStudents
        break
      default:
        //we end up here at least once when the page reloads.
        console.log("invalid view: ", currentView)
        //exit the function. it will be called again if the current view changes
        return
    }

    loadFunction(page)
      .then((data: UserPagination) => {
        console.log("The data: ", data)
        setPageInfo(data)
        setUsers(data.data)

      })
      .catch((err: string) => {
        console.log("ERROR: " + err)
      })
  }

  useEffect(() => {
    //pass the function off to load the data
    loadData()
  }, [page, currentView])

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
  
  //This will be needed eventually, but right now, it can probably just be commented out.
//   const conditionalStyle = (expiredAt) => {
//     const currentDate = new Date().valueOf()
//     const expirationDate = new Date(expiredAt).valueOf()
//     const daysUntilExpiration: number = (expirationDate - currentDate) / (1000 * 60 * 60 * 24)

//     return {
//       color: daysUntilExpiration <= 5 && daysUntilExpiration >= 0 ? 'red' : '',
//     }
//   }

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
                      user.role == userViews.STUDENT &&

                      <span className='capitalize'>
                        {Object.values(beltColors)[user?.beltColor ?? 0].toString().toLowerCase()}
                        &nbsp;Belt
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

      <Pagination className="mt-8">
        { pageInfo?.lastPage > 1 &&
          buildPagination()
        }
      </Pagination>
    </>
  )
}
