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
import { useState } from 'react'

export default function StudentRegisterPage() {

  const { currentView } = useUserViews()

  const formAction = (formData) => {
    console.log("the form data: ", formData)

    // await createStudent(formData).then((res) => {
    //   if (res.status === 204) {
    //     setIsCreated(true)
    //   }
    // })
  }

  let [isCreated, setIsCreated] = useState(false)

  return (
    <>
      <Alert open={isCreated} onClose={setIsCreated}>
        <AlertTitle>Congratulations!</AlertTitle>
        <AlertDescription>A new student has been joined successfully</AlertDescription>
        <AlertActions>
          <Link href="/users">
            <Button onClick={() => setIsCreated(false)}>Sounds Good!</Button>
          </Link>
        </AlertActions>
      </Alert>
      <div className="max-lg:hidden">
        <Link href="/users" className="inline-flex items-center gap-2 text-sm/6 text-zinc-500 dark:text-zinc-400">
          <ChevronLeftIcon className="size-4 fill-zinc-400 dark:fill-zinc-500" />
          Users
        </Link>
      </div>

      
      <form action={formAction} className="mt-4 lg:mt-8">
        <Heading>Student Registration</Heading>
        <Divider className="my-10 mt-6" />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Subheading>First Name</Subheading>
          </div>
          <div>
            <Input aria-label="First Name" name="first_name" placeholder="John" />
          </div>
          <div className="space-y-1">
            <Subheading>Last Name</Subheading>
          </div>
          <div>
            <Input aria-label="Last Name" name="last_name" placeholder="Doe" />
          </div>
          <div className="space-y-1">
            <Subheading>Email</Subheading>
          </div>
          <div className="space-y-4">
            <Input type="email" aria-label="Email" name="email" placeholder="info@example.com" />
          </div>
          <div className="space-y-1">
            <Subheading>Date of Birth</Subheading>
          </div>
          <div>
            <Input aria-label="Date of Birth" name="dob" placeholder="02/07/86" />
          </div>
          <div className="space-y-1">
            <Subheading>Belt Color</Subheading>
          </div>
          <div>
            <Select aria-label="Belt Color" name="belt_color" defaultValue="1">
              {
                //looping refind from https://chatgpt.com/share/6793ebed-e188-800c-8126-8f22d0ae64af
                Object.entries(beltColors).filter(entry => !isNaN(Number(beltColors[entry[0]])))
                  .map(([key, value]) => (
                    value != beltColors.UNKNOWN &&

                    <option
                      key={value}
                      value={parseInt(value.toString())}
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
              <Select aria-label='Role' name='role' defaultValue={parseInt(currentView.toString())}>
                {
                //looping refind from https://chatgpt.com/share/6793ebed-e188-800c-8126-8f22d0ae64af
                  Object.entries(userViews).filter(entry => !isNaN(Number(userViews[entry[0]])))
                    .map(([key, value]) => (
                          value != userViews.UNKNOWN &&

                          <option
                            key={value}
                            value={parseInt(value.toString())}
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
            <Input type="password" aria-label="Password" name="password" />
          </div>
          <div className="space-y-1">
            <Subheading>Confirm Password</Subheading>
          </div>
          <div>
            <Input type="password" aria-label="Confirm Password" name="password_confirmation" />
          </div>
        </section>

        <Divider className="my-10" soft />

        <div className="flex justify-end gap-4">
          <Button type="reset" plain>
            Reset
          </Button>
          <Button type="submit" className="cursor-pointer">
            Register
          </Button>
        </div>
      </form>
    </>
  )
}
