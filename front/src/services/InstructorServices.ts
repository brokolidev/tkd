import axios from '@/lib/axios'
import { IUser, UserPagination } from '@/structures/users'
import { buildDate } from '@/utils/dates'

export async function getInstructor(id: number): Promise<IUser> {
    return axios.get(`instructor/${id}`)
        .then((res) => ensureValidTypes([res.data])[0])
}
  
export async function getInstructors(page: number) : Promise<UserPagination> {
    //get all instructors in the system. for right now, return a promise of fake data.

    return axios.get(`instructor?pageNumber=${page}`)
        .then((res) => {
            console.log(res.data)

            //perform a few operations on the data to ensure it matches with the types needed
            const instructors: IUser[] = ensureValidTypes(res.data.users)

            //return the list of instructors
            return {users: instructors, ...res.data}
        })
}

const ensureValidTypes = (instructors: IUser[]) => {
    
    //ensure we're not altering the original array
    const instructorArray = [...instructors]
    
    //perform the type validation needed.
    instructorArray.forEach(instructor => {
        //map the date string to a date object
        if (instructor.dateOfBirth) {
            instructor.dateOfBirth = buildDate(instructor.dateOfBirth.toString())
        }
    })

    //return the new array with the types corrected.
    return instructorArray
}
