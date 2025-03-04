import { useState } from "react";
import { Button } from "@/components/button";

export default function ImageUpload({ onImageUploaded }: { onImageUploaded?: (url: string) => void }) {
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

    try {
      const response = await fetch("https://localhost:7183/api/images/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imagePreview }),
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

  return (
    <div>
      <input
        type="file"
        aria-label="Class Image"
        name="class_image"
        accept="image/*"
        onChange={handleImageChange}
        className="w-full p-2 border rounded-md"
      />
      {imagePreview && (
        <>
          <img
            src={imagePreview}
            alt="Class Preview"
            className="mt-4 rounded-md max-w-full max-h-64"
          />
          <Button
            onClick={uploadImage}
            className="mt-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow"
          >
            Upload Image
          </Button>
        </>
      )}
    </div>
  );
}
