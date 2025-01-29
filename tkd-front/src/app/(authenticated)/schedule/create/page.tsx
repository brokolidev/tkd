'use client'

import { Alert, AlertActions, AlertDescription, AlertTitle } from '@/components/alert'
import { Button } from '@/components/button'
import { Divider } from '@/components/divider'
import { Heading, Subheading } from '@/components/heading'
import { Input } from '@/components/input'
import { Link } from '@/components/link'
import { Select } from '@/components/select'
import { ChevronLeftIcon, PlusIcon, MinusIcon } from '@heroicons/react/16/solid'
import { useState, useEffect } from 'react'
import { getInstructors } from '@/services/InstructorServices'
import { getStudents } from '@/services/StudentServices'
import axios from 'axios'
import { Avatar } from '@/components/avatar'
// import { Table, TableBody, TableCell, TableRow } from '@/components/table'

export default function SchedulecreatePage() {
  const [isCreated, setIsCreated] = useState(false)
  const [timeSlots, setTimeSlots] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [selectedCustomers, setSelectedCustomers] = useState<any[]>([])
  const [instructors, setInstructors] = useState<any[]>([])  // State for instructors
  const [selectedInstructors, setSelectedInstructors] = useState<any[]>([])

  useEffect(() => {
    fetchCustomers()
    fetchInstructors()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await getStudents(1) 
      const formattedCustomers = response.map((student: any) => ({
        id: student.id,
        name: student.getFullName(),
        email: student.email, 
        profileImgUrl: student.profileImgUrl, 
      }))
      setCustomers(formattedCustomers)
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }

  const fetchInstructors = async () => {
    try {
      const response = await getInstructors(1) 
      const formattedInstructors = response.map((instructor: any) => ({
        id: instructor.id,
        name: `${instructor.firstName} ${instructor.lastName}`,
        profileImgUrl: instructor.profileImgUrl,  
      }))
      setInstructors(formattedInstructors) 
    } catch (error) {
      console.error('Error fetching instructors:', error)
    }
  }

  const handleAddTimeSlot = () => {
    setTimeSlots([...timeSlots, { day: '', startTime: '', endTime: '' }])
  }

  const handleRemoveTimeSlot = (index: number) => {
    const updatedTimeSlots = timeSlots.filter((_, i) => i !== index)
    setTimeSlots(updatedTimeSlots)
  }

  const handleTimeSlotChange = (index: number, field: string, value: string) => {
    const updatedTimeSlots = [...timeSlots]
    updatedTimeSlots[index][field] = value
    setTimeSlots(updatedTimeSlots)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const data = {
      className: formData.get('class_name'),
      timeSlots,
      instructors: selectedInstructors.map((inst) => inst.id),
      customers: selectedCustomers.map((cust) => cust.id),
    }

    try {
      const res = await createSchedule(data)
      if (res.status === 204) {
        setIsCreated(true)
      }
    } catch (error) {
      console.error('Error creating schedule:', error)
    }
  }

  const createSchedule = async (data: any) => {
    try {
      const response = await axios.post('/api/schedules', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      return response
    } catch (error) {
      console.error('Error creating schedule:', error)
      throw error
    }
  }

  return (
    <>
      <Alert open={isCreated} onClose={setIsCreated}>
        <AlertTitle>Congratulations!</AlertTitle>
        <AlertDescription>A new schedule has been created</AlertDescription>
        <AlertActions>
          <Link href="/schedule">
            <Button onClick={() => setIsCreated(false)}>Sounds Good!</Button>
          </Link>
        </AlertActions>
      </Alert>

      <div className="max-lg:hidden">
        <Link href="/schedule" className="inline-flex items-center gap-2 text-sm/6 text-zinc-500 dark:text-zinc-400">
          <ChevronLeftIcon className="size-4 fill-zinc-400 dark:fill-zinc-500" />
          Schedule
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 lg:mt-8">
        <Heading>Create a new schedule</Heading>
        <Divider className="my-10 w-full" />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <Subheading>Class Name</Subheading>
          </div>
          <div>
            <Input aria-label="Class Name" name="class_name" placeholder="Little Warrior 1" />
          </div>
        </section>

        <Divider className="my-10 w-full" />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <Subheading>Time Slots</Subheading>
          </div>
          <div>
            {timeSlots.map((timeSlot, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 items-center mb-4">
                <Select
                  aria-label="Day"
                  value={timeSlot.day}
                  onChange={(e) => handleTimeSlotChange(index, 'day', e.target.value)}
                >
                  <option value="">Select Day</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </Select>

                <Input
                  type="time"
                  aria-label="Start Time"
                  value={timeSlot.startTime}
                  onChange={(e) => handleTimeSlotChange(index, 'startTime', e.target.value)}
                />
                <Input
                  type="time"
                  aria-label="End Time"
                  value={timeSlot.endTime}
                  onChange={(e) => handleTimeSlotChange(index, 'endTime', e.target.value)}
                />
                <Button
                  type="button"
                    onClick={() => handleRemoveTimeSlot(index)}
                       className="p-0 flex items-center justify-center bg-red-500 text-white rounded"
                     style={{ width: '35px', height: '35px' }}
                                    >
                  <MinusIcon className="h-2 w-2" />
                  </Button>
              </div>
            ))}
            <Button type="button" onClick={handleAddTimeSlot} className="inline-flex items-center gap-2">
              <PlusIcon className="size-4" />
              Add Time Slot
            </Button>
          </div>
        </section>

        <Divider className="my-10 w-full" />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <Subheading>Instructors</Subheading>
          </div>
          <div className="max-h-64 overflow-y-auto border rounded-md p-4 bg-gray-50 dark:bg-zinc-800">
            {instructors.length > 0 ? (
              instructors.map((instructor: any) => (
                <div key={instructor.id} className="mb-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={instructor.id}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedInstructors([
                            ...selectedInstructors,
                            { id: instructor.id, name: `${instructor.firstName} ${instructor.lastName}` }
                          ])
                        } else {
                          setSelectedInstructors(
                            selectedInstructors.filter((inst) => inst.id !== instructor.id)
                          )
                        }
                      }}
                    />
                    <Avatar src={instructor.profileImgUrl} className="size-6" />
                    <span className="font-medium">{instructor.name}</span>
                  </label>
                </div>
              ))
            ) : (
              <p>No instructors available</p>
            )}
          </div>
        </section>

        <Divider className="my-10 w-full" />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <Subheading>Customers</Subheading>
          </div>
          <div className="max-h-64 overflow-y-auto border rounded-md p-4 bg-gray-50 dark:bg-zinc-800">
            {customers.length > 0 ? (
              customers.map((customer: any, index: number) => (
                <div key={index} className="mb-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={customer.id}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCustomers([...selectedCustomers, { id: customer.id, name: customer.name }])
                        } else {
                          setSelectedCustomers(
                            selectedCustomers.filter((cust) => cust.id !== customer.id)
                          )
                        }
                      }}
                    />
                    <Avatar src={customer.profileImgUrl} className="size-6" />
                    <span className="font-medium">{customer.name}</span>
                  </label>
                  <p className="text-sm text-gray-500">{customer.email}</p>
                </div>
              ))
            ) : (
              <p>No customers available</p>
            )}
          </div>
        </section>

        <Divider className="my-10 w-full" />

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
