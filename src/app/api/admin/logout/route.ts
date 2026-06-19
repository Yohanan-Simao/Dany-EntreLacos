import { NextResponse } from "next/server"
import { validateToken, revokeToken } from "@/lib/auth"

export async function POST(request: Request) {
  const auth = request.headers.get("authorization")
  if (!auth || !auth.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const token = auth.slice(7)
  const valid = await validateToken(token)

  if (!valid) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 })
  }

  await revokeToken(token)
  return NextResponse.json({ success: true })
}
