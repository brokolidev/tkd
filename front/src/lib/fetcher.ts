import axios from '@/lib/axios'


// ref : https://github.com/reck1ess/next-realworld-example-app/blob/master/lib/utils/fetcher.ts
const updateOptions = () => {
  if (typeof window === "undefined") return {};

  if (!('tkd-access-token' in window.localStorage)) return {};

  if (Object.keys(window.localStorage).length === 0) return {};

  const accessToken = window.localStorage.getItem('tkd-access-token');
  
  if (!!accessToken) {
    return {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
  }
};

export default async function (url) {
  const { data } = await axios.get(url, updateOptions());
  return data;
}