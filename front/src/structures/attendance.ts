import { ISchedule } from "./schedule";
import { IUser } from "./users";

export interface IAttendanceRecord {
    id: number,
    schedule: ISchedule,
    user: IUser,
    dateRecorded: Date
}

export interface AttendancePagination {
    
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
    data: IAttendanceRecord[]
}
