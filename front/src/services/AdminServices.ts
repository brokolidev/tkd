import axios from '@/lib/axios'
import { Admin } from '@/structures/users'
  
export async function getAdmin(id: string): Promise<Admin> {
    return axios.get(`admin/${id}`)
        .then((res) => res.data.data)    
}
  
export async function getAdmins(page: number) : Promise<Admin[]> {
    //get all admins in the system. for right now, return a promise of fake data.

    return axios.get(`admin?pageNumber=${page}&pageSize=100`)
        .then((res) => res.data)
}
