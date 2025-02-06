import { useState } from "react";

export default function ImageUpload() {
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
        <img
          src={imagePreview}
          alt="Class Preview"
          className="mt-4 rounded-md max-w-full max-h-64"
        />
      )}
    </div>
  );
}
