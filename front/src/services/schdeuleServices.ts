import axios from '@/lib/axios'

export async function getSchedules(page: number | null = 1, pageSize: number = 6, openOnly: boolean = true) {
  if (page === null || page === undefined) {
    page = 1
  }

  try {
    const response = await axios.get(
      '/schedules?pageNumber=' + page + '&pageSize=' + pageSize + '&openOnly=' + openOnly
    )
    return response.data
  } catch (e) {
    console.error('Error fetching schedules:', e)
    throw e
  }
}

export async function createSchedule(data: {
  timeSlotId: number
  day: number
  studentIds: number[]
  instructorIds: number[]
  level: string
  isOpen: boolean
}) {
  try {
    const response = await axios.post('/schedules', data)
    return response.data
  } catch (e) {
    console.error('Error creating schedule:', e)
  }
}
