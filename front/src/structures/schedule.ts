/**
 * Holds the schedule structure
 */
export interface ISchedule {
    id: number;
    className: string;
    description: string;
    seatsLeft: string;
    isOpen: boolean;
    imageUrl: string;
}