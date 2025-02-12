/**
 * Holds the schedule structure
 */
export interface ISchedule {
    id: number;
    className: string;
    description: string;
    seatsLeft: string;
    isOpen: boolean;
    imageUrl: string;
}

export interface SchedulePagination {
    
    total: number,
    perPage: number,
    currentPage: number,
    lastPage: number,
    firstPageUrl: string,
    lastPageUrl: string,
    nextPageUrl: string,
    prevPageUrl: string,
    from: number,
    to: number,
    data: ISchedule[]
}
