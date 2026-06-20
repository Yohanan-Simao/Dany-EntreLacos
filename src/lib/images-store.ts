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

function isVercel() {
  return process.env.VERCEL === "1"
}

export async function getAllImages(): Promise<StoredImage[]> {
  if (isVercel()) {
    try {
      const { blobs } = await list({ prefix: BLOB_KEY })
      if (blobs.length === 0) {
        const images = await listCloudinaryImages()
        const mapped = images as StoredImage[]
        await writeBlob(mapped)
        return mapped
      }
      const res = await fetch(blobs[0].url)
      return await res.json()
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

async function writeBlob(images: StoredImage[]) {
  try {
    await put(BLOB_KEY, JSON.stringify(images), {
      contentType: "application/json",
      access: "private",
      addRandomSuffix: false,
    })
  } catch {
    // blob write failed — data is still in Cloudinary
  }
}

async function updateBlob(mutate: (images: StoredImage[]) => StoredImage[]) {
  if (!isVercel()) return
  try {
    const current = await getAllImages()
    const updated = mutate(current)
    await writeBlob(updated)
    memoryCache = updated
  } catch {
    // silent
  }
}

export async function addImage(image: StoredImage) {
  if (isVercel()) {
    await updateBlob((current) => [image, ...current])
  }
  memoryCache = [image, ...(memoryCache || [])]
}

export async function removeImage(publicId: string) {
  if (isVercel()) {
    await updateBlob((current) => current.filter((img) => img.publicId !== publicId))
  }
  memoryCache = (memoryCache || []).filter((img) => img.publicId !== publicId)
}

export async function updateImageCrop(publicId: string, cropX: number, cropY: number) {
  if (isVercel()) {
    await updateBlob((current) =>
      current.map((img) => (img.publicId === publicId ? { ...img, cropX, cropY } : img))
    )
  }
  memoryCache = (memoryCache || []).map((img) =>
    img.publicId === publicId ? { ...img, cropX, cropY } : img
  )
}
