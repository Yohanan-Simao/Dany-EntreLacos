import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

type ImageMeta = {
  title: string
  description: string
  type: string
  cropX: number
  cropY: number
}

function encodeContext(meta: ImageMeta): string {
  return Object.entries(meta)
    .map(([k, v]) => `${k}=${String(v).replace(/[|&=]/g, "_")}`)
    .join("|")
}

function decodeContext(ctx: Record<string, string | Record<string, string>> | undefined): ImageMeta {
  const custom = ctx?.custom
  const meta: Record<string, string> = {}

  if (typeof custom === "string") {
    const pairs = custom.split("|").filter(Boolean)
    for (const pair of pairs) {
      const eq = pair.indexOf("=")
      if (eq > 0) meta[pair.slice(0, eq)] = pair.slice(eq + 1)
    }
  } else if (custom && typeof custom === "object") {
    Object.assign(meta, custom)
  }

  return {
    title: meta.title || "Sem título",
    description: meta.description || "",
    type: meta.type || "produto",
    cropX: parseFloat(meta.cropX) || 50,
    cropY: parseFloat(meta.cropY) || 50,
  }
}

export type { ImageMeta }

export async function uploadImage(
  buffer: Buffer,
  filename: string,
  meta: ImageMeta,
  mimeType: string = "image/jpeg"
): Promise<{ url: string; publicId: string }> {
  const base64 = buffer.toString("base64")
  const dataUri = `data:${mimeType};base64,${base64}`

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "dany-entrelacos",
    public_id: filename.replace(/[^a-zA-Z0-9_-]/g, "_"),
    resource_type: "image",
    context: encodeContext(meta),
    transformation: [
      { width: 800, height: 800, crop: "limit", quality: "auto:good" },
    ],
  })

  return { url: result.secure_url, publicId: result.public_id }
}

export async function updateImageMeta(publicId: string, meta: Partial<ImageMeta>) {
  const existing = await cloudinary.api.resource(publicId, { context: true })
  const current = decodeContext(existing.context)
  const merged = { ...current, ...meta }
  await cloudinary.uploader.explicit(publicId, {
    type: "upload",
    context: encodeContext(merged),
  })
}

export async function deleteImage(publicId: string) {
  await cloudinary.uploader.destroy(publicId)
}

export async function listImages(): Promise<(ImageMeta & { id: number; url: string; publicId: string; createdAt: string })[]> {
  const result = await cloudinary.api.resources({
    type: "upload",
    prefix: "dany-entrelacos/",
    context: true,
    max_results: 100,
  })

  const images = (result.resources || []).map((res: { public_id: string; secure_url: string; created_at: string; context?: Record<string, string | Record<string, string>> }) => {
    const meta = decodeContext(res.context)
    return {
      id: Date.parse(res.created_at) || Math.random(),
      url: res.secure_url,
      publicId: res.public_id,
      createdAt: res.created_at,
      ...meta,
    }
  })

  images.sort((a: { createdAt: string }, b: { createdAt: string }) => b.createdAt.localeCompare(a.createdAt))

  return images
}
