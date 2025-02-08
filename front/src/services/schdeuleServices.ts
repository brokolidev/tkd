import axios from '@/lib/axios';
import { ISchedule } from '@/structures/schedule';

export async function getSchedules(page: number = 1, pageSize: number = 6, openOnly: boolean = true) {
    try {
        const response = await axios.get(
          '/schedules?pageNumber=' + page + '&pageSize=' + pageSize + '&openOnly=' + openOnly);
        return response.data;
    } catch (e) {
        console.error('Error fetching schedules:', e);
        throw e;
    }
}
