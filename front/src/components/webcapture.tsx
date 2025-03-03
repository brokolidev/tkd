"use client";

import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/button";

const WebcamCapture: React.FC<{ onImageUploaded?: (url: string) => void }> = ({ onImageUploaded }) => {
  const webcamRef = useRef<Webcam>(null);
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const handleOpenWebcam = () => {
    setIsWebcamOpen(true);
    setImage(null);
  };

  const handleCloseWebcam = () => {
    setIsWebcamOpen(false);
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imgSrc = webcamRef.current.getScreenshot();
      setImage(imgSrc);
      setIsWebcamOpen(false);
    }
  }, [webcamRef]);

  const uploadImage = async () => {
    if (!image) return;

    try {
      const response = await fetch("https://localhost:7183/images/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });

      const data = await response.json();
      alert("Image uploaded successfully. URL: " + data.fileUrl);
      
      // Pass the uploaded image URL back to the parent component if a callback is provided.
      if (onImageUploaded) {
        onImageUploaded(data.fileUrl);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const videoConstraints = {
    facingMode: { ideal: "environment" },
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow">
      {!isWebcamOpen && !image ? (
        <div className="flex justify-center">
          <Button
            onClick={handleOpenWebcam}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow"
          >
            Open Webcam
          </Button>
        </div>
      ) : isWebcamOpen ? (
        <>
          <div className="mb-4">
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="w-full rounded-lg border border-gray-300"
            />
          </div>
          <div className="flex justify-between gap-3">
            <Button
              onClick={capture}
              className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow"
            >
              Capture Photo
            </Button>
            <Button
              onClick={handleCloseWebcam}
              className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow"
            >
              Close Webcam
            </Button>
          </div>
        </>
      ) : image && (
        <div className="mt-4 flex flex-col items-center gap-2">
          <img
            src={image}
            alt="Captured"
            className="w-full rounded-lg border border-gray-300"
          />
          <div className="flex gap-3">
            <Button
              onClick={uploadImage}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow"
            >
              Upload Image
            </Button>
            <Button
              onClick={handleOpenWebcam}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow"
            >
              Retake
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;



///  refernces 
//  [Syed zano], “Access Webcam in ReactJS. Camera access in React,” YouTube, Feb. 25, 2025. [Online]. 
// Available: https://www.youtube.com/watch?v=0HJ1cMBkWJ4.