import { NextResponse } from "next/server"
import { createToken, verifyPassword } from "@/lib/auth"
import { checkRateLimit } from "@/lib/rate-limit"

export async function POST(request: Request) {
  const xff = request.headers.get("x-forwarded-for") || ""
  const ip = xff.split(",")[0].trim() || "unknown"

  if (!(await checkRateLimit(ip))) {
    return NextResponse.json(
      { error: "Muitas tentativas. Tente novamente em alguns minutos." },
      { status: 429 }
    )
  }

  let password: unknown
  try {
    const body = await request.json()
    password = body?.password
  } catch {
    return NextResponse.json({ error: "Requisição inválida" }, { status: 400 })
  }

  if (typeof password !== "string" || !verifyPassword(password)) {
    return NextResponse.json({ error: "Senha inválida" }, { status: 401 })
  }

  const token = createToken()
  const res = NextResponse.json({ ok: true })
  res.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  })
  return res
}
