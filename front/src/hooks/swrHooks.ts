import fetcher from '@/lib/fetcher'
import useSWR from 'swr'
import { userViews } from './userViews'

export default function useUser () {
  const { data, error, isLoading } = useSWR(`/user`, fetcher)
  
  const getRole = () => {
    if (!data) {
        return userViews.UNKNOWN
    }

    //pull out the role from the user as a number
    const role = Object.entries(userViews)
      .filter(entry => !isNaN(Number(userViews[entry[0]])))
      .find(([key]) => key.toUpperCase() == data.role.toUpperCase())[1]

    let roleAsUserViews = userViews.UNKNOWN

    //get the role of the user as a userView
    switch (role) {
    case userViews.ADMIN:
      roleAsUserViews = userViews.ADMIN
      break;
    case userViews.INSTRUCTOR:
      roleAsUserViews = userViews.INSTRUCTOR
      break;
    case userViews.STUDENT:
      roleAsUserViews = userViews.STUDENT
      break;
    }

    return roleAsUserViews
  }

  return {
    user: data,
    getRole,
    isLoading,
    isError: error
  }
}

 