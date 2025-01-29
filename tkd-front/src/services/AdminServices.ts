import axios from '@/lib/axios'
import { beltColors, Admin } from '@/structures/users'
  
export async function getAdmin(id: string): Promise<Admin> {
    return axios.get(`/api/admins/${id}`)
        .then((res) => res.data.data)    
}

export async function getSchedules() {
    return axios.get('/api/schedule')
        .then((res) => res.data.data)
}
  
export async function getAdmins(page: number) : Promise<Admin[]> {
    //get all admins in the system. for right now, return a promise of fake data.

    return new Promise((resolve, reject) => {
        const data: Admin[] = [
            new Admin (
                1,
                "admin",
                "admin",
                "admin@test.test",
                new Date(Date.now()),
                "https://picsum.photos/20",
            ),
            new Admin (
                2,
                "admin",
                "admin",
                "admin@test.test",
                new Date(Date.now()),
                "https://picsum.photos/20",
            ),
            new Admin (
                3,
                "admin",
                "admin",
                "admin@test.test",
                new Date(Date.now()),
                "https://picsum.photos/20",
            ),
            new Admin (
                4,
                "admin",
                "admin",
                "admin@test.test",
                new Date(Date.now()),
                "https://picsum.photos/20",
            ),
            
        ]

        resolve(data)
    })

    // return axios.get(`/api/admins?page=${page}`)
    //     .then((res) => res.data)
}
