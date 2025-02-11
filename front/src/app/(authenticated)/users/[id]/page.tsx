'use client'

import { Alert, AlertActions, AlertDescription, AlertTitle } from '@/components/alert'
import { Badge, BadgeProps } from '@/components/badge'
import { Button } from '@/components/button'
import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@/components/description-list'
import { Divider } from '@/components/divider'
import { Heading, Subheading } from '@/components/heading'
import { Link } from '@/components/link'
import { userViews, useUserViews } from '@/hooks/userViews'
import { getAdmin } from '@/services/adminServices'
import { getInstructor } from '@/services/instructorServices'
import { deleteUser } from '@/services/userServices'
import { beltColors, IUser } from '@/structures/users'
import { getStudent } from '@/services/studentServices'
import { CalendarIcon, ChevronLeftIcon } from '@heroicons/react/16/solid'
import { notFound } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function UserPage({ params }: { params: Promise<{ id: string }> }) {
  //this will alert the loadUser function of which endpoint to pull from
  const { currentView } = useUserViews()
  
  const [user, setUser] = useState<IUser>({
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: new Date(),
    beltColor: beltColors.UNKNOWN,
    profileImgUrl: "",
    role: userViews.UNKNOWN
  })
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [showDeleteSuccessAlert, setShowDeleteSuccessAlert] = useState(false)

  const getId = () => {
    return params.then(data => parseInt(data.id))
  }

  const loadUser = (id: number) => {

    let loadFunction = null

    switch (currentView) {
      case userViews.ADMIN:
        loadFunction = getAdmin
        break
      case userViews.INSTRUCTOR:
        loadFunction = getInstructor
        break
      case userViews.STUDENT:
        loadFunction = getStudent
        break
      default:
        //we end up here at least once when the page reloads.
        console.log("invalid view: ", currentView)
        //exit the function. it will be called again if the current view changes
        return
    }

    loadFunction(id)
      .then((data: IUser ) => {
        console.log("The data: ", data, userViews)
        setUser(data)
      })
      .catch((err: string) => {
        console.log("ERROR: " + err)
      })
  }

  useEffect(() => {

    //pull out the id from the parameters
    getId()
      .then(id => {

        //ensure the id is a number
        if (isNaN(id)) {
            //invalid id, return not found
            notFound()
        } else {
            //id is good, load the user
            loadUser(id)
        }
      })
      .catch(err => console.log("ERROR: useEffect: " + err))

  }, [params])


  const getColor = () => {
    //deal with the colors that don't have a value in tailwind

    // console.log(user.beltColor)

    //ensure the function doesn't continue if the user is not a student. Instructors and admins
    //don't have belt colors
    if (!(user.role != userViews.STUDENT)) {
        //this isn't needed if the user isn't a student.
        return
    }

    switch (user.beltColor) {
        case beltColors.BLACK:
            return 'zinc'
        case beltColors.BROWN:
            return 'orange'
        default:
            return beltColors[user.beltColor].toLowerCase() as BadgeProps["color"]
    }
  }

  const deleteCurrentUser = () => {
    //ask the user if they are sure they want to continue
    console.log("Deleting this user", user)

    deleteUser(user.id)
        .then(r => {
            console.log("user " + user.id + " deleted successfully")
            setShowDeleteSuccessAlert(true)
        })
        .catch(err => {
            console.log("ERROR: deleteCurrentUser: " + err)
        })

    //hide the alerts
    setShowDeleteAlert(false)
  }

  if (!user) {
    notFound()
  }

  return (
    <>
      {/* ALERTS */}

      {/* Confirm Delete */}
      <Alert open={showDeleteAlert} onClose={setShowDeleteAlert}>
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            Are you sure you want to delete {user.firstName + " " + user.lastName}? This action
            cannot be undone!
          </AlertDescription>
          <AlertActions>
            <Button onClick={deleteCurrentUser}>Delete User</Button>
            <Button onClick={() => setShowDeleteAlert(false)}>Cancel Deletion</Button>
          </AlertActions>
      </Alert>
      
      {/* Delete Success */}
      <Alert open={showDeleteSuccessAlert} onClose={setShowDeleteSuccessAlert}>
          <AlertTitle>Delete Success</AlertTitle>
          <AlertDescription>
            {user.firstName + " " + user.lastName} has been deleted
          </AlertDescription>
          <AlertActions>
            {/* this won't need to close anything, as the user is directed to a different screen */}
            <Button onClick={() => location.pathname = "/users"}>Return To Users Screen</Button>
          </AlertActions>
      </Alert>

      <div className="max-lg:hidden">
        <Link href="/users" className="inline-flex items-center gap-2 text-sm/6 text-zinc-500 ">
          <ChevronLeftIcon className="size-4 fill-zinc-400 " />
          Users
        </Link>
      </div>
      <div className="mt-4 lg:mt-8">
        <div className="flex items-center gap-4">
          <Heading>{((user?.firstName ?? "") + " " + (user?.lastName ?? ""))}</Heading>

          {
            user.role == userViews.STUDENT &&

            <Badge {...(user.beltColor ? { color: getColor() } : {})}>
              {beltColors[user?.beltColor ?? beltColors.UNKNOWN].toLowerCase()}
            </Badge>
          }

        </div>
        <div className="isolate mt-2.5 flex flex-wrap justify-between gap-x-6 gap-y-4">
          <div className="flex flex-wrap gap-x-10 gap-y-4 py-1.5">
            <span className="flex items-center gap-3 text-base/6 text-zinc-950 sm:text-sm/6">
              <CalendarIcon className="size-4 shrink-0 fill-zinc-400" />
              <span>Trained from</span>
            </span>
          </div>
        </div>
      </div>
      <div className="mt-12">
        <Subheading>Summary</Subheading>
        <Divider className="mt-4" />
        <DescriptionList>
          <DescriptionTerm>User Name</DescriptionTerm>
          <DescriptionDetails>{((user?.firstName ?? "") + " " + (user?.lastName ?? ""))}</DescriptionDetails>
          <DescriptionTerm>Email</DescriptionTerm>
          <DescriptionDetails>{user?.email ?? ""}</DescriptionDetails>
          <DescriptionTerm>Date of Birth</DescriptionTerm>
          <DescriptionDetails>{user?.dateOfBirth?.toDateString() ?? ""}</DescriptionDetails>
          
          {/* Student Specifics */}
          {
            user.role == userViews.STUDENT &&
            <>
              <DescriptionTerm>Belt Color</DescriptionTerm>
              <DescriptionDetails>
                { beltColors[user?.beltColor ?? beltColors.UNKNOWN]?.toLowerCase() }
              </DescriptionDetails>
              <DescriptionTerm>Payment Status</DescriptionTerm>
              <DescriptionDetails>
                <Badge color="lime">Expired at</Badge>
              </DescriptionDetails>
              <DescriptionTerm>Promotion Availability</DescriptionTerm>
              <DescriptionDetails>
                <Badge color="lime">Available</Badge>
              </DescriptionDetails>
            </>
          }
        </DescriptionList>
      </div>
      <div className="mt-10 w-full flex gap-3 justify-end">
        <Button href={"/users/" + user.id + "/edit"} >Edit Information</Button>
        <Button {...{color: 'red'}} onClick={() => setShowDeleteAlert(true)}>Delete User</Button>
      </div>
    </>
  )
}
