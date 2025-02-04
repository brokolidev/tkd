import { userViews } from "@/hooks/userViews"

export interface IUser {
    id: number
    firstName: string
    lastName: string
    email: string
    dateOfBirth: Date
    profileImgUrl: string

    getFullName(): string
}

export class NewUser {
  FirstName: string
  LastName: string
  Email: string
  DateOfBirth: Date
  BeltColor: beltColors | null //not needed for instructors/admins
  Password: string
  Role: userViews
}

export class Student implements IUser {
    id: number
    firstName: string
    lastName: string
    email: string
    dateOfBirth: Date //dateOfBirth is more descriptive and less likely to run into issues than dob
    beltColor: beltColors
    profileImgUrl: string

    constructor(
        id: number,
        firstName: string,
        lastName: string,
        email: string,
        dateOfBirth: Date,
        beltColor: beltColors,
        profileImgUrl: string
    ) {
        this.id = id
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
        this.dateOfBirth = dateOfBirth
        this.beltColor = beltColor
        this.profileImgUrl = profileImgUrl
    }

    /**
     * Gets the fullname of the student
     * @returns The full name of the student
     */
    getFullName(): string {
        return this.firstName + " " + this.lastName
    }
}


export class Instructor implements IUser {
    id: number
    firstName: string
    lastName: string
    email: string
    dateOfBirth: Date //dateOfBirth is more descriptive and less likely to run into issues than dob
    profileImgUrl: string

    constructor(
        id: number,
        firstName: string,
        lastName: string,
        email: string,
        dateOfBirth: Date,
        profileImgUrl: string
    ) {
        this.id = id
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
        this.dateOfBirth = dateOfBirth
        this.profileImgUrl = profileImgUrl
    }

    /**
     * Gets the fullname of the student
     * @returns The full name of the student
     */
    getFullName(): string {
        return this.firstName + " " + this.lastName
    }
}


export class Admin implements IUser {
    id: number
    firstName: string
    lastName: string
    email: string
    dateOfBirth: Date //dateOfBirth is more descriptive and less likely to run into issues than dob
    profileImgUrl: string

    constructor(
        id: number,
        firstName: string,
        lastName: string,
        email: string,
        dateOfBirth: Date,
        profileImgUrl: string
    ) {
        this.id = id
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
        this.dateOfBirth = dateOfBirth
        this.profileImgUrl = profileImgUrl
    }

    /**
     * Gets the fullname of the student
     * @returns The full name of the student
     */
    getFullName(): string {
        return this.firstName + " " + this.lastName
    }
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
