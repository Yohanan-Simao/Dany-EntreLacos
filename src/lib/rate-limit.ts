import { createHash } from "crypto"

const WINDOW_MS = 60_000
const MAX_ATTEMPTS = 5
const BLOCK_MS = [60_000, 300_000, 900_000]

type Entry = {
  count: number
  windowEnd: number
  blockIndex: number
  blockedUntil: number
}

const memory = new Map<string, Entry>()

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN
const useRedis = !!(UPSTASH_URL && UPSTASH_TOKEN)

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 24)
}

async function redisPipeline(commands: unknown[][]): Promise<{ result?: unknown }[]> {
  const res = await fetch(`https://${UPSTASH_URL}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
  })
  if (!res.ok) throw new Error(`Upstash ${res.status}`)
  return res.json()
}

export async function checkRateLimit(ip: string): Promise<boolean> {
  const now = Date.now()
  const key = `rl:${hash(ip)}`
  let entry: Entry | null = null

  if (useRedis) {
    try {
      const [getRes] = await redisPipeline([["GET", key]])
      const raw = getRes?.result
      entry = typeof raw === "string" ? (JSON.parse(raw) as Entry) : null
    } catch {
      entry = memory.get(key) ?? null
    }
  } else {
    entry = memory.get(key) ?? null
  }

  if (entry && entry.blockedUntil > now) return false

  const fresh = !entry || now > entry.windowEnd
  const count = fresh ? 1 : entry!.count + 1
  const windowEnd = fresh ? now + WINDOW_MS : entry!.windowEnd
  const blockIndex = fresh ? 0 : entry!.blockIndex
  let blockedUntil = 0
  if (count > MAX_ATTEMPTS) {
    blockedUntil = now + BLOCK_MS[Math.min(blockIndex, BLOCK_MS.length - 1)]
  }
  const next: Entry = {
    count,
    windowEnd,
    blockIndex: blockedUntil ? blockIndex + 1 : blockIndex,
    blockedUntil,
  }

  memory.set(key, next)
  if (useRedis) {
    redisPipeline([["SET", key, JSON.stringify(next), "EX", "3600"]]).catch(() => {})
  }

  return !blockedUntil
}
