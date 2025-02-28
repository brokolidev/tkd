import axios from "@/lib/axios";

export async function getTimeSlots() {
  try {
    const response = await axios.get(
      '/timeslots');
    return response.data;
  } catch (e) {
    console.error('Error fetching timeslots:', e);
    throw e;
  }
}
