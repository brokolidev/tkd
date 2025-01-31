import axios from '@/lib/axios'
import { Student } from '@/structures/users'
  
export function getStudent(id: string): Promise<Student> {
    return axios.get(`student/${id}`)
        .then((res) => res.data.data)    
}

export function getStudents(page: number) : Promise<Student[]> {
    //get all students in the system. for right now, return a promise of fake data.

    return axios.get(`student?page=${page}`)
        .then((res) => res.data)
}
