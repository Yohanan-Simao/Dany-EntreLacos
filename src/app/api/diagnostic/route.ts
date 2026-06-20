import { NextResponse } from "next/server"
import { getAllImages } from "@/lib/images-store"

export async function GET() {
  const images = await getAllImages()

  return NextResponse.json({
    vercel: process.env.VERCEL === "1" ? "sim" : "nao",
    blob_token: process.env.BLOB_READ_WRITE_TOKEN ? "configurado" : "FALTANDO",
    use_blob: !!process.env.BLOB_READ_WRITE_TOKEN,
    total_images: images.length,
    images: images.slice(0, 3).map((img) => ({
      id: img.id,
      title: img.title,
      type: img.type,
      cropX: img.cropX,
      cropY: img.cropY,
    })),
    cloudinary: {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "ok" : "FALTANDO",
      api_key: process.env.CLOUDINARY_API_KEY ? "ok" : "FALTANDO",
      api_secret: process.env.CLOUDINARY_API_SECRET ? "ok" : "FALTANDO",
    },
    admin_password: process.env.ADMIN_PASSWORD ? "ok" : "FALTANDO",
  })
}
