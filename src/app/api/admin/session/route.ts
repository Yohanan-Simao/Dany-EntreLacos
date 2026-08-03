import { NextResponse, type NextRequest } from "next/server"
import { validateToken, createToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value
  if (!token || !validateToken(token)) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }
  const res = NextResponse.json({ ok: true })
  const freshToken = createToken()
  res.cookies.set("admin_token", freshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  })
  return res
}
