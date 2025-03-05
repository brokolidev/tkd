'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/button';
import { Heading } from '@/components/heading';
import { Divider } from '@/components/divider'

function EventPage() {

  const [events, setEvents] = useState([])
  
  useEffect(() => {
  
  }, []);

  return (
    <div className="p-8 space-y-10">

      <div className="flex justify-between items-center">
        <Heading className="text-xl font-bold">Events</Heading>
        <Button href="#/event/create" className="bg-black text-sm/6 text-white">
          Create New
        </Button>
      </div>

      <Divider className="my-8 border-gray-300" />

      <div>
        {events && events.map((item) => (
          <div key={item.id}>
            <div className="mb-8 flex items-center">
              <img
                src={item && item.levelImageUrl}
                alt={`${item.level} thumbnail`}
                className="mr-4 h-[85.33px] w-[128px] rounded object-cover"
              />
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{item.level}</h2>
                <p className="mt-2 text-sm">
                  {item.dayOfWeekString} {item.timeSlot.startsAt} ~ {item.timeSlot.endsAt}
                </p>
                <p className="mt-2 text-sm">
                  Main Instructor : {item.mainInstructorName}
                </p>
                <p className="mt-1 text-sm text-gray-600">{item.classSize} Students in this class</p>
              </div>
              <div className="flex items-center space-x-4">
              </div>
            </div>
            <Divider className="my-8 border-gray-300" />
          </div>
        ))}
      </div>

    </div>
  );
}

export default EventPage;
