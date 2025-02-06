"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/button";
import { Divider } from "@/components/divider";
import { Heading } from "@/components/heading";
import { getSchedules } from "@/services/SchdeuleServices";
import {
  Pagination,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from "@/components/pagination";
import { Link } from "@/components/link";

function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  async function loadSchedules(): Promise<void> {
    const schedules = await getSchedules();
    setSchedules(schedules);
  }

  useEffect(() => {
    loadSchedules();
  }, []);

  const totalPages = Math.ceil(schedules.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedSchedules = schedules.slice(startIndex, endIndex);

  /** ✅ Function to handle page changes */
  const handlePageClick = (page: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const getPageHref = (page: number) => (page >= 1 && page <= totalPages ? `?page=${page}` : undefined);

  return (
    <div className="space-y-10 p-8">
      <div className="flex items-center justify-between">
        <Heading className="text-xl font-bold">Schedules</Heading>
        <Button className="flex items-center gap-2 bg-black">
          <Link href="/schedules/create" className="inline-flex items-center gap-2 text-sm/6 text-white">
            Create New
          </Link>
        </Button>
      </div>

      <Divider className="my-8 border-gray-300" />

      <div>
        {paginatedSchedules.map((item) => (
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
                <Button
                  onClick={() =>
                    setSchedules((prev) =>
                      prev.map((schedule) =>
                        schedule.id === item.id ? { ...schedule, isOpen: !schedule.isOpen } : schedule
                      )
                    )
                  }
                  className={`px-3 py-1 text-sm ${item.isOpen ? 'bg-green-200 text-green-500' : 'bg-red-200 text-red-500'}`}
                >
                  {item.isOpen ? 'Open' : 'Closed'}
                </Button>
                <Button className="bg-blue-500 px-3 py-1 text-sm text-white">
                  <Link href="/schedules/edit" className="inline-flex items-center gap-2 text-sm/6 text-white">
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
      <Pagination className="flex items-center justify-center space-x-2">
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
  )
}

export default Schedules;
