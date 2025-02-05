'use client'

import { Heading } from '@/components/heading'
import useUser from "@/hooks/swrHooks";
import {QRCodeSVG} from "qrcode.react";

export default function StudentPage() {

  const { user, isError, isLoading } = useUser()
  
  const url = "localhost:5043/checkin/test";

  // async function loadSchedules(): Promise<void> {
  //   await axios.get('/schedule').then((response) => {
  //     setSchedules(response.data);
  //   });
  // }

  // useEffect(() => {
  //   loadUserCounts();
  // }, []);

  return (
    <>
      <Heading>
        Check-in Code
      </Heading>
      <div className="mt-4">
        {url && <QRCodeSVG value={url} size={256} />}
      </div>
    </>
  )
}
