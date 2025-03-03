/**
 * Holds the schedule structure
 */
export interface ISchedule {
    id: number;
    className: string;
    description: string;
    level: string;
    seatsLeft: string;
    isOpen: boolean;
    imageUrl: string;
}
