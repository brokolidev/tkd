"use client";

import React, {useState, useEffect} from "react";
import {Button} from "@/components/button";
import {Divider} from "@/components/divider";
import {Heading} from "@/components/heading";
import {getSchedules} from "@/services/schdeuleServices";
import {
  Pagination, PaginationGap,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from "@/components/pagination";
import {useSearchParams} from 'next/navigation'

function SchedulesPage() {
  const searchParams = useSearchParams()

  const page: number = Number(searchParams.get('page')) || null

  const [schedules, setSchedules] = useState([]);

  // pagination state vars
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [nextPageUrl, setNextPageUrl] = useState('')
  const [prevPageUrl, setPrevPageUrl] = useState('')

  async function loadSchedules(): Promise<void> {
    const schedules = await getSchedules(page, 6, false);
    setSchedules(schedules.data)
    setPaginate(schedules)
  }

  function setPaginate(meta) {
    setCurrentPage(meta.currentPage);
    setLastPage(meta.lastPage);
    setNextPageUrl(meta.nextPageUrl);
    setPrevPageUrl(meta.prevPageUrl);
  }

  useEffect(() => {
    loadSchedules();
  }, [page]);

  return (
    <div className="space-y-10 p-8">
      <div className="flex items-center justify-between">
        <Heading className="text-xl font-bold">Schedules</Heading>
        <Button href="/schedules/create" className="bg-black text-sm/6 text-white">
          Create New
        </Button>
      </div>

      <Divider className="my-8 border-gray-300"/>

      <div>
        {schedules.map((item) => (
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
            <Divider className="my-8 border-gray-300"/>
          </div>
        ))}
      </div>

      <Pagination aria-label="Page Navigation">
        <PaginationPrevious href={prevPageUrl || undefined}/>
        <PaginationList>

          {currentPage > 3 && (
            <>
              <PaginationPage href="?page=1">1</PaginationPage>
              {currentPage > 4 && (
                <>
                  <PaginationPage href="?page=2">2</PaginationPage>
                </>
              )}
              {currentPage > 5 && <PaginationGap />}
            </>
          )}
          
          {currentPage > 1 && (
            <>
              {Array.from({ length: Math.min(2, currentPage - 1) }, (_, i) => {
                const page = currentPage - (i + 1);
                return page > 0 ? (
                  <PaginationPage key={page} href={`?page=${page}`}>
                    {page}
                  </PaginationPage>
                ) : null;
              }).reverse()}
            </>
          )}

          <PaginationPage href={`?page=${currentPage}`} current>{currentPage}</PaginationPage>

          {currentPage < lastPage && (
            <>
              {Array.from({ length: Math.min(2, lastPage - currentPage) }, (_, i) => {
                const nextPage = currentPage + (i + 1);
                return nextPage <= lastPage ? (
                  <PaginationPage key={nextPage} href={`?page=${nextPage}`}>
                    {nextPage}
                  </PaginationPage>
                ) : null;
              })}

              {(lastPage - currentPage - 2) > 2 && <PaginationGap />}
            </>
          )}

          {currentPage < lastPage && (
            <>
              {Array.from({ length: Math.min(2, lastPage - (currentPage + 2)) }, (_, i) => {
                const nextPage = lastPage - i;
                if (nextPage > currentPage + 2) {
                  return (
                    <PaginationPage key={nextPage} href={`?page=${nextPage}`}>
                      {nextPage}
                    </PaginationPage>
                  );
                }
                return null;
              }).reverse()}
            </>
          )}

        </PaginationList>
        <PaginationNext href={nextPageUrl || undefined}/>
      </Pagination>
    </div>
  )
}

export default SchedulesPage;
