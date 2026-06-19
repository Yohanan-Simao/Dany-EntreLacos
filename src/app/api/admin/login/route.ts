import { NextResponse } from "next/server"
import { createToken } from "@/lib/auth"

const rateLimit = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + 60000 })
    return true
  }

  if (entry.count >= 5) return false

  entry.count++
  return true
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown"

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Muitas tentativas. Tente novamente em 1 minuto." },
      { status: 429 }
    )
  }

  const { password } = await request.json()

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Senha inválida" }, { status: 401 })
  }

  const token = await createToken()

  return NextResponse.json({ token })
}
