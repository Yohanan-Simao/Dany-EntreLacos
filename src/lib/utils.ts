import type { CSSProperties } from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function cropTransformStyle(cropX: number, cropY: number, zoom: number) {
  const style: CSSProperties = {
    objectPosition: `${cropX}% ${cropY}%`,
    objectFit: "cover",
    transformOrigin: `${cropX}% ${cropY}%`,
  }
  if (zoom > 1) {
    style.transform = `scale(${zoom})`
  }
  return style
}
