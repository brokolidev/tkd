'use client'

import { Alert, AlertActions, AlertDescription, AlertTitle } from '@/components/alert'
import { Button } from '@/components/button'
import { Divider } from '@/components/divider'
import { Heading, Subheading } from '@/components/heading'
import { Input } from '@/components/input'
import { Link } from '@/components/link'
import { Select } from '@/components/select'
import { userViews, useUserViews } from '@/hooks/userViews'
import { beltColors } from '@/structures/users'
import { ChevronLeftIcon } from '@heroicons/react/16/solid'
import { NewUser } from '@/structures/users'
import { useState } from 'react'
import { createUser } from '@/services/UserServices'

export default function UserRegisterPage() {

  const { currentView } = useUserViews()

  const formAction = (event) => {
    event.preventDefault()

    console.log(newUser)

    const errors: string[] = []

    //alert the user if there are errors that exist

    //this stuff will be moved to another function later
    if (newUser.Role == userViews.UNKNOWN) {
        errors.push("The user's role must be specified.")
    }

    if (!newUser.FirstName) {
      errors.push("The first name must be filled in")
    }

    if (!newUser.LastName) {
      errors.push("The last name must be filled in")
    }

    if (!newUser.Email) {
      errors.push("The email must be filled in")
    }

    if (!newUser.DateOfBirth) {
      errors.push("The birth date must be filled in")
    }

    if (newUser.BeltColor == beltColors.UNKNOWN && newUser.Role == userViews.STUDENT) {
      errors.push("The user is a student, but no belt color was specified")
    }

    if (!newUser.Password) {
      errors.push("A password must be set")
    }


    //if any errors exist with the data, return from the function and alert the user
    if (errors.length > 0) {
      alert("The following errors occurred while trying to register a user: \n\n"
        + errors.join("\n\n"))
      //exit the function
      return
    }

    //ensure the enum values are numbers, not strings
    const user = {...newUser}

    user.BeltColor = parseInt(user.BeltColor.toString());
    if (isNaN(user.BeltColor)) {
        alert("invalid belt color chosen.")
        return
    }

    user.Role = parseInt(user.Role.toString());
    if (isNaN(user.Role)) {
        alert("invalid role chosen.")
        return
    }


    createUser(user)
      .then(r => {
        console.log("Success: ", r)
        setIsCreated(true)
      })
      .catch(err => {
        console.log("ERROR: formAction: " + err)
      })
  }

  const [isCreated, setIsCreated] = useState(false)
  const [newUser, setNewUser] = useState<NewUser>({
    FirstName: "",
    LastName: "",
    Email: "",
    DateOfBirth: new Date(),
    BeltColor: beltColors.WHITE, //init to white, as that is the default below
    Password: "",
    Role: currentView //init to current view 
  })
  const [confirmPassword, setConfirmPassword] = useState("")

  const setIndividualPropertForUser = (event) => {
    //copy the user so we're not changing newUser directly
    const user = {...newUser}
    //update the property
    user[event.target.name] = event.target.value
    //finally update the newUser
    setNewUser(user)
  }

  return (
    <>
      <Alert open={isCreated} onClose={setIsCreated}>
        <AlertTitle>Registration Success</AlertTitle>
        <AlertDescription>New User Registered Successfully</AlertDescription>
        <AlertActions>
          <Link href="/users">
            <Button onClick={() => setIsCreated(false)}>Return to List</Button>
          </Link>
        </AlertActions>
      </Alert>
      <div className="max-lg:hidden">
        <Link href="/users" className="inline-flex items-center gap-2 text-sm/6 text-zinc-500 dark:text-zinc-400">
          <ChevronLeftIcon className="size-4 fill-zinc-400 dark:fill-zinc-500" />
          Users
        </Link>
      </div>

      
      <form onSubmit={formAction} className="mt-4 lg:mt-8">
        <Heading>Student Registration</Heading>
        <Divider className="my-10 mt-6" />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Subheading>First Name</Subheading>
          </div>
          <div>
            <Input
              onChange={setIndividualPropertForUser}
              aria-label="First Name"
              name="FirstName"
              placeholder="John"
            />
          </div>
          <div className="space-y-1">
            <Subheading>Last Name</Subheading>
          </div>
          <div>
            <Input
              onChange={setIndividualPropertForUser}
              aria-label="Last Name"
              name="LastName"
              placeholder="Doe"
            />
          </div>
          <div className="space-y-1">
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
          </div>
          <div className="space-y-1">
            <Subheading>Date of Birth</Subheading>
          </div>
          <div>
            <Input
              onChange={setIndividualPropertForUser}
              aria-label="Date of Birth"
              name="DateOfBirth"
              placeholder="YYYY-MM-DD"
            />
          </div>
          <div className="space-y-1">
            <Subheading>Belt Color</Subheading>
          </div>
          <div>
            <Select
              aria-label="Belt Color"
              name="BeltColor"
              defaultValue="1"
              onChange={setIndividualPropertForUser}
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
        </section>

        <Divider className="my-10" soft />

          {/* For the user role */}
          <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className='space-y-1'>
              <Subheading>Role</Subheading>
            </div>
            <div>
              <Select
                aria-label='Role'
                name='Role'
                value={newUser.Role}
                onChange={setIndividualPropertForUser}
              >
                {
                //looping refind from https://chatgpt.com/share/6793ebed-e188-800c-8126-8f22d0ae64af
                  Object.entries(userViews).filter(entry => !isNaN(Number(userViews[entry[0]])))
                    .map(([key, value]) => (
                          value != userViews.UNKNOWN &&

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
          </section>

        <Divider className='my-10' soft />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Subheading>Password</Subheading>
          </div>
          <div>
            <Input
              onChange={setIndividualPropertForUser}
              type="password"
              aria-label="Password"
              name="Password"
            />
          </div>
          <div className="space-y-1">
            <Subheading>Confirm Password</Subheading>
          </div>
          <div>
            <Input
              onChange={(event) => setConfirmPassword(event.target.value)}
              type="password"
              aria-label="Confirm Password"
              name="password_confirmation"
            />
          </div>
        </section>

        <Divider className="my-10" soft />

        <div className="flex justify-end gap-4">
          <Button type="reset" plain>
            Reset
          </Button>
          <Button
            type="submit"
            className="cursor-pointer"
            disabled={!(confirmPassword === newUser.Password && newUser.Password != "")}
            title={!(confirmPassword === newUser.Password && newUser.Password != "")
                ? "A valid password is needed before continuing"
                : ""
            }
          >
            Register
          </Button>
        </div>
      </form>
    </>
  )
}
