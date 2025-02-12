import axios from '@/lib/axios'
import { IUser, UserPagination } from '@/structures/users'
import { buildDate } from '@/utils/dates'

export async function getAdmin(id: number): Promise<IUser> {
    return axios.get(`admins/${id}`)
        .then((res) => ensureValidTypes([res.data])[0])
}
  
export async function getAdmins(page: number) : Promise<UserPagination> {
    //get all admins in the system. for right now, return a promise of fake data.

    return axios.get(`admins?pageNumber=${page}`)
        .then((res) => {
            console.log(res.data)

            //perform a few operations on the data to ensure it matches with the types needed
            const admins: IUser[] = ensureValidTypes(res.data.data)

            //return the list of admins
            return {users: admins, ...res.data}
        })
}

const ensureValidTypes = (admins: IUser[]) => {
    
    //ensure we're not altering the original array
    const adminArray = [...admins]
    
    //perform the type validation needed.
    adminArray.forEach(admin => {
        //map the date string to a date object
        if (admin.dateOfBirth) {
            admin.dateOfBirth = buildDate(admin.dateOfBirth.toString())
        }
    })

    //return the new array with the types corrected.
    return adminArray
}
