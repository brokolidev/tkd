'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/button';
import { Divider } from '@/components/divider';
import { Heading } from '@/components/heading';
import { ISchedule } from '@/structures/schedule';
import { mockSchedules } from '@/services/SchdeuleServices';
import { getSchedules } from '@/services/SchdeuleServices';
function Schedules() {
  const [schedules, setSchedules] = useState<ISchedule[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    // Fetch schedules from the API or fallback to mock data.
    const fetchSchedules = async () => {
      try {
        const data = await getSchedules();
        setSchedules(data);
      } catch {
        console.warn('Falling back to mock schedules.');
        setSchedules(mockSchedules);
      }
    };

    fetchSchedules();
  }, []);

  const totalPages = Math.ceil(schedules.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedSchedules = schedules.slice(startIndex, endIndex);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="p-8 space-y-10">
      <div>
        <Heading className="text-xl font-bold">Schedules</Heading>
        <Divider className="my-8 border-gray-300" />
        <div>
          {paginatedSchedules.map((item) => (
            <div key={item.id}>
              <div className="flex items-center mb-8">
                {/* Left Image */}
                <img
                  src={item.imageUrl}
                  alt={`${item.className} thumbnail`}
                  className="w-[128px] h-[85.33px] rounded object-cover mr-4" />
                {/* Schedule Details */}
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{item.className}</h2>
                  <p className="text-sm mt-2">{item.description}</p>
                  <p className="text-sm text-gray-600 mt-1">{item.seatsLeft} seats left</p>
                </div>
                {/* Actions */}
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => setSchedules((prev) => prev.map((schedule) => schedule.id === item.id
                      ? { ...schedule, isOpen: !schedule.isOpen }
                      : schedule
                    )
                    )}
                    // ${item.isOpen ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}
                    className={`px-4 py-2 text-sm dark:bg-green-500`}
                  >
                    {item.isOpen ? 'Open' : 'Closed'}
                  </Button>
                  <Button className="px-4 py-2 text-sm bg-blue-500 text-white">Edit</Button>
                </div>
              </div>
              <Divider className="my-8 border-gray-300" />
            </div>
          ))}
        </div>
      </div>
      {/* Pagination */}
      <div className="flex justify-between items-center mt-10">
        <Button
          outline
          disabled={currentPage === 1}
          onClick={handlePrevious}
          className="text-sm px-4 py-2 border-gray-300"
        >
          Previous
        </Button>
        <div className="text-sm font-semibold">
          Page {currentPage} of {totalPages}
        </div>
        <Button
          outline
          disabled={currentPage === totalPages}
          onClick={handleNext}
          className="text-sm px-4 py-2 border-gray-300"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default Schedules;
