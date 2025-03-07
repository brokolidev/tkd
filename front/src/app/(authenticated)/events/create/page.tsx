'use client'

import { Divider } from '@/components/divider'
import { Heading, Subheading } from '@/components/heading'
import { Link } from '@/components/link'
import {ChevronLeftIcon, CalendarDateRangeIcon} from '@heroicons/react/16/solid'
import Datepicker from "react-tailwindcss-datepicker";

import {Input} from "@/components/input";
import {useRef, useState} from "react";
import Tiptap from "@/components/tiptap";
import {Button} from "@/components/button";
import axios from "@/lib/axios";

export default function CreateSchedulePage() {

  const [value, setValue] = useState({
    startDate: null,
    endDate: null
  });

  const titleRef = useRef(null);
  const tiptapRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const title = titleRef.current?.value || "";
    const { startDate, endDate } = value;
    const description = tiptapRef.current?.getHTML
      ? tiptapRef.current.getHTML()
      : "";
    
    const payload = {
      title: title,
      startsAt: startDate,
      endsAt: endDate,
      description: description
    }
    
    try {
      const response = await axios.post("/events", payload);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-full">

      <Link href="/events" className="max-lg:hidden inline-flex items-center gap-2 text-sm/6 text-zinc-500 ">
        <ChevronLeftIcon className="size-4 fill-zinc-400 " />
        Events
      </Link>

      <Heading className="mt-4">Create a new event</Heading>
      <Divider className="my-10 mt-6" />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Event Title</Subheading>
        </div>
        <div>
          <Input
            aria-label="Event Title"
            ref={titleRef}
            name="title"
          />
        </div>
      </section>

      <Divider className="my-6" soft />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Period</Subheading>
        </div>
        <div>
          <Datepicker value={value} onChange={newValue => setValue(newValue)} />
        </div>
      </section>
      
      <Divider className="my-6" soft />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Description</Subheading>
        </div>
        <div>
          <Tiptap ref={tiptapRef} />
        </div>
      </section>

      <Divider className="my-10" />

      <div className="flex justify-end gap-4">
        <Button type="submit" className="cursor-pointer text-white bg-black">
          Create
        </Button>
      </div>
    </form>
  )
}
