import { Button } from "@/components/button";
import { useState } from "react";

interface ImageUploadProps {
  uploadType: "profile" | "schedule";
  onImageUploaded?: (url: string) => void;
}

export default function ImageUpload({ uploadType, onImageUploaded }: ImageUploadProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const uploadImage = async () => {
    if (!imagePreview) return;

    const uploadUrls = [
      uploadType === "profile"
        ? "https://localhost:7183/images/upload"
        : "https://localhost:7183/schedule-images/upload",
      uploadType === "profile" ? "http://localhost:5043/images/upload" : "http://localhost:5043/schedule-images/upload",
    ];

    let success = false;

    for (const url of uploadUrls) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: imagePreview }),
        });

        if (response.ok) {
          const data = await response.json();
          alert("Image uploaded successfully. URL: " + data.fileUrl);
          if (onImageUploaded) onImageUploaded(data.fileUrl);
          success = true;
          break;
        }
      } catch (err) {
        console.warn(`Failed to upload via ${url}:`, err);
      }
    }

    if (!success) {
      alert("Failed to upload image to both servers.");
    }
  };
  return (
    <div>
      <input
        type="file"
        aria-label="Class Image"
        name="class_image"
        accept="image/*"
        onChange={handleImageChange}
        className="w-full rounded-md border p-2"
      />
      {imagePreview && (
        <>
          <img src={imagePreview} alt="Class Preview" className="mt-4 max-h-64 max-w-full rounded-md" />
          <Button
            onClick={uploadImage}
            className="mt-2 rounded-lg bg-green-500 px-4 py-2 text-white shadow hover:bg-green-600"
          >
            Upload Image
          </Button>
        </>
      )}
    </div>
  );
}
