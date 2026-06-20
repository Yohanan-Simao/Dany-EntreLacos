import { put, list } from "@vercel/blob"
import { listImages as listCloudinaryImages } from "./cloudinary"

const BLOB_KEY = "dany-entrelacos-images.json"

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

let memoryCache: StoredImage[] | null = null

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
      const cloudinaryImages = await listCloudinaryImages()
      const mapped = cloudinaryImages as StoredImage[]
      await writeBlob(mapped)
      return mapped
    } catch {
      return []
    }
  }

  if (memoryCache) return memoryCache
  try {
    const images = await listCloudinaryImages()
    memoryCache = images as StoredImage[]
    return memoryCache
  } catch {
    return []
  }
}

export async function addImage(image: StoredImage) {
  if (isVercel()) {
    const current = await readBlob()
    const updated = [image, ...(current || [])]
    await writeBlob(updated)
    memoryCache = updated
  } else {
    memoryCache = [image, ...(memoryCache || [])]
  }
}

export async function removeImage(publicId: string) {
  if (isVercel()) {
    const current = await readBlob()
    if (current === null) return
    const updated = current.filter((img) => img.publicId !== publicId)
    await writeBlob(updated)
    memoryCache = updated
  } else {
    memoryCache = (memoryCache || []).filter((img) => img.publicId !== publicId)
  }
}

export async function updateImageCrop(publicId: string, cropX: number, cropY: number) {
  if (isVercel()) {
    const current = await readBlob()
    if (current === null) return
    const updated = current.map((img) =>
      img.publicId === publicId ? { ...img, cropX, cropY } : img
    )
    await writeBlob(updated)
    memoryCache = updated
  } else {
    memoryCache = (memoryCache || []).map((img) =>
      img.publicId === publicId ? { ...img, cropX, cropY } : img
    )
  }
}
