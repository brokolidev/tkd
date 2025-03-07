'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from '@/lib/axios'
import { Heading, Subheading } from '@/components/heading'
import { Divider } from '@/components/divider'
import { Link } from '@/components/link'
import { ChevronLeftIcon, CalendarIcon, ClockIcon } from '@heroicons/react/16/solid'
import { Button } from '@/components/button'
import EventContent from "@/components/event-content";
import { formatDate } from '@/lib/utils'
import {Badge} from "@/components/badge";

// Type for our event data
interface Event {
  id: number
  title: string
  description: string
  startsAt: string
  endsAt: string
  startsAtFormatted: string
  endsAtFormatted: string
  createdAt: string
  updatedAt: string
  isOpen: boolean
  imageUrl: string
}

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const eventId = params.id

  useEffect(() => {
    if (!eventId) return

    const fetchEvent = async () => {
      try {
        setLoading(true)
        // Adjust the API endpoint to match your backend
        const response = await axios.get(`/events/${eventId}`)
        setEvent(response.data)
      } catch (err) {
        console.error('Error fetching event:', err)
        setError('Failed to load event. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [eventId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center">
          <Heading>Error</Heading>
          <p className="mt-4 text-zinc-600">{error || 'Event not found'}</p>
          <Button
            className="mt-6 cursor-pointer bg-black text-white"
            onClick={() => router.push('/events')}
          >
            Back to Events
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Link href="/events" className="inline-flex items-center gap-2 text-sm/6 text-zinc-500 mb-4">
        <ChevronLeftIcon className="size-4 fill-zinc-400" />
        Events
      </Link>

      <Heading className="mt-4">{event.title}</Heading>

      <div className="flex flex-wrap gap-4 mt-4 mb-6">
        <div className="flex items-center gap-2 text-sm text-zinc-600">
          <CalendarIcon className="size-4 text-zinc-400" />
          <span>
            {event.startsAtFormatted} - {event.endsAtFormatted}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-zinc-600">
          <div className={`w-2 h-2 rounded-full ${event.isOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
          {event.isOpen ? <Badge color="green">Open</Badge> : <Badge color="red">Closed</Badge>}
        </div>
      </div>

      <Divider className="my-6" />

      {/* Event description content */}
      <div className="mt-6">
        <Subheading className="mb-4">Description</Subheading>
        <EventContent htmlContent={event.description} />
      </div>

      <Divider className="my-10" />

      <div className="flex justify-end">
        <Button
          onClick={() => router.push('/events')}
          className="cursor-pointer bg-black text-white"
        >
          Back to Events
        </Button>
      </div>
    </div>
  )
}