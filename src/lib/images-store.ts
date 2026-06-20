import { listImages as listCloudinaryImages } from "./cloudinary"

export async function getAllImages() {
  try {
    return await listCloudinaryImages()
  } catch {
    return []
  }
}
