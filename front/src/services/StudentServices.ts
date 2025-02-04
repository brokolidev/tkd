import axios from '@/lib/axios'
import { Student } from '@/structures/users'
import { buildDate } from '@/utils/dates'
  
export function getStudent(id: number): Promise<Student> {
    return axios.get(`student/${id}`)
        .then((res) => ensureValidTypes([res.data])[0])
}

export function getStudents(page: number) : Promise<Student[]> {
    //get all students in the system. for right now, return a promise of fake data.

    return axios.get(`student?pageNumber=${page}`)
        .then((res) => {
            console.log(res.data)

            //perform a few operations on the data to ensure it matches with the types needed
            const students: Student[] = ensureValidTypes(res.data.users)

            //return the list of students
            return {users: students, ...res.data}
        })
}

const ensureValidTypes = (students: Student[]) => {
    
    //ensure we're not altering the original array
    const studentArray = [...students]
    
    //perform the type validation needed.
    studentArray.forEach(student => {
        //map the date string to a date object
        if (student.dateOfBirth) {
            student.dateOfBirth = buildDate(student.dateOfBirth.toString())
        }
    })

    //return the new array with the types corrected.
    return studentArray
}
