import { randomBytes } from "crypto"
import { writeFile, readFile } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

const TOKENS_FILE = path.join(process.cwd(), "data", "tokens.json")
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000

type StoredToken = {
  token: string
  createdAt: number
}

async function getTokens(): Promise<StoredToken[]> {
  if (!existsSync(TOKENS_FILE)) return []
  try {
    const data = await readFile(TOKENS_FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function saveTokens(tokens: StoredToken[]) {
  await writeFile(TOKENS_FILE, JSON.stringify(tokens, null, 2))
}

export async function createToken(): Promise<string> {
  const token = randomBytes(32).toString("hex")
  const tokens = await getTokens()

  const validTokens = tokens.filter(
    (t) => Date.now() - t.createdAt < TOKEN_EXPIRY_MS
  )

  validTokens.push({ token, createdAt: Date.now() })
  await saveTokens(validTokens)

  return token
}

export async function validateToken(token: string): Promise<boolean> {
  const tokens = await getTokens()
  const found = tokens.find((t) => t.token === token)

  if (!found) return false
  if (Date.now() - found.createdAt > TOKEN_EXPIRY_MS) {
    const valid = tokens.filter((t) => t.token !== token)
    await saveTokens(valid)
    return false
  }

  return true
}

export async function revokeToken(token: string) {
  const tokens = await getTokens()
  await saveTokens(tokens.filter((t) => t.token !== token))
}
