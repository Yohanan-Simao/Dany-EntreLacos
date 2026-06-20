import { put, list } from "@vercel/blob"
import { listImages as listCloudinaryImages } from "./cloudinary"

const BLOB_KEY = "dany-entrelacos-images.json"

export type StoredImage = {
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

function useBlob() {
  return !!process.env.BLOB_READ_WRITE_TOKEN
}

async function readBlob(): Promise<StoredImage[] | null> {
  try {
    const { blobs } = await list({ prefix: BLOB_KEY })
    if (blobs.length === 0) return null
    const res = await fetch(blobs[0].url)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

async function writeBlob(images: StoredImage[]) {
  try {
    await put(BLOB_KEY, JSON.stringify(images), {
      contentType: "application/json",
      access: "public",
      addRandomSuffix: false,
    })
  } catch {
    // blob write failed — data is still in Cloudinary
  }
}

export async function getAllImages(): Promise<StoredImage[]> {
  if (useBlob()) {
    const cached = await readBlob()
    if (cached !== null) return cached
    try {
      const images = await listCloudinaryImages()
      const mapped = images as StoredImage[]
      await writeBlob(mapped)
      return mapped
    } catch {
      return []
    }
  }
  try {
    return await listCloudinaryImages() as StoredImage[]
  } catch {
    return []
  }
}

export async function addImage(image: StoredImage) {
  if (!useBlob()) return
  const current = await readBlob()
  await writeBlob([image, ...(current || [])])
}

export async function removeImage(publicId: string) {
  if (!useBlob()) return
  const current = await readBlob()
  if (!current) return
  await writeBlob(current.filter((img) => img.publicId !== publicId))
}

export async function updateImageCrop(publicId: string, cropX: number, cropY: number) {
  if (!useBlob()) return
  const current = await readBlob()
  if (!current) return
  await writeBlob(
    current.map((img) =>
      img.publicId === publicId ? { ...img, cropX, cropY } : img
    )
  )
}
