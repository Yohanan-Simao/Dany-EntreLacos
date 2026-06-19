import { NextResponse } from "next/server"
import { validateToken } from "@/lib/auth"
import { uploadImage, deleteImage, updateImageMeta, listImages } from "@/lib/cloudinary"

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error("Cloudinary não configurado! Verifique as variáveis de ambiente.")
}

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"]

async function checkAuth(request: Request) {
  const auth = request.headers.get("authorization")
  if (!auth || !auth.startsWith("Bearer ")) return false
  return validateToken(auth.slice(7))
}

export async function POST(request: Request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get("image") as File
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const type = (formData.get("type") as string) || "produto"

  if (!file || !title) {
    return NextResponse.json({ error: "Imagem e título são obrigatórios" }, { status: 400 })
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Formato não permitido. Use JPEG, PNG, WebP ou AVIF." },
      { status: 400 }
    )
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "Arquivo muito grande. Máximo de 5MB." },
      { status: 400 }
    )
  }

  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json({ error: "Cloudinary não configurado. Faltam variáveis de ambiente." }, { status: 500 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const { url, publicId } = await uploadImage(buffer, `${Date.now()}-${file.name}`, {
      title,
      description: description || "",
      type,
      cropX: 50,
      cropY: 50,
    })

    return NextResponse.json({ id: Date.now(), url, publicId, title, description, type, cropX: 50, cropY: 50 })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido no upload"
    const stack = err instanceof Error ? err.stack : ""
    console.error("Upload error:", message, stack)
    return NextResponse.json({ error: `Cloudinary: ${message}` }, { status: 500 })
  }
}

export async function GET() {
  const images = await listImages()
  return NextResponse.json(images)
}

export async function PATCH(request: Request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const { publicId, cropX, cropY } = await request.json()
  if (!publicId) {
    return NextResponse.json({ error: "publicId é obrigatório" }, { status: 400 })
  }

  await updateImageMeta(publicId, { cropX, cropY })
  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const { publicId } = await request.json()
  if (!publicId) {
    return NextResponse.json({ error: "publicId é obrigatório" }, { status: 400 })
  }

  await deleteImage(publicId)
  return NextResponse.json({ success: true })
}
