import axios from '@/lib/axios'
import { beltColors, Student } from '@/structures/users'
  
export function getStudent(id: string): Promise<Student> {
    return axios.get(`/api/students/${id}`)
        .then((res) => res.data.data)    
}

export function getSchedules() {
    return axios.get('/api/schedule')
        .then((res) => res.data.data)
}
  
export function getStudents(page: number) : Promise<Student[]> {
    //get all students in the system. for right now, return a promise of fake data.

    return new Promise((resolve, reject) => {
        const data: Student[] = [
            new Student (
                1,
                "test1",
                "test1",
                "test1@test.test",
                new Date(Date.now()),
                beltColors.WHITE,
                "https://picsum.photos/20",
            ),
            new Student (
                2,
                "test2",
                "test2",
                "test2@test.test",
                new Date(Date.now()),
                beltColors.WHITE,
                "https://picsum.photos/20",
            ),
            new Student (
                3,
                "test3",
                "test3",
                "test3@test.test",
                new Date(Date.now()),
                beltColors.WHITE,
                "https://picsum.photos/20",
            ),
            new Student (
                4,
                "test4",
                "test4",
                "test4@test.test",
                new Date(Date.now()),
                beltColors.WHITE,
                "https://picsum.photos/20",
            ),
            new Student (
                5,
                "test5",
                "test5",
                "test5@test.test",
                new Date(Date.now()),
                beltColors.WHITE,
                "https://picsum.photos/20",
            ),
            new Student (
                6,
                "test6",
                "test6",
                "test6@test.test",
                new Date(Date.now()),
                beltColors.WHITE,
                "https://picsum.photos/20",
            ),
            new Student (
                7,
                "test7",
                "test7",
                "test7@test.test",
                new Date(Date.now()),
                beltColors.WHITE,
                "https://picsum.photos/20",
            ),
            new Student (
                8,
                "test8",
                "test8",
                "test8@test.test",
                new Date(Date.now()),
                beltColors.WHITE,
                "https://picsum.photos/20",
            ),
            new Student (
                9,
                "test9",
                "test9",
                "test9@test.test",
                new Date(Date.now()),
                beltColors.WHITE,
                "https://picsum.photos/20",
            ),
            new Student (
                10,
                "test10",
                "test10",
                "test10@test.test",
                new Date(Date.now()),
                beltColors.WHITE,
                "https://picsum.photos/20",
            ),
            
        ]

        resolve(data)
    })

    // return axios.get(`/api/students?page=${page}`)
    //     .then((res) => res.data)
}
