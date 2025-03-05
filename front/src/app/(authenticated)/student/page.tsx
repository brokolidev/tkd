'use client'

import { Heading } from '@/components/heading'
import useUser from "@/hooks/swrHooks";
import { getStudentQR } from '@/services/studentServices';
import {QRCodeSVG} from "qrcode.react";
import { useEffect, useState } from 'react';

export default function StudentPage() {

  const { user, isError, isLoading } = useUser()
  
  const [qrCode, setQRCode] = useState("")

  useEffect(() => {
    //load in the qr code
    getStudentQR(user.id)
        .then(qr => {
            setQRCode(qr)
        })
        .catch(err => {
            console.log("ERROR loading QR code: " + err)
        })
  }, []);

  return (
    <>
      <Heading>
        Check-in Code
      </Heading>
      <div className="mt-4">
        {qrCode && <img src={"data:image/png;base64," + qrCode} />}
      </div>
    </>
  )
}
