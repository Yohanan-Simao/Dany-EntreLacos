import { createHmac, randomBytes, createHash, timingSafeEqual } from "crypto"

const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

if (!ADMIN_PASSWORD) {
  console.error("[auth] ADMIN_PASSWORD não está definida. O acesso administrativo será bloqueado.")
} else if (ADMIN_PASSWORD.length < 12) {
  console.warn("[auth] ADMIN_PASSWORD é muito curta (menos de 12 caracteres). Use uma senha forte.")
}

function requireSecret(): string {
  if (!ADMIN_PASSWORD) throw new Error("ADMIN_PASSWORD não configurada")
  return ADMIN_PASSWORD
}

export function verifyPassword(input: string): boolean {
  if (!ADMIN_PASSWORD) return false
  const a = createHash("sha256").update(input).digest()
  const b = createHash("sha256").update(ADMIN_PASSWORD).digest()
  return timingSafeEqual(a, b)
}

export function createToken(): string {
  const payload = `${Date.now()}:${randomBytes(8).toString("hex")}`
  const signature = createHmac("sha256", requireSecret()).update(payload).digest("hex")
  return `${payload}.${signature}`
}

export function validateToken(token: string): boolean {
  return tokenAgeMs(token) !== null
}

export function tokenAgeMs(token: string): number | null {
  try {
    const lastDot = token.lastIndexOf(".")
    if (lastDot === -1) return null

    const payload = token.slice(0, lastDot)
    const signature = token.slice(lastDot + 1)

    const expected = createHmac("sha256", requireSecret()).update(payload).digest("hex")
    if (signature !== expected) return null

    const timestamp = parseInt(payload.split(":")[0], 10)
    if (Number.isNaN(timestamp)) return null
    const age = Date.now() - timestamp
    if (age > TOKEN_EXPIRY_MS) return null

    return age
  } catch {
    return null
  }
}
