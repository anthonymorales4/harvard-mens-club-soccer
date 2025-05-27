"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export default function ProfileImageUpload({ userId, currentImageUrl }) {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(currentImageUrl || "");
  const [error, setError] = useState(null);

  // Update local state when prop changes
  useEffect(() => {
    setImageUrl(currentImageUrl || "");
  }, [currentImageUrl]);

  // Handle file upload event
  async function handleUpload(event) {
    try {
      setUploading(true);
      setError(null);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-${Math.random()
        .toString(36)
        .substring(2, 15)}.${fileExt}`;
      const filePath = `profiles/${fileName}`;

      // Check if file is an image
      if (!file.type.match(/image\/(jpeg|jpg|png|gif)/i)) {
        throw new Error(
          "File type not supported. Please upload an image (JPEG, PNG, or GIF)."
        );
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size too large. Maximum size is 5MB.");
      }

      // Upload image to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from("profile-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL for the uploaded image
      const {
        data: { publicUrl },
      } = supabase.storage.from("profile-images").getPublicUrl(filePath);

      // Update the profile in the database
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ profile_image_url: publicUrl })
        .eq("id", userId);

      if (updateError) throw updateError;

      // Update local state
      setImageUrl(publicUrl);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error uploading image:", error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-[#A51C30] mb-4">
        <Image
          src={imageUrl || "/images/profilepic.svg"}
          alt="Profile"
          fill
          className="object-cover"
          onError={(e) => {
            // Fallback to default image on error
            e.target.src = "/images/profilepic.svg";
          }}
        />
      </div>

      <label className="block">
        <span className="sr-only">Choose profile photo</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-[#A51C30] file:text-white
            hover:file:bg-[#8a1726]
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </label>

      {uploading && (
        <div className="mt-2 text-sm text-gray-600">Uploading...</div>
      )}

      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}

      <p className="mt-2 text-xs text-gray-500">JPG, PNG or GIF. Max 5MB.</p>
    </div>
  );
}
