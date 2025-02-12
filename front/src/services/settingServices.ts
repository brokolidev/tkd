import axios from '@/lib/axios'
import { IUpdateSetting } from '@/structures/setting'

export async function getSettings() {
  try {
    const response = await axios.get('/settings')
    return response.data
  } catch (error) {
    console.error('Failed to get settings: ', error)
    throw error
  }
}

export async function updateSettings(updateSettings: IUpdateSetting) {
  try {
    const response = await axios.patch('/settings', updateSettings)
    return response.data
  } catch (error) {
    console.error('Failed to update settings: ', error)
    throw error
  }
}
