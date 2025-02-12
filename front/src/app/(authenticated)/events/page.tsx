'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/button';
import { Divider } from '@/components/divider';
import { Heading } from '@/components/heading';
import { ISchedule, SchedulePagination } from '@/structures/schedule';
import { getSchedules } from '@/services/schdeuleServices';
import {Pagination,PaginationList,PaginationNext,PaginationPage,PaginationPrevious} from '@/components/pagination';
import { Link } from '@/components/link'
function EditEvents() {
  const [schedules, setSchedules] = useState<ISchedule[]>([])
  const [pageInfo, setPageInfo] = useState<SchedulePagination>({
      total: 0,
      perPage: 0,
      currentPage: 0,
      lastPage: 0,
      firstPageUrl: "",
      lastPageUrl: "",
      nextPageUrl: "",
      prevPageUrl: "",
      from: 0,
      to: 0,
      data: [] //THIS SHOULD NEVER BE USED. USE SCHEDULES INSTEAD
    })
  const [currentPage, setCurrentPage] = useState(1);

  const fetchSchedules = async () => {
    try {
      const data = await getSchedules();
      console.log(data)
      setPageInfo(data);
    } catch(err) {
      console.log('ERROR: fetchSchedules: ' + err);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const getPageHref = (page: number) => (page >= 1 && page <= pageInfo.lastPage ? `?page=${page}` : undefined);

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
        {pageInfo.data.map((item) => (
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
        <PaginationPrevious href={getPageHref(currentPage - 1)}>Previous</PaginationPrevious>

        {/* Pagination List */}
        <PaginationList className="flex space-x-2">
          {[...Array(pageInfo.lastPage)].map((_, i) => (
            <PaginationPage key={i} href={getPageHref(i + 1)} current={i + 1 === currentPage}>
              {i + 1}
            </PaginationPage>
          ))}
        </PaginationList>

        {/* Next Button */}
        <PaginationNext href={getPageHref(currentPage + 1)}>Next</PaginationNext>
      </Pagination>

      
    </div>
  );
}

export default EditEvents;
