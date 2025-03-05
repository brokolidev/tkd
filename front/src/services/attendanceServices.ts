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

export function createAttendanceRecord(userToken: string, timeOverride: string) {

    let endpoint = "attendance/qr"

    if (timeOverride) {
        endpoint += "?timeOverride=" + encodeURIComponent(timeOverride)
    }

    //send the user off to be created at the backend
    return axios.post(endpoint, userToken)
      .then(r => r.data)
      .catch(err => {
        let msg = "No response"

        if (err.response) {
          // The request was made and the server responded with a non-2xx status
          msg = err.response.data
          console.error('Backend Error:', err.response.data); // Extract error message
          console.error('Status Code:', err.response.status);
        } else if (err.request) {
          // The request was made but no response was received
          console.error('No response received:', err.request);
        } else {
          // Something else went wrong
          console.error('Error:', err.message);
        }

        throw new Error(msg);
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
            record.dateRecorded = new Date(record.dateRecorded.toString())
        }
    })

    //return the new array with the types corrected.
    return recordsArray
}
