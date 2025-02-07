import axios from '@/lib/axios';
import { ISchedule } from '@/structures/schedule';



// export async function getSchedules(): Promise<ISchedule[]> {
//     try {
//         const response = await axios.get('/api/schedule');
//         return response.data.data;
//     } catch (error) {
//         console.error('Error fetching schedules:', error);
//         throw error;
//     }
// }


export async function getSchedules(page: number = 1, pageSize = 30, openOnly: boolean = true) {
    try {
        const response = await axios.get('/schedule?page=' + page + '&pageSize=' + pageSize + '&openOnly=' + openOnly);
        return response.data;
    } catch (e) {
        console.error('Error fetching schedules:', e);
        throw e;
    }
}


export const mockSchedules: ISchedule[] = [
    {
        id: 1,
        className: 'Beginner Taekwondo',
        description: 'Introduction to Taekwondo basics and techniques.',
        seatsLeft: '12/50',
        isOpen: true,
        imageUrl: 'https://picsum.photos/128/85',
    },
    {
        id: 2,
        className: 'Intermediate Taekwondo',
        description: 'Focus on forms, sparring, and advanced techniques.',
        seatsLeft: '10/50',
        isOpen: true,
        imageUrl: 'https://picsum.photos/128/85',
    },
    {
        id: 3,
        className: 'Advanced Taekwondo',
        description: 'Master-level skills and competitive training.',
        seatsLeft: '5/50',
        isOpen: true,
        imageUrl: 'https://picsum.photos/128/85',
    },
    {
        id: 4,
        className: 'Taekwondo for Kids',
        description: 'Fun and engaging Taekwondo sessions for children.',
        seatsLeft: '20/50',
        isOpen: false,
        imageUrl: 'https://picsum.photos/128/85',
    },
    {
        id: 5,
        className: ' Taekwondo- pre-leque ',
        description: 'Introduction to matches and table for Taekwondo- pre-leque .',
        seatsLeft: '12/50',
        isOpen: true,
        imageUrl: 'https://picsum.photos/128/85',
    },
    {
        id: 6,
        className: 'practice for Taekwondo- pre-leque',
        description: 'practice for Taekwondo basics and techniques that is going to used in Taekwondo- pre-leque.',
        seatsLeft: '12/50',
        isOpen: true,
        imageUrl: 'https://picsum.photos/128/85',
    },
    {
        id: 7,
        className: 'Intermediate Taekwondo- pre-leque',
        description: 'There is going to be intermediate level class matches.',
        seatsLeft: '21/30',
        isOpen: true,
        imageUrl: 'https://picsum.photos/128/85',
    },{
        id: 8,
        className: 'Finals Taekwondo- pre-leque',
        description: 'Final exam and physical test for Taekwondo- pre-leque .',
        seatsLeft: '10/15',
        isOpen: true,
        imageUrl: 'https://picsum.photos/128/85',
    }
];
