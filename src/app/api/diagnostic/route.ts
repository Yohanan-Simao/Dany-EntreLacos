import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    cloudinary: {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "configurado" : "FALTANDO",
      api_key: process.env.CLOUDINARY_API_KEY ? "configurado" : "FALTANDO",
      api_secret: process.env.CLOUDINARY_API_SECRET ? "configurado" : "FALTANDO",
    },
    admin_password: process.env.ADMIN_PASSWORD ? "configurado" : "FALTANDO",
    node_env: process.env.NODE_ENV,
  })
}
