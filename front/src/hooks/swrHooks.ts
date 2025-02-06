import fetcher from '@/lib/fetcher'
import useSWR from 'swr'
import {setCookie} from "@/lib/cookie";

export default function useUser () {
  const { data, error, isLoading } = useSWR(`/user`, fetcher)
  
  return {
    user: data,
    isLoading,
    isError: error
  }
}

 