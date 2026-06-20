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
  await put(BLOB_KEY, JSON.stringify(images), {
    contentType: "application/json",
    access: "private",
    addRandomSuffix: false,
  })
}

function isVercel() {
  return process.env.VERCEL === "1"
}

export async function getAllImages(): Promise<StoredImage[]> {
  if (isVercel()) {
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
  if (!isVercel()) return
  const current = await readBlob()
  const updated = [image, ...(current || [])]
  await writeBlob(updated)
}

export async function removeImage(publicId: string) {
  if (!isVercel()) return
  const current = await readBlob()
  if (!current) return
  await writeBlob(current.filter((img) => img.publicId !== publicId))
}

export async function updateImageCrop(publicId: string, cropX: number, cropY: number) {
  if (!isVercel()) return
  const current = await readBlob()
  if (!current) return
  await writeBlob(
    current.map((img) =>
      img.publicId === publicId ? { ...img, cropX, cropY } : img
    )
  )
}
