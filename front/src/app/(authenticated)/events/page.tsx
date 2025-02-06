'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/button';
import { Divider } from '@/components/divider';
import { Heading } from '@/components/heading';
import { ISchedule } from '@/structures/schedule';
import { mockSchedules, getSchedules } from '@/services/SchdeuleServices';
import {Pagination,PaginationList,PaginationNext,PaginationPage,PaginationPrevious} from '@/components/pagination';
import { BadgeButton } from '@/components/badge'
import { Link } from '@/components/link'
import { ChevronLeftIcon, PlusIcon, MinusIcon } from '@heroicons/react/16/solid'
function EditEvents() {
  const [schedules, setSchedules] = useState<ISchedule[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
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

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const handlePageClick = (page: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const getPageHref = (page: number) => (page >= 1 && page <= totalPages ? `?page=${page}` : undefined);

  return (
    <div className="p-8 space-y-10">
      <div className="flex justify-between items-center">
        <Heading className="text-xl font-bold">Events</Heading>
        <Button className='flex items-center gap-2 bg-black'>
        <Link href="/events/create" className="inline-flex items-center gap-2 text-sm/6 text-white ">
          
          Create New
        </Link></Button>
      </div>
      <Divider className="my-8 border-gray-300" />
      <div>
        {paginatedSchedules.map((item) => (
          <div key={item.id}>
            <div className="flex items-center mb-8">
              <img
                src={item.imageUrl}
                alt={`${item.className} thumbnail`}
                className="w-[128px] h-[85.33px] rounded object-cover mr-4"
              />
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{item.className}</h2>
                <p className="text-sm mt-2">{item.description}</p>
                
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() =>
                    setSchedules((prev) =>
                      prev.map((schedule) =>
                        schedule.id === item.id
                          ? { ...schedule, isOpen: !schedule.isOpen }
                          : schedule
                      )
                    )
                  }
                  className={`px-3 py-1 text-sm ${item.isOpen ? 'bg-green-200 text-green-500' : 'bg-red-200 text-red-500'}`}
                >
                  {item.isOpen ? 'Open' : 'Closed'}
                </Button>
                <Button className="px-3 py-1 text-sm bg-blue-500 text-white">
                <Link href="/events/edit" className="inline-flex items-center gap-2 text-sm/6 text-white ">
          
                   Edit
                       </Link>
                </Button>
              </div>
            </div>
            <Divider className="my-8 border-gray-300" />
          </div>
        ))}
      </div>
    {/* PAGINATION COMPONENT */}
    <Pagination className="flex justify-center items-center space-x-2">
        {/* Previous Button */}
        <button onClick={(e) => handlePageClick(currentPage - 1, e)} disabled={currentPage === 1}>
          <PaginationPrevious href={getPageHref(currentPage - 1)}>Previous</PaginationPrevious>
        </button>

        {/* Pagination List */}
        <PaginationList className="flex space-x-2">
          {[...Array(totalPages)].map((_, index) => (
            <button key={index + 1} onClick={(e) => handlePageClick(index + 1, e)}>
              <PaginationPage href={getPageHref(index + 1)} current={index + 1 === currentPage}>
                {index + 1}
              </PaginationPage>
            </button>
          ))}
        </PaginationList>

        {/* Next Button */}
        <button onClick={(e) => handlePageClick(currentPage + 1, e)} disabled={currentPage === totalPages}>
          <PaginationNext href={getPageHref(currentPage + 1)}>Next</PaginationNext>
        </button>
      </Pagination>

      
    </div>
  );
}

export default EditEvents;
