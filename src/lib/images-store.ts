import { listImages as listCloudinaryImages } from "./cloudinary"

type StoredImage = {
  id: number
  publicId: string
  url: string
  title: string
  description: string
  type: string
  cropX: number
  cropY: number
  createdAt: string
}

let cache: StoredImage[] | null = null

export async function getAllImages(): Promise<StoredImage[]> {
  if (cache) return cache
  try {
    const images = await listCloudinaryImages()
    cache = images as StoredImage[]
  } catch {
    cache = []
  }
  return cache
}

export function addImage(image: StoredImage) {
  if (cache) {
    cache = [image, ...cache]
  }
}

export function removeImage(publicId: string) {
  if (cache) {
    cache = cache.filter((img) => img.publicId !== publicId)
  }
}

export function updateImageCrop(publicId: string, cropX: number, cropY: number) {
  if (cache) {
    cache = cache.map((img) =>
      img.publicId === publicId ? { ...img, cropX, cropY } : img
    )
  }
}
