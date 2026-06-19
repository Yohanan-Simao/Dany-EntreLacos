import { createHmac, randomBytes } from "crypto"

const SECRET = process.env.ADMIN_PASSWORD || "fallback-secret"
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000

export function createToken(): string {
  const payload = `${Date.now()}:${randomBytes(8).toString("hex")}`
  const signature = createHmac("sha256", SECRET).update(payload).digest("hex")
  return `${payload}.${signature}`
}

export function validateToken(token: string): boolean {
  try {
    const lastDot = token.lastIndexOf(".")
    if (lastDot === -1) return false

    const payload = token.slice(0, lastDot)
    const signature = token.slice(lastDot + 1)

    const expected = createHmac("sha256", SECRET).update(payload).digest("hex")
    if (signature !== expected) return false

    const timestamp = parseInt(payload.split(":")[0], 10)
    if (Date.now() - timestamp > TOKEN_EXPIRY_MS) return false

    return true
  } catch {
    return false
  }
}
