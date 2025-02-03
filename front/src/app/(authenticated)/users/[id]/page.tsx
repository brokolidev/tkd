'use client'

import { Badge, BadgeProps } from '@/components/badge'
import { Button } from '@/components/button'
import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@/components/description-list'
import { Divider } from '@/components/divider'
import { Heading, Subheading } from '@/components/heading'
import { Link } from '@/components/link'
import { getStudent } from '@/services/StudentServices'
import { beltColors, Student } from '@/structures/users'
import { CalendarIcon, ChevronLeftIcon } from '@heroicons/react/16/solid'
import { notFound } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function UserPage({ params }: { params: Promise<{ id: string }> }) {
  const [student, setStudent] = useState<Student>(new Student(
    0,
    "",
    "",
    "",
    new Date(Date.now()),
    beltColors.UNKNOWN,
    ""
  ))

  const getId = () => {
    return params.then(data => parseInt(data.id))
  }

  const loadStudent = (id: number) => {
    getStudent(id)
      .then(data => {
        console.log(data)
        setStudent(data)
      })
      .catch(err => console.log("ERROR: loadStudent: " + err))
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
            //id is good, load the student
            loadStudent(id)
        }
      })
      .catch(err => console.log("ERROR: useEffect: " + err))

  }, [params])


  const getColor = () => {
    //deal with the colors that don't have a value in tailwind

    console.log(student.beltColor)

    switch (student.beltColor) {
        case beltColors.BLACK:
            return 'zinc'
        case beltColors.BROWN:
            return 'orange'
        case beltColors.WHITE:
            return 'sky'
        default:
            return beltColors[student.beltColor].toLowerCase() as BadgeProps["color"]
    }
  }

  if (!student) {
    notFound()
  }

  return (
    <>
      <div className="max-lg:hidden">
        <Link href="/users" className="inline-flex items-center gap-2 text-sm/6 text-zinc-500 ">
          <ChevronLeftIcon className="size-4 fill-zinc-400 " />
          Users
        </Link>
      </div>
      <div className="mt-4 lg:mt-8">
        <div className="flex items-center gap-4">
          <Heading>{((student?.firstName ?? "") + " " + (student?.lastName ?? ""))}</Heading>
          <Badge {...(student.beltColor ? { color: getColor() } : {})}>
            {beltColors[student?.beltColor ?? beltColors.UNKNOWN]}
          </Badge>
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
          <DescriptionTerm>Student Name</DescriptionTerm>
          <DescriptionDetails>{((student?.firstName ?? "") + " " + (student?.lastName ?? ""))}</DescriptionDetails>
          <DescriptionTerm>Email</DescriptionTerm>
          <DescriptionDetails>{student?.email ?? ""}</DescriptionDetails>
          <DescriptionTerm>Date of Birth</DescriptionTerm>
          <DescriptionDetails>{student?.birthDate?.toDateString() ?? ""}</DescriptionDetails>
          <DescriptionTerm>Belt Color</DescriptionTerm>
          <DescriptionDetails>{student?.beltColor ?? ""}</DescriptionDetails>
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
      <div className="mt-10 text-right">
        <Button>Edit Information</Button>
      </div>
    </>
  )
}
