import axios from '@/lib/axios'

export async function getSettings() {
  try {
    const response = await axios.get('/settings')
    return response.data
  } catch (error) {
    console.error('Failed to get settings: ', error)
    throw error
  }
}
