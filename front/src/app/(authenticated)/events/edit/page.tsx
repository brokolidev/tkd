'use client';

import { Alert, AlertActions, AlertDescription, AlertTitle } from '@/components/alert';
import { Button } from '@/components/button';
import { Divider } from '@/components/divider';
import { Heading, Subheading } from '@/components/heading';
import { Input } from '@/components/input';
import { Select } from '@/components/select';
import { ChevronLeftIcon, PlusIcon, MinusIcon } from '@heroicons/react/16/solid';
import { useState } from 'react';
import { Textarea } from '@/components/textarea';
import axios from 'axios';
import { Link } from '@/components/link'


export default function CreateEventPage() {
  const [isCreated, setIsCreated] = useState(false);
  const [timeSlots, setTimeSlots] = useState<any[]>([]);

  const handleAddTimeSlot = () => {
    setTimeSlots([...timeSlots, { day: '', startTime: '', endTime: '' }]);
  };

  const handleRemoveTimeSlot = (index: number) => {
    const updatedTimeSlots = timeSlots.filter((_, i) => i !== index);
    setTimeSlots(updatedTimeSlots);
  };

  const handleTimeSlotChange = (index: number, field: string, value: string) => {
    const updatedTimeSlots = [...timeSlots];
    updatedTimeSlots[index][field] = value;
    setTimeSlots(updatedTimeSlots);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = {
      eventName: formData.get('event_name'),
      description: formData.get('description'),
      timeSlots,
    };

    try {
      const response = await axios.post('/api/events', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 204) {
        setIsCreated(true);
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

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
        <Link href="/events" className="inline-flex items-center gap-2 text-sm/6 text-zinc-500 ">
                  <ChevronLeftIcon className="size-4 fill-zinc-400 " />
                  Events
                </Link>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 lg:mt-8">
        <Heading>Edit a Event</Heading>
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

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2 items-start"> 
  <div className="flex items-center gap-3">
    <Subheading>Time Slots</Subheading>
    <Button 
      type="button" 
      onClick={handleAddTimeSlot} 
      className="flex items-center justify-center bg-blue-500 text-white rounded-full w-1 h-5"
    >
      <PlusIcon className="h-3 w-3" />
    </Button>
  </div>
  <div className="max-h-[300px] overflow-y-auto"> 
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
          className="flex items-center justify-center bg-red-500 text-white rounded-full w-5 h-5"
        >
          <MinusIcon className="h-3 w-3" />
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
          <div>
    <input
      type="file"
      aria-label="Class Image"
      name="class_image"
      accept="image/*"
      onChange={(e) => {
        if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const imagePreview = document.getElementById('classImagePreview') as HTMLImageElement;
            if (imagePreview) imagePreview.src = event.target?.result as string;
          };
          reader.readAsDataURL(e.target.files[0]);
        }
      }}
      className="w-full p-2 border rounded-md"
    />
    {/* <img
      id="classImagePreview"
      alt="Class Preview"
      className="mt-4 rounded-md max-w-full max-h-64"
    /> */}
    {/* till this  */}
  </div>
            <Textarea
              aria-label="Event Description"
              name="description"
              placeholder="Provide details about the event..."
              rows={4}
              className="w-full border border-gray-300 rounded-md"
            />
          </div>
          
        </section>

        <Divider className="my-10 w-full" />

        <div className="flex justify-end gap-4 ">
        <Button type="reset"  className="cursor-pointer bg-black text-white">
            Back
          </Button>
          <Button type="submit" className="cursor-pointer bg-black text-white">
            Create
          </Button>
        </div>
      </form>
    </>
  );
}
