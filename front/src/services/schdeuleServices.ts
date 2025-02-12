import axios from '@/lib/axios';
import { SchedulePagination } from '@/structures/schedule';

export async function getSchedules(page: number = 1, pageSize: number = 6, openOnly: boolean = true)
  : Promise<SchedulePagination> {
    try {
        const response = await axios.get(
          '/schedules?pageNumber=' + page + '&pageSize=' + pageSize + '&openOnly=' + openOnly);
        return response.data;
    } catch (e) {
        console.error('Error fetching schedules:', e);
        throw e;
    }
}
