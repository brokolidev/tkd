'use client'

import { Alert, AlertActions, AlertDescription, AlertTitle } from '@/components/alert'
import { Badge, BadgeProps } from '@/components/badge'
import { Button } from '@/components/button'
import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@/components/description-list'
import { Divider } from '@/components/divider'
import { Heading, Subheading } from '@/components/heading'
import { Link } from '@/components/link'
import { getStudent } from '@/services/StudentServices'
import { beltColors, IUser, Student } from '@/structures/users'
import { CalendarIcon, ChevronLeftIcon } from '@heroicons/react/16/solid'
import { notFound } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function UserPage({ params }: { params: Promise<{ id: string }> }) {
  const [user, setUser] = useState<IUser>(new Student(0, "", "", "", new Date(), beltColors.UNKNOWN,
    ""))
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)

  const getId = () => {
    return params.then(data => parseInt(data.id))
  }

  const loadUser = (id: number) => {

    //this will use the userViews hook to determine where to pull the user from

    getStudent(id)
      .then(data => {
        // console.log(data)
        setUser(data)
      })
      .catch(err => console.log("ERROR: loadUser: " + err))
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
    if (!(user instanceof Student)) {
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

  const deleteUser = () => {
    //ask the user if they are sure they want to continue
    
  }

  if (!user) {
    notFound()
  }

  return (
    <>
      {/* ALERTS */}
      <Alert open={showDeleteAlert} onClose={setShowDeleteAlert}>
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            Are you sure you want to delete {user.firstName + " " + user.lastName}? This action
            cannot be undone!
          </AlertDescription>
          <AlertActions>
            <Button onClick={deleteUser}>Delete User</Button>
            <Button onClick={() => setShowDeleteAlert(false)}>Cancel Deletion</Button>
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
            user instanceof Student &&

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
          <DescriptionDetails>{user?.dateOfBirth.toDateString() ?? ""}</DescriptionDetails>
          <DescriptionTerm>Belt Color</DescriptionTerm>
          <DescriptionDetails>
            {
              user instanceof Student &&
              beltColors[user?.beltColor ?? beltColors.UNKNOWN].toLowerCase()
            }
          </DescriptionDetails>
          <DescriptionTerm>Payment Status</DescriptionTerm>
          <DescriptionDetails>
            <Badge color="lime">Expired at</Badge>
          </DescriptionDetails>
          <DescriptionTerm>Promotion Availability</DescriptionTerm>
          <DescriptionDetails>
            <Badge color="lime">Available</Badge>
          </DescriptionDetails>
        </DescriptionList>
      </div>
      <div className="mt-10 w-full flex gap-3 justify-end">
        <Button>Edit Information</Button>
        <Button {...{color: 'red'}} onClick={() => setShowDeleteAlert(true)}>Delete User</Button>
      </div>
    </>
  )
}
