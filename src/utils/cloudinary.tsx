//
import axios from "axios";

const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export const uploadImageToCloudinary = async (
  imageUri: string,
  onProgress: (progress: number) => void
): Promise<{ url: string }> => {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("Cloudinary environment variables are not set.");
  }

  const formData = new FormData();
  formData.append("file", {
    uri: imageUri,
    type: "image/jpeg",
    name: `profile_${Date.now()}.jpg`,
  } as any);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      }
    );
    return { url: response.data.secure_url };
  } catch (err: any) {
    // ✅ Yeh line add karne se Cloudinary se aaya hua actual error message dikhega
    console.error('Cloudinary Error:', err.response?.data?.error?.message || err.message);
    throw err; // Error ko aage pass karo
  }
};