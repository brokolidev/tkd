'use client'

import { Alert, AlertActions, AlertDescription, AlertTitle } from '@/components/alert'
import { Button } from '@/components/button'
import { Divider } from '@/components/divider'
import { Heading, Subheading } from '@/components/heading'
import { Input } from '@/components/input'
import { Link } from '@/components/link'
import { Select } from '@/components/select'
import { Textarea } from '@/components/textarea'
import { ChevronLeftIcon, MinusIcon, PlusIcon } from '@heroicons/react/16/solid'
import axios from 'axios'
import { useState } from 'react'
enum DaysOfWeek {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
}

const daysArray = Object.values(DaysOfWeek)

interface TimeSlot {
  day: DaysOfWeek | ''
  startTime: string
  endTime: string
}
export default function CreateEventPage() {
  const [isCreated, setIsCreated] = useState(false)
  const [timeSlots, setTimeSlots] = useState<any[]>([])

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
      eventName: formData.get('event_name'),
      description: formData.get('description'),
      timeSlots,
    }

    try {
      const response = await axios.post('/api/events', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.status === 204) {
        setIsCreated(true)
      }
    } catch (error) {
      console.error('Error creating event:', error)
    }
  }

  return (
    <>
      <Alert open={isCreated} onClose={setIsCreated}>
        <AlertTitle>Congratulations!</AlertTitle>
        <AlertDescription>A new event has been created</AlertDescription>
        <AlertActions>
          <Button onClick={() => setIsCreated(false)}>Close</Button>
        </AlertActions>
      </Alert>

      <div className="max-lg:hidden">
        <Link href="/events" className="inline-flex items-center gap-2 text-sm/6 text-zinc-500">
          <ChevronLeftIcon className="size-4 fill-zinc-400" />
          Events
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 lg:mt-8">
        <Heading>Edit Event</Heading>
        <Divider className="my-10 w-full" />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <Subheading>Event Name</Subheading>
          </div>
          <div>
            <Input aria-label="Event Name" name="event_name" placeholder="Enter event name" />
          </div>
        </section>

        <Divider className="my-10 w-full" />

        {/* Time slot  */}
        <section className="grid items-start gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <Subheading>Time Slots</Subheading>
            <Button
              type="button"
              onClick={handleAddTimeSlot}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white"
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {timeSlots.map((timeSlot, index) => (
              <div key={index} className="mb-4 grid grid-cols-4 items-center gap-4">
                <Select
                  aria-label="Day"
                  value={timeSlot.day}
                  onChange={(e) => handleTimeSlotChange(index, 'day', e.target.value)}
                >
                  <option value="">Select Day</option>
                  {daysArray.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
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
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white"
                >
                  <MinusIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </section>

        <Divider className="my-10 w-full" />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <Subheading>Event Description</Subheading>
          </div>
          <div>
            <div>{/* <ImageUpload /> */}</div>
            <Textarea
              aria-label="Event Description"
              name="description"
              placeholder="Provide details about the event..."
              rows={4}
              className="w-full rounded-md border border-gray-300"
            />
          </div>
        </section>

        <Divider className="my-10 w-full" />

        <div className="flex justify-end gap-4">
          <Button type="reset" className="cursor-pointer bg-black text-white">
            Back
          </Button>
          <Button type="submit" className="cursor-pointer bg-black text-white">
            Create
          </Button>
        </div>
      </form>
    </>
  )
}
