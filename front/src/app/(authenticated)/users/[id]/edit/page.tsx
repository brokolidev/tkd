'use client'

import { Alert, AlertActions, AlertDescription, AlertTitle } from '@/components/alert'
import { Button } from '@/components/button'
import { Divider } from '@/components/divider'
import { Heading, Subheading } from '@/components/heading'
import { Input } from '@/components/input'
import { Link } from '@/components/link'
import { Select } from '@/components/select'
import { userViews, useUserViews } from '@/hooks/userViews'
import { beltColors, IUser } from '@/structures/users'
import { ChevronLeftIcon } from '@heroicons/react/16/solid'
import { NewUser } from '@/structures/users'
import { useEffect, useState } from 'react'
import { updateUser } from '@/services/userServices'
import { buildDate, formatDate } from '@/utils/dates'
import { getAdmin } from '@/services/adminServices'
import { getInstructor } from '@/services/instructorServices'
import { getStudent } from '@/services/studentServices'
import { notFound } from 'next/navigation'

export default function UserEditPage({params}) {

  const { currentView } = useUserViews()

  const [isUpdated, setIsUpdated] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState(new Date())
  const [beltColor, setBeltColor] = useState(beltColors.UNKNOWN)
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

  const getId = () => {
    return params.then(data => parseInt(data.id))
  }

  const loadUser = (id: number) => {

    let loadFunction = null

    switch(currentView) {
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
          console.error("ERROR: loadUser: " + currentView + " is not a valid view")
          return
    }

    loadFunction(id)
      .then((data: IUser) => {
        console.log(data)
        setUser(data)
        setFirstName(data.firstName)
        setLastName(data.lastName)
        setDateOfBirth(data.dateOfBirth)
        setBeltColor(data.beltColor)
      })
      .catch(err => console.log("ERROR: loadUser: " + err))
  }

  useEffect(() => {

    //pull out the id from the parameters
    getId()
      .then((id: number) => {

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



  const formAction = (event) => {
    event.preventDefault()

    const errors: string[] = []

    //alert the user if there are errors that exist

    if (!firstName) {
      errors.push("The first name must be filled in")
    }

    if (!lastName) {
      errors.push("The last name must be filled in")
    }

    //as of right now, the email will stay constant. there's other stuff that will most likely
    //have to happen to get it to work.
    // if (!user.Email) {
    //   errors.push("The email must be filled in")
    // }

    if (!dateOfBirth) {
      errors.push("The birth date must be filled in")
    }

    if (user.role == userViews.STUDENT && user.beltColor == beltColors.UNKNOWN) {
      errors.push("The user is a student, but no belt color was specified")
    }


    //if any errors exist with the data, return from the function and alert the user
    if (errors.length > 0) {
      alert("The following errors occurred while trying to register a user: \n\n"
        + errors.join("\n\n"))
      //exit the function
      return
    }

    //ensure the enum values are numbers, not strings
    const updatedUser: IUser = {firstName, lastName, dateOfBirth, beltColor, ...user}

    if (updatedUser.role == userViews.STUDENT) {
        updatedUser.beltColor = parseInt(updatedUser.beltColor.toString());
        if (isNaN(updatedUser.beltColor)) {
            alert("invalid belt color chosen.")
            return
        }
    }



    updateUser(updatedUser)
      .then(r => {
        console.log("Success: ", r)
        setIsUpdated(true)
      })
      .catch(err => {
        console.log("ERROR: formAction: " + err)
      })
  }

  return (
    <>
      <Alert open={isUpdated} onClose={setIsUpdated}>
        <AlertTitle>Registration Success</AlertTitle>
        <AlertDescription>New User Registered Successfully</AlertDescription>
        <AlertActions>
          <Link href="/users">
            <Button onClick={() => setIsUpdated(false)}>Ok</Button>
          </Link>
        </AlertActions>
      </Alert>
      <div className="max-lg:hidden">
        <Link
          href={"/users/" + user.id}
          className="inline-flex items-center gap-2 text-sm/6 text-zinc-500 dark:text-zinc-400"
        >
          <ChevronLeftIcon className="size-4 fill-zinc-400 dark:fill-zinc-500" />
          Back to User
        </Link>
      </div>

      
      <form onSubmit={formAction} className="mt-4 lg:mt-8">
        <Heading>User Updating</Heading>
        <Divider className="my-10 mt-6" />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Subheading>First Name</Subheading>
          </div>
          <div>
            <Input
              onChange={(event) => setFirstName(event.target.value)}
              value={firstName}
              aria-label="FirstName"
              placeholder="John"
            />
          </div>
          <div className="space-y-1">
            <Subheading>Last Name</Subheading>
          </div>
          <div>
            <Input
              onChange={(event) => setLastName(event.target.value)}
              value={lastName}
              aria-label="LastName"
              placeholder="Doe"
            />
          </div>
          {/* may be needed eventually. don't know how we're handling emails. */}
          {/* <div className="space-y-1">
            <Subheading>Email</Subheading>
          </div>
          <div className="space-y-4">
            <Input
              onChange={setIndividualPropertForUser}
              type="email"
              aria-label="Email"
              name="Email"
              placeholder="info@example.com"
            />
          </div> */}
          <div className="space-y-1">
            <Subheading>Date of Birth</Subheading>
          </div>
          <div>
            <Input
              onChange={(event) => setDateOfBirth(buildDate(event.target.value))}
              value={formatDate(dateOfBirth)}
              aria-label="dateofBirth"
              placeholder="YYYY-MM-DD"
            />
          </div>
          {
            user.role == userViews.STUDENT &&
            <>
              <div className="space-y-1">
                <Subheading>Belt Color</Subheading>
              </div>
              <div>
                <Select
                  aria-label="beltColor"
                  value={beltColor}
                  onChange={(event) => setBeltColor(parseInt(event.target.value))}
                >
                  {
                    //looping refind from https://chatgpt.com/share/6793ebed-e188-800c-8126-8f22d0ae64af
                    Object.entries(beltColors).filter(entry => !isNaN(Number(beltColors[entry[0]])))
                      .map(([key, value]) => (
                        value != beltColors.UNKNOWN &&

                        <option
                          key={value}
                          value={value.toString()}
                          className='capitalize'
                        >
                          { key.toLowerCase() }
                        </option>
                      ))
                  }
                </Select>
              </div>
            </>
          }
        </section>

        <Divider className="my-10" soft />

        <Divider className="my-10" soft />

        <div className="flex justify-end gap-4">
          <Button href={"/users/" + user.id} type="button" plain>
            Cancel
          </Button>
          <Button
            type="submit"
            className="cursor-pointer"
          >
            Update
          </Button>
        </div>
      </form>
    </>
  )
}
