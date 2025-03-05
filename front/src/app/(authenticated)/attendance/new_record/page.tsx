'use client'

import { Heading } from '@/components/heading'
import { Spinner } from '@/components/spinner'
import { createAttendanceRecord } from '@/services/attendanceServices'

// @ts-ignore
import { use, useEffect, useState } from 'react'

export default function UserPage(props) {
  const searchParams: any = use(props.searchParams)
  const userToken: string = searchParams.user
  const timeOverride: string = searchParams.timeOverride

  const [creationFinished, setCreationFinished] = useState(false)
  const [errors, setErrors] = useState("")

  useEffect(() => {
    if (userToken && sessionStorage.getItem("tkd_attendance_already_creating") != "1") {
        //set up a block while the request is going through
        sessionStorage.setItem("tkd_attendance_already_creating", "1")

        //send the token off to the backend to be created
        createAttendanceRecord(userToken, timeOverride)
            .then(r => {
                //response was good
                console.log("Good response: ", r)
            })
            .catch(err => {
                //an error occurred, log it and display it to the screen.
                console.log("ERROR: useEffect: " + err)
                setErrors(err.message)
            })
            .finally(() => {
                //set the creation finished to true, and display how it went to the user
                setCreationFinished(true)
                //remove the block
                sessionStorage.removeItem("tkd_attendance_already_creating")
            })
    } else {
        if (!userToken) {
            setErrors("No token added")
            setCreationFinished(true)
        }
    }
  }, [])

  if (!creationFinished) {
    return <Spinner></Spinner>
  }

  return (
    <>

      {/* The header */}
      <div className="flex items-end justify-between gap-4">
        <Heading className='capitalize'>
          QR Attendance Check In
        </Heading>
      </div>

      {
        errors
          ? (
            <>
              <Heading>Error</Heading>
              <div>
                An Error occurred while trying to create the record:
                <div>
                  {errors}
                </div>
              </div>
            </>
          )
          : (
            <>
              <Heading>Success</Heading>
              <div>User Has been checked in!</div>
            </>
          )
      }

    </>
  )
}
