import axios from "@/lib/axios";
import { AttendancePagination, IAttendanceRecord } from "@/structures/attendance";
import { buildDate } from "@/utils/dates";

export function getRecordsForUser(page: number, userId: number)
    : Promise<AttendancePagination> {
    
    //get all students in the system. for right now, return a promise of fake data.

    return axios.get(`attendance/${userId}?pageNumber=${page}`)
        .then((res) => {
            console.log(res)

            //perform a few operations on the data to ensure it matches with the types needed
            const records: IAttendanceRecord[] = ensureValidTypes(res.data.data)

            //return the list of students
            return {data: records, ...res.data}
        })
}

export function deleteRecord(id: number) {
    return axios.delete(`attendance/${id}`)
        .catch(err => {
            console.log("ERROR: deleteRecord: " + err)
            throw new Error("ERROR: deleteRecord: " + err)
        })
} 

const ensureValidTypes = (records: IAttendanceRecord[]) => {
    
    //ensure we're not altering the original array
    const recordsArray = [...records]
    
    //perform the type validation needed.
    recordsArray.forEach(record => {
        //map the date string to a date object
        if (record.dateRecorded) {
            record.dateRecorded = buildDate(record.dateRecorded.toString())
        }
    })

    //return the new array with the types corrected.
    return recordsArray
}
