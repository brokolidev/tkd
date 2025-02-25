import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";

const WebcamCapture: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [image, setImage] = useState<string | null>(null);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imgSrc = webcamRef.current.getScreenshot();
      setImage(imgSrc);
    }
  }, [webcamRef]);

  const uploadImage = async () => {
    if (!image) return;

    try {
      const response = await fetch("", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="border border-gray-300 rounded-lg"
      />
      <button onClick={capture} className="mt-2 p-2 bg-blue-500 text-white rounded">
        Capture Photo
      </button>
      {image && (
        <div className="mt-4">
          <img src={image} alt="Captured" className="border border-gray-300 rounded-lg" />
          <button onClick={uploadImage} className="mt-2 p-2 bg-green-500 text-white rounded">
            Upload Image
          </button>
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;
