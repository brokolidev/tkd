import axios from '@/lib/axios';

export async function getEvents(page: number = 1, pageSize: number = 6, openOnly: boolean = true) {
    if (page === null || page === undefined) {
        page = 1
    }
    
    try {
        const response = await axios.get(
          '/events?pageNumber=' + page + '&pageSize=' + pageSize + '&openOnly=' + openOnly);
        return response.data;
    } catch (e) {
        console.error('Error fetching events:', e);
        throw e;
    }
}
