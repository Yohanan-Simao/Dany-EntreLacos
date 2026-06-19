import { NextResponse } from "next/server"
import { writeFile, readFile } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { validateToken } from "@/lib/auth"
import { uploadImage, deleteImage } from "@/lib/cloudinary"

const IMAGES_FILE = path.join(process.cwd(), "data", "images.json")
const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"]

async function getImages() {
  if (!existsSync(IMAGES_FILE)) return []
  const data = await readFile(IMAGES_FILE, "utf-8")
  return JSON.parse(data)
}

async function saveImages(images: unknown) {
  await writeFile(IMAGES_FILE, JSON.stringify(images, null, 2))
}

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
  const type = formData.get("type") as string || "produto"

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

  const buffer = Buffer.from(await file.arrayBuffer())

  const { url, publicId } = await uploadImage(buffer, `${Date.now()}-${file.name}`)

  const images = await getImages()
  const newImage = {
    id: Date.now(),
    url,
    publicId,
    title,
    description: description || "",
    type,
    cropX: 50,
    cropY: 50,
    createdAt: new Date().toISOString(),
  }
  images.push(newImage)
  await saveImages(images)

  return NextResponse.json(newImage)
}

export async function GET() {
  const images = await getImages()
  return NextResponse.json(images)
}

export async function PATCH(request: Request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const { id, cropX, cropY } = await request.json()
  const images = await getImages()
  const index = images.findIndex((img: { id: number }) => img.id === id)

  if (index === -1) {
    return NextResponse.json({ error: "Imagem não encontrada" }, { status: 404 })
  }

  images[index] = { ...images[index], cropX, cropY }
  await saveImages(images)

  return NextResponse.json(images[index])
}

export async function DELETE(request: Request) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const { id } = await request.json()
  let images = await getImages()
  const image = images.find((img: { id: number; publicId: string }) => img.id === id)

  if (image?.publicId) {
    await deleteImage(image.publicId)
  }

  images = images.filter((img: { id: number }) => img.id !== id)
  await saveImages(images)

  return NextResponse.json({ success: true })
}
