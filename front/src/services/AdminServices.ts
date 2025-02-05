import axios from '@/lib/axios'
import { Admin } from '@/structures/users'
import { buildDate } from '@/utils/dates'


export interface AdminPagination {
    currentPage: number,
    pageSize: number,
    totalItems: number,
    totalPages: number,
    users: Admin[]
}

export async function getAdmin(id: number): Promise<Admin> {
    return axios.get(`admin/${id}`)
        .then((res) => ensureValidTypes([res.data])[0])
}
  
export async function getAdmins(page: number) : Promise<AdminPagination> {
    //get all admins in the system. for right now, return a promise of fake data.

    return axios.get(`admin?pageNumber=${page}`)
        .then((res) => {
            console.log(res.data)

            //perform a few operations on the data to ensure it matches with the types needed
            const admins: Admin[] = ensureValidTypes(res.data.users)

            //return the list of admins
            return {users: admins, ...res.data}
        })
}

const ensureValidTypes = (admins: Admin[]) => {
    
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
