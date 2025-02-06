import { userViews } from "@/hooks/userViews"

export interface IUser {
    id: number
    firstName: string
    lastName: string
    email: string
    dateOfBirth: Date
    beltColor: beltColors
    profileImgUrl: string
    role: userViews
}

export interface UserPagination {
    currentPage: number,
    pageSize: number,
    totalItems: number,
    totalPages: number,
    users: IUser[]
}

export interface NewUser {
  FirstName: string
  LastName: string
  Email: string
  DateOfBirth: Date
  BeltColor: beltColors | null //not needed for instructors/admins
  Password: string
  Role: userViews
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
