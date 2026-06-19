import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImage(
  buffer: Buffer,
  filename: string
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "dany-entrelacos",
        public_id: filename.replace(/[^a-zA-Z0-9_-]/g, "_"),
        resource_type: "image",
        transformation: [
          { width: 800, height: 800, crop: "limit", quality: "auto:good" },
        ],
      },
      (error, result) => {
        if (error || !result) reject(error || new Error("Upload failed"))
        else resolve({ url: result.secure_url, publicId: result.public_id })
      }
    )
    uploadStream.end(buffer)
  })
}

export async function deleteImage(publicId: string) {
  await cloudinary.uploader.destroy(publicId)
}
