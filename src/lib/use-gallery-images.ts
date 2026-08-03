"use client"

import { useState, useEffect } from "react"

export type GalleryImage = {
  id: number
  url: string
  title: string
  description: string
  type: string
  cropX: number
  cropY: number
}

const REFRESH_INTERVAL_MS = 60_000

export function useGalleryImages(type: string, initial: GalleryImage[] = []) {
  const [images, setImages] = useState<GalleryImage[]>(initial)

  useEffect(() => {
    let cancelled = false

    async function loadImages() {
      try {
        const res = await fetch(`/api/admin/upload?t=${Date.now()}`, { cache: "no-store" })
        const data = await res.json()
        if (!cancelled && Array.isArray(data)) {
          setImages(
            data
              .filter((img: { type?: string }) => (img.type || "produto") === type)
              .slice(0, 4)
          )
        }
      } catch {
        // API error — keep current state
      }
    }

    function onPageShow(e: PageTransitionEvent) {
      if (e.persisted) loadImages()
    }

    function onVisibilityChange() {
      if (document.visibilityState === "visible") loadImages()
    }

    loadImages()
    window.addEventListener("pageshow", onPageShow)
    document.addEventListener("visibilitychange", onVisibilityChange)

    const polling = window.setInterval(() => {
      if (document.visibilityState === "visible") loadImages()
    }, REFRESH_INTERVAL_MS)

    return () => {
      cancelled = true
      window.removeEventListener("pageshow", onPageShow)
      document.removeEventListener("visibilitychange", onVisibilityChange)
      clearInterval(polling)
    }
  }, [type])

  return images
}
