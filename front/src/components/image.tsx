import { useState } from "react";
import clsx from "clsx";

export default function ImageUpload() {
  const [imagePreview, setImagePreview] = useState('');

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
        className={clsx([
          // Basic layout
          'relative block w-full appearance-none rounded-lg px-[calc(theme(spacing[3.5])-1px)] py-[calc(theme(spacing[2.5])-1px)] sm:px-[calc(theme(spacing[3])-1px)] sm:py-[calc(theme(spacing[1.5])-1px)]',
          // Typography
          'text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 ',
          // Border
          'border border-zinc-950/10 data-[hover]:border-zinc-950/20 ',
          // Background color
          'bg-transparent ',
          // Hide default focus styles
          'focus:outline-none',
          // Invalid state
          'data-[invalid]:border-red-500 data-[invalid]:data-[hover]:border-red-500 data-[invalid]',
          // Disabled state
          'data-[disabled]:border-zinc-950/20',
        ])}
      />
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Class image preview"
          className="mt-4 rounded-md max-w-full max-h-64"
        />
      )}
    </div>
  );
}
