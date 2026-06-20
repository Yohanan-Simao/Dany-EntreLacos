import { NextResponse } from "next/server"
import { validateToken } from "@/lib/auth"
import { uploadImage, deleteImage, updateImageMeta, listImages } from "@/lib/cloudinary"
import { getAllImages, addImage, removeImage, updateImageCrop } from "@/lib/images-store"

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
    }, file.type)

    const newImage = { id: Date.now(), url, publicId, title, description, type, cropX: 50, cropY: 50, createdAt: new Date().toISOString() }
    addImage(newImage)

    return NextResponse.json(newImage)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido no upload"
    const stack = err instanceof Error ? err.stack : ""
    console.error("Upload error:", message, stack)
    return NextResponse.json({ error: `Cloudinary: ${message}` }, { status: 500 })
  }
}

export async function GET() {
  try {
    const images = await getAllImages()
    return NextResponse.json(images)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido"
    console.error("List error:", message)
    return NextResponse.json({ error: `Erro ao listar imagens: ${message}` }, { status: 500 })
  }
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
  updateImageCrop(publicId, cropX, cropY)
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
  removeImage(publicId)
  return NextResponse.json({ success: true })
}
