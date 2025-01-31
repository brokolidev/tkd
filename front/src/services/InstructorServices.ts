import axios from '@/lib/axios'
import { Instructor } from '@/structures/users'
  
export async function getInstructor(id: string): Promise<Instructor> {
    return axios.get(`instructor/${id}`)
        .then((res) => res.data.data)    
}
  
export async function getInstructors(page: number) : Promise<Instructor[]> {
    //get all instructors in the system. for right now, return a promise of fake data.

    return axios.get(`instructor?pageNumber=${page}`)
        .then((res) => res.data)
}
