import { NextResponse } from "next/server"
import { list, put } from "@vercel/blob"
import { listImages } from "@/lib/cloudinary"

export async function GET() {
  let blobStatus = "nao testado"
  let blobContent: unknown = null
  let cloudinaryCount = 0

  try {
    const { blobs } = await list({ prefix: "dany-entrelacos-images.json" })
    blobStatus = `encontrado ${blobs.length} blobs`
    if (blobs.length > 0) {
      const res = await fetch(blobs[0].url)
      if (res.ok) {
        blobContent = await res.json()
      } else {
        blobStatus += ` (fetch status ${res.status})`
      }
    }
  } catch (err) {
    blobStatus = `erro: ${err instanceof Error ? err.message : "desconhecido"}`
  }

  try {
    const images = await listImages()
    cloudinaryCount = images.length
  } catch {
    // ignore
  }

  return NextResponse.json({
    vercel: process.env.VERCEL === "1" ? "sim" : "nao",
    blob_token: process.env.BLOB_READ_WRITE_TOKEN ? "configurado" : "FALTANDO",
    blob_status: blobStatus,
    blob_content: blobContent,
    cloudinary: {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "configurado" : "FALTANDO",
      api_key: process.env.CLOUDINARY_API_KEY ? "configurado" : "FALTANDO",
      api_secret: process.env.CLOUDINARY_API_SECRET ? "configurado" : "FALTANDO",
    },
    cloudinary_images: cloudinaryCount,
    admin_password: process.env.ADMIN_PASSWORD ? "configurado" : "FALTANDO",
    node_env: process.env.NODE_ENV,
  })
}
