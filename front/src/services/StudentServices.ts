import axios from '@/lib/axios'
import { Student } from '@/structures/users'
  
export function getStudent(id: number): Promise<Student> {
    return axios.get(`student/${id}`)
        .then((res) => res.data)
}

export function getStudents(page: number) : Promise<Student[]> {
    //get all students in the system. for right now, return a promise of fake data.

    return axios.get(`student?pageNumber=${page}`)
        .then((res) => res.data)
}
