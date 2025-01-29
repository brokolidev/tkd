import axios from '@/lib/axios'
import { beltColors, Instructor } from '@/structures/users'
  
export async function getInstructor(id: string): Promise<Instructor> {
    return axios.get(`/api/instructors/${id}`)
        .then((res) => res.data.data)    
}

export async function getSchedules() {
    return axios.get('/api/schedule')
        .then((res) => res.data.data)
}
  
export async function getInstructors(page: number) : Promise<Instructor[]> {
    //get all instructors in the system. for right now, return a promise of fake data.

    return new Promise((resolve, reject) => {
        const data: Instructor[] = [
            new Instructor (
                1,
                "instr1",
                "instr1",
                "instr1@test.test",
                new Date(Date.now()),
                "https://picsum.photos/20",
            ),
            new Instructor (
                2,
                "instr2",
                "instr2",
                "instr2@test.test",
                new Date(Date.now()),
                "https://picsum.photos/20",
            ),
            new Instructor (
                3,
                "instr3",
                "instr3",
                "instr3@test.test",
                new Date(Date.now()),
                "https://picsum.photos/20",
            ),
            new Instructor (
                4,
                "instr4",
                "instr4",
                "instr4@test.test",
                new Date(Date.now()),
                "https://picsum.photos/20",
            ),
            
        ]

        resolve(data)
    })

    // return axios.get(`/api/instructors?page=${page}`)
    //     .then((res) => res.data)
}
