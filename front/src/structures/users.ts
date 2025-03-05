import { userViews } from "@/hooks/userViews"

export interface IUser {
    id: number
    firstName: string
    lastName: string
    email: string
    dateOfBirth: Date
    beltColor: beltColors
    profileImage: string
    role: userViews
}

export interface UserPagination {
    
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
    data: IUser[]
}

export interface NewUser {
  FirstName: string
  LastName: string
  Email: string
  DateOfBirth: Date
  BeltColor: beltColors | null //not needed for instructors/admins
  Password: string
  Role: userViews
  profileImage: string
}

/**
 * Holds the various types of belt colors the user may have
 */
export enum beltColors {
  UNKNOWN,
  WHITE,
  YELLOW,
  GREEN,
  BLUE,
  BROWN,
  RED,
  MIXED,
  BLACK
}
