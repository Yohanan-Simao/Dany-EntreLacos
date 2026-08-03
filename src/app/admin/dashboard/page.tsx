"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Upload, Trash2, LogOut, ImageIcon, Move, X, Package, Sparkles, Pencil, ExternalLink, ArrowRightLeft, Check, ZoomIn, ZoomOut } from "lucide-react"
import { MAX_DESCRIPTION_LENGTH, MAX_TITLE_LENGTH } from "@/lib/limits"
import { cropTransformStyle } from "@/lib/utils"

type ImageData = {
  id: number
  publicId: string
  url: string
  title: string
  description: string
  type: string
  cropX: number
  cropY: number
  zoom: number
  createdAt: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [images, setImages] = useState<ImageData[]>([])
  const [tab, setTab] = useState<"produto" | "novidade">("produto")
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [pendingConfig, setPendingConfig] = useState<ImageData[]>([])
  const [pendingIndex, setPendingIndex] = useState(0)
  const [pendingTitle, setPendingTitle] = useState("")
  const [pendingDesc, setPendingDesc] = useState("")
  const [configError, setConfigError] = useState("")
  const [configSaving, setConfigSaving] = useState(false)
  const [cropError, setCropError] = useState("")
  const [adjusting, setAdjusting] = useState<ImageData | null>(null)
  const [cropX, setCropX] = useState(50)
  const [cropY, setCropY] = useState(50)
  const [zoom, setZoom] = useState(1)
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0, cx: 0, cy: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const [editingTitle, setEditingTitle] = useState<ImageData | null>(null)
  const [editValue, setEditValue] = useState("")
  const editRef = useRef<HTMLInputElement>(null)
  const [editingDesc, setEditingDesc] = useState<ImageData | null>(null)
  const [editDescValue, setEditDescValue] = useState("")
  const editDescRef = useRef<HTMLTextAreaElement>(null)
  const [moving, setMoving] = useState<ImageData | null>(null)
  const [moveError, setMoveError] = useState("")
  const [movingBusy, setMovingBusy] = useState(false)
  const [deleting, setDeleting] = useState<ImageData | null>(null)
  const [deleteError, setDeleteError] = useState("")
  const [deleteBusy, setDeleteBusy] = useState(false)
  const configContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    async function checkSession() {
      try {
        const res = await fetch("/api/admin/session")
        if (!res.ok) {
          router.push("/admin")
          return
        }
        if (!cancelled) fetchImages()
      } catch {
        router.push("/admin")
      }
    }
    checkSession()
    return () => {
      cancelled = true
    }
  }, [router])

  async function fetchImages() {
    try {
      const res = await fetch("/api/admin/upload")
      const data = await res.json()
      if (Array.isArray(data)) {
        setImages(data)
      }
    } catch {
      // API error — keep empty state
    }
  }


  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || [])
    if (selected.length === 0) return
    setFiles(selected)
    setPreviews(selected.map((f) => URL.createObjectURL(f)))
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (files.length === 0) return

    setUploading(true)
    setUploadError("")

    const uploaded: ImageData[] = []
    let failed = 0

    for (const f of files) {
      const formData = new FormData()
      formData.append("image", f)
      formData.append("title", f.name.replace(/\.[^.]+$/, "") || "Sem título")
      formData.append("description", "")
      formData.append("type", tab)

      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 30000)

      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
          signal: controller.signal,
        })
        clearTimeout(timeout)
        if (res.ok) {
          const newImage = await res.json()
          uploaded.push(newImage)
        } else {
          failed++
        }
      } catch (err) {
        clearTimeout(timeout)
        failed++
        if (err instanceof DOMException && err.name === "AbortError") {
          setUploadError("Tempo limite excedido em uma das imagens. Verifique o tamanho.")
        }
      }
    }

    setUploading(false)

    if (uploaded.length > 0) {
      setImages((prev) => [...uploaded, ...prev])
      setFiles([])
      setPreviews([])
      startPendingConfig(uploaded)
      if (failed > 0) {
        setUploadError(`${failed} imagem(ns) falharam. As demais foram enviadas.`)
      }
    } else {
      setUploadError(uploadError || "Nenhuma imagem foi enviada. Verifique os arquivos e tente novamente.")
    }
  }

  function startPendingConfig(uploaded: ImageData[]) {
    setPendingConfig(uploaded)
    setPendingIndex(0)
    setPendingTitle(uploaded[0].title)
    setPendingDesc(uploaded[0].description || "")
    setCropX(uploaded[0].cropX ?? 50)
    setCropY(uploaded[0].cropY ?? 50)
    setZoom(uploaded[0].zoom ?? 1)
    setConfigError("")
  }

  const closePendingConfig = useCallback(() => {
    setPendingConfig([])
    setPendingIndex(0)
    setConfigError("")
    setConfigSaving(false)
  }, [])

  const savePendingItem = useCallback(async () => {
    const item = pendingConfig[pendingIndex]
    if (!item || configSaving) return
    setConfigSaving(true)
    setConfigError("")
    try {
      const res = await fetch("/api/admin/upload", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publicId: item.publicId,
          title: pendingTitle.trim() || "Sem título",
          description: pendingDesc.trim(),
          cropX,
          cropY,
          zoom,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setConfigError(data.error || "Não foi possível salvar. Tente novamente.")
        return
      }
      const updated = {
        ...item,
        title: pendingTitle.trim() || "Sem título",
        description: pendingDesc.trim(),
        cropX,
        cropY,
        zoom,
      }
      setImages((prev) => prev.map((img) => (img.publicId === item.publicId ? updated : img)))
      if (pendingIndex + 1 < pendingConfig.length) {
        const next = pendingConfig[pendingIndex + 1]
        setPendingIndex(pendingIndex + 1)
        setPendingTitle(next.title)
        setPendingDesc(next.description || "")
        setCropX(next.cropX ?? 50)
        setCropY(next.cropY ?? 50)
        setZoom(next.zoom ?? 1)
        setConfigError("")
      } else {
        closePendingConfig()
      }
    } catch {
      setConfigError("Erro de conexão. Tente novamente.")
    } finally {
      setConfigSaving(false)
    }
  }, [pendingConfig, pendingIndex, configSaving, pendingTitle, pendingDesc, cropX, cropY, zoom, closePendingConfig])

  async function handleDelete() {
    if (!deleting || deleteBusy) return
    setDeleteBusy(true)
    setDeleteError("")
    try {
      const res = await fetch("/api/admin/upload", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicId: deleting.publicId }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setDeleteError(data.error || "Não foi possível excluir. Tente novamente.")
        return
      }
      setDeleting(null)
      setDeleteError("")
      await fetchImages()
    } catch {
      setDeleteError("Erro de conexão. Tente novamente.")
    } finally {
      setDeleteBusy(false)
    }
  }

  function openAdjust(img: ImageData) {
    setCropX(img.cropX ?? 50)
    setCropY(img.cropY ?? 50)
    setZoom(img.zoom ?? 1)
    setCropError("")
    setAdjusting(img)
  }

  async function saveCrop() {
    if (!adjusting) return
    const res = await fetch("/api/admin/upload", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicId: adjusting.publicId, cropX, cropY, zoom }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setCropError(data.error || "Não foi possível salvar a posição. Tente novamente.")
      return
    }
    setAdjusting(null)
    setCropError("")
    setImages((prev) =>
      prev.map((img) =>
        img.publicId === adjusting!.publicId ? { ...img, cropX, cropY, zoom } : img
      )
    )
  }

  function startDrag(clientX: number, clientY: number) {
    setDragging(true)
    dragStart.current = { x: clientX, y: clientY, cx: cropX, cy: cropY }
  }

  function moveDrag(clientX: number, clientY: number, el: HTMLElement | null) {
    if (!dragging || !el) return
    const rect = el.getBoundingClientRect()
    const scale = zoom
    const dx = ((clientX - dragStart.current.x) / rect.width) * 100 / scale
    const dy = ((clientY - dragStart.current.y) / rect.height) * 100 / scale
    setCropX(Math.max(0, Math.min(100, dragStart.current.cx + dx)))
    setCropY(Math.max(0, Math.min(100, dragStart.current.cy + dy)))
  }

  function endDrag() {
    setDragging(false)
  }

  function startEdit(img: ImageData) {
    setEditValue(img.title)
    setEditingTitle(img)
    setTimeout(() => editRef.current?.focus(), 50)
  }

  function startEditDesc(img: ImageData) {
    setEditDescValue(img.description || "")
    setEditingDesc(img)
    setTimeout(() => editDescRef.current?.focus(), 50)
  }

  useEffect(() => {
    if (!adjusting) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setAdjusting(null)
        return
      }
      if (e.key.startsWith("Arrow")) {
        e.preventDefault()
        const step = e.shiftKey ? 10 : 2
        if (e.key === "ArrowLeft") setCropX((x) => Math.max(0, Math.min(100, x - step)))
        if (e.key === "ArrowRight") setCropX((x) => Math.max(0, Math.min(100, x + step)))
        if (e.key === "ArrowUp") setCropY((y) => Math.max(0, Math.min(100, y - step)))
        if (e.key === "ArrowDown") setCropY((y) => Math.max(0, Math.min(100, y + step)))
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [adjusting])

  useEffect(() => {
    if (!moving || movingBusy) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMoving(null)
        setMoveError("")
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [moving, movingBusy])

  useEffect(() => {
    if (!deleting || deleteBusy) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setDeleting(null)
        setDeleteError("")
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [deleting, deleteBusy])

  useEffect(() => {
    if (pendingConfig.length === 0 || configSaving) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closePendingConfig()
      if (e.key === "Enter" && !e.shiftKey && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault()
        savePendingItem()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [pendingConfig, pendingIndex, configSaving, cropX, cropY, pendingTitle, pendingDesc, savePendingItem, closePendingConfig])

  async function saveTitle() {
    if (!editingTitle) return
    const res = await fetch("/api/admin/upload", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicId: editingTitle.publicId, title: editValue.trim() }),
    })
    if (res.ok) {
      setImages((prev) =>
        prev.map((img) =>
          img.publicId === editingTitle.publicId ? { ...img, title: editValue.trim() } : img
        )
      )
    }
    setEditingTitle(null)
  }

  async function saveDesc() {
    if (!editingDesc) return
    const res = await fetch("/api/admin/upload", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicId: editingDesc.publicId, description: editDescValue.trim() }),
    })
    if (res.ok) {
      setImages((prev) =>
        prev.map((img) =>
          img.publicId === editingDesc.publicId ? { ...img, description: editDescValue.trim() } : img
        )
      )
    }
    setEditingDesc(null)
  }

  async function handleMove() {
    if (!moving) return
    const newType = moving.type === "produto" ? "novidade" : "produto"
    setMovingBusy(true)
    setMoveError("")
    try {
      const res = await fetch("/api/admin/upload", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicId: moving.publicId, type: newType }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setMoveError(data.error || "Não foi possível mover. Tente novamente.")
        return
      }
      setImages((prev) =>
        prev.map((img) =>
          img.publicId === moving.publicId ? { ...img, type: newType } : img
        )
      )
      setMoving(null)
    } catch {
      setMoveError("Erro de conexão. Tente novamente.")
    } finally {
      setMovingBusy(false)
    }
  }

  function handleMouseDown(e: React.MouseEvent) {
    startDrag(e.clientX, e.clientY)
  }

  function handleMouseMove(e: React.MouseEvent) {
    moveDrag(e.clientX, e.clientY, containerRef.current)
  }

  function handleTouchStart(e: React.TouchEvent) {
    const t = e.touches[0]
    startDrag(t.clientX, t.clientY)
  }

  function handleTouchMove(e: React.TouchEvent) {
    const t = e.touches[0]
    moveDrag(t.clientX, t.clientY, containerRef.current)
  }

  function handleConfigMouseDown(e: React.MouseEvent) {
    startDrag(e.clientX, e.clientY)
  }

  function handleConfigMouseMove(e: React.MouseEvent) {
    moveDrag(e.clientX, e.clientY, configContainerRef.current)
  }

  function handleConfigTouchStart(e: React.TouchEvent) {
    const t = e.touches[0]
    startDrag(t.clientX, t.clientY)
  }

  function handleConfigTouchMove(e: React.TouchEvent) {
    const t = e.touches[0]
    moveDrag(t.clientX, t.clientY, configContainerRef.current)
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {})
    router.push("/admin")
  }

  const imageList = Array.isArray(images) ? images : []
  const filteredImages = imageList.filter((img) => (img.type || "produto") === tab)

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary-dark text-white shadow-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <h1 className="text-lg font-bold">Painel Administrativo</h1>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary-dark transition hover:bg-white/90 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-dark"
            >
              <ExternalLink size={16} />
              Ver site
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-white hover:opacity-80 transition-opacity rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-dark"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setTab("produto")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition ${
              tab === "produto"
                ? "bg-primary-dark text-white shadow-md"
                : "bg-white text-muted border border-primary/20 hover:border-primary/40"
            }`}
          >
            <Package size={16} />
            Produtos
          </button>
          <button
            onClick={() => setTab("novidade")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition ${
              tab === "novidade"
                ? "bg-primary-dark text-white shadow-md"
                : "bg-white text-muted border border-primary/20 hover:border-primary/40"
            }`}
          >
            <Sparkles size={16} />
            Novidades
          </button>
        </div>

        <form
          onSubmit={handleUpload}
          className="bg-white rounded-2xl p-6 border border-primary/10 shadow-sm mb-8"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Upload size={18} />
            Nova Imagem — {tab === "produto" ? "Produto" : "Novidade"}
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-muted mb-1.5">Imagens</label>
            <label className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-primary/30 bg-background text-sm text-muted hover:border-primary/50 transition cursor-pointer">
              <ImageIcon size={18} />
              {files.length > 0
                ? `${files.length} imagem(ns) selecionada(s)`
                : "Selecionar imagens"}
              <input type="file" accept="image/*" multiple onChange={handleFile} className="hidden" />
            </label>
            {previews.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3">
                {previews.map((src, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-primary/10">
                    <Image src={src} alt={`Preview ${i + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-muted mt-1.5">
              Formatos: JPEG, PNG, WebP, AVIF — Máx 5MB cada. Após o envio, você define título, descrição e posição de cada foto.
            </p>
          </div>

          {uploadError && (
            <p role="status" aria-live="polite" className="text-sm text-red-500 mb-4">{uploadError}</p>
          )}

          <button
            type="submit"
            disabled={uploading || files.length === 0}
            className="rounded-full bg-primary-dark px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-95 disabled:opacity-60 flex items-center gap-2"
          >
            <Upload size={16} />
            {uploading ? "Enviando..." : files.length > 1 ? `Enviar ${files.length} imagens` : "Enviar"}
          </button>
        </form>

        <h2 className="text-lg font-semibold mb-4">
          {tab === "produto" ? "Imagens de Produtos" : "Imagens de Novidades"}
        </h2>

        {filteredImages.length === 0 ? (
          <p className="text-muted text-sm">Nenhuma imagem nesta categoria.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredImages.map((img) => (
              <div key={img.id} className="bg-white rounded-2xl border border-primary/10 shadow-sm overflow-hidden group">
                <div className="relative aspect-square bg-gray-100">
                  <Image
                    src={img.url}
                    alt={img.title}
                    fill
                    sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                    loading="lazy"
                    className="object-cover"
                    style={cropTransformStyle(img.cropX ?? 50, img.cropY ?? 50, img.zoom ?? 1)}
                  />
                  <div className="absolute top-2 right-2 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
                    <button
                      onClick={() => { setMoveError(""); setMoving(img) }}
                      className="p-2 rounded-full bg-black/50 text-white hover:bg-primary-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
                      title={`Mover para ${img.type === "produto" ? "novidades" : "produtos"}`}
                      aria-label={`Mover ${img.title} para ${img.type === "produto" ? "novidades" : "produtos"}`}
                    >
                      <ArrowRightLeft size={16} />
                    </button>
                    <button
                      onClick={() => openAdjust(img)}
                      className="p-2 rounded-full bg-black/50 text-white hover:bg-primary-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
                      title="Ajustar posição"
                      aria-label={`Ajustar posição de ${img.title}`}
                    >
                      <Move size={16} />
                    </button>
                    <button
                      onClick={() => { setDeleteError(""); setDeleting(img) }}
                      className="p-2 rounded-full bg-black/50 text-white hover:bg-red-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
                      title="Excluir"
                      aria-label={`Excluir ${img.title}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  {editingTitle?.id === img.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        ref={editRef}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value.slice(0, MAX_TITLE_LENGTH))}
                        onBlur={saveTitle}
                        onKeyDown={(e) => { if (e.key === "Enter") saveTitle(); if (e.key === "Escape") setEditingTitle(null) }}
                        maxLength={MAX_TITLE_LENGTH}
                        className="w-full px-2 py-1 rounded-lg border border-primary/30 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30"
                        aria-label="Editar título"
                      />
                      <button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={saveTitle}
                        className="shrink-0 p-1.5 rounded-lg bg-primary-dark text-white hover:brightness-95 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2"
                        title="Salvar título"
                        aria-label={`Salvar título de ${img.title}`}
                      >
                        <Check size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm flex-1 min-w-0 truncate">{img.title}</h3>
                      <button
                        onClick={() => startEdit(img)}
                        className="shrink-0 p-1 text-muted hover:text-primary-dark transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2"
                        title="Editar título"
                        aria-label={`Editar título de ${img.title}`}
                      >
                        <Pencil size={14} />
                      </button>
                    </div>
                  )}
                  {editingDesc?.id === img.id ? (
                    <div className="mt-1">
                      <textarea
                        ref={editDescRef}
                        value={editDescValue}
                        onChange={(e) => setEditDescValue(e.target.value.slice(0, MAX_DESCRIPTION_LENGTH))}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); saveDesc() }
                          if (e.key === "Escape") setEditingDesc(null)
                        }}
                        rows={2}
                        maxLength={MAX_DESCRIPTION_LENGTH}
                        className="w-full px-2 py-1 rounded-lg border border-primary/30 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                        aria-label="Editar descrição"
                      />
                      <div className="flex items-center justify-between mt-1">
                        <span
                          className={`text-[10px] tabular-nums ${
                            editDescValue.length >= MAX_DESCRIPTION_LENGTH ? "text-red-500 font-semibold" : "text-muted"
                          }`}
                        >
                          {editDescValue.length}/{MAX_DESCRIPTION_LENGTH}
                        </span>
                        <button
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={saveDesc}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-primary-dark text-white text-xs font-semibold hover:brightness-95 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2"
                          title="Salvar descrição"
                          aria-label={`Salvar descrição de ${img.title}`}
                        >
                          <Check size={12} />
                          Salvar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 mt-1">
                      <p className="text-xs text-muted flex-1 min-w-0">{img.description || "Sem descrição"}</p>
                      <button
                        onClick={() => startEditDesc(img)}
                        className="shrink-0 p-1 text-muted hover:text-primary-dark transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2"
                        title="Editar descrição"
                        aria-label={`Editar descrição de ${img.title}`}
                      >
                        <Pencil size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {adjusting && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overscroll-contain"
          role="dialog"
          aria-modal="true"
          aria-labelledby="adjust-title"
          onClick={() => setAdjusting(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 id="adjust-title" className="font-semibold flex items-center gap-2">
                <Move size={18} />
                Ajustar Posição
              </h3>
              <button onClick={() => setAdjusting(null)} className="p-1 text-muted hover:text-foreground transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2" aria-label="Fechar">
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-muted mb-4">Arraste a imagem ou use as setas do teclado para centralizar o foco no quadro. Use o zoom para aproximar os detalhes.</p>

            <div
              ref={containerRef}
              className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-grab active:cursor-grabbing mb-4 select-none touch-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={endDrag}
              onMouseLeave={endDrag}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={endDrag}
              tabIndex={0}
              role="img"
              aria-label="Área de ajuste. Arraste ou use as setas do teclado para reposicionar a imagem."
            >
              <Image
                src={adjusting.url}
                alt="Ajustar"
                fill
                className="pointer-events-none"
                style={cropTransformStyle(cropX, cropY, zoom)}
                draggable={false}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-muted mb-4">
              <span>Arraste para reposicionar</span>
              <span>{Math.round(cropX)}% / {Math.round(cropY)}%</span>
            </div>

            <div className="flex items-center justify-center gap-2 mb-4">
              <button
                onClick={() => setZoom((z) => Math.max(1, Math.round((z - 0.25) * 100) / 100))}
                className="p-2 rounded-full border border-primary/30 text-primary-dark hover:bg-primary/5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2"
                title="Diminuir zoom"
                aria-label="Diminuir zoom"
              >
                <ZoomOut size={16} />
              </button>
              <span className="w-16 text-center text-sm font-semibold tabular-nums text-foreground">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom((z) => Math.min(4, Math.round((z + 0.25) * 100) / 100))}
                className="p-2 rounded-full border border-primary/30 text-primary-dark hover:bg-primary/5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2"
                title="Aumentar zoom"
                aria-label="Aumentar zoom"
              >
                <ZoomIn size={16} />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="ml-2 px-3 py-1.5 rounded-full border border-primary/30 text-xs font-medium text-primary-dark hover:bg-primary/5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2"
                title="Redefinir zoom"
              >
                Redefinir
              </button>
            </div>

            {cropError && (
              <p role="status" aria-live="polite" className="text-sm text-red-500 mb-4">{cropError}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setCropX(50); setCropY(50); setZoom(1) }}
                className="flex-1 rounded-full border border-primary/30 px-4 py-2.5 text-sm font-medium text-primary-dark hover:bg-primary/5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2"
              >
                Centralizar
              </button>
              <button
                onClick={saveCrop}
                className="flex-1 rounded-full bg-primary-dark px-4 py-2.5 text-sm font-semibold text-white hover:brightness-95 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2"
              >
                Salvar Posição
              </button>
            </div>
          </div>
        </div>
      )}

      {moving && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overscroll-contain"
          role="dialog"
          aria-modal="true"
          aria-labelledby="move-title"
          onClick={() => { if (!movingBusy) { setMoving(null); setMoveError("") } }}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 id="move-title" className="font-semibold flex items-center gap-2">
                <ArrowRightLeft size={18} />
                Mover imagem
              </h3>
              <button
                onClick={() => { setMoving(null); setMoveError("") }}
                disabled={movingBusy}
                className="p-1 text-muted hover:text-foreground transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 disabled:opacity-50"
                aria-label="Fechar"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-muted mb-6">
              Tem certeza que quer mover <strong className="text-foreground font-semibold">{moving.title}</strong>{" "}
              para <strong className="text-foreground font-semibold">{moving.type === "produto" ? "novidades" : "produtos"}</strong>?
            </p>

            {moveError && (
              <p role="status" aria-live="polite" className="text-sm text-red-500 mb-4">{moveError}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setMoving(null); setMoveError("") }}
                disabled={movingBusy}
                className="flex-1 rounded-full border border-primary/30 px-4 py-2.5 text-sm font-medium text-primary-dark hover:bg-primary/5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleMove}
                disabled={movingBusy}
                className="flex-1 rounded-full bg-primary-dark px-4 py-2.5 text-sm font-semibold text-white hover:brightness-95 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <ArrowRightLeft size={16} />
                {movingBusy ? "Movendo…" : "Mover"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleting && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overscroll-contain"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-title"
          onClick={() => { if (!deleteBusy) { setDeleting(null); setDeleteError("") } }}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 id="delete-title" className="font-semibold flex items-center gap-2">
                <Trash2 size={18} className="text-red-500" />
                Excluir imagem
              </h3>
              <button
                onClick={() => { setDeleting(null); setDeleteError("") }}
                disabled={deleteBusy}
                className="p-1 text-muted hover:text-foreground transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 disabled:opacity-50"
                aria-label="Fechar"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-muted mb-6">
              Tem certeza que quer excluir <strong className="text-foreground font-semibold">{deleting.title}</strong>? Essa ação não pode ser desfeita.
            </p>

            {deleteError && (
              <p role="status" aria-live="polite" className="text-sm text-red-500 mb-4">{deleteError}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setDeleting(null); setDeleteError("") }}
                disabled={deleteBusy}
                className="flex-1 rounded-full border border-primary/30 px-4 py-2.5 text-sm font-medium text-primary-dark hover:bg-primary/5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteBusy}
                className="flex-1 rounded-full bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:brightness-95 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
                {deleteBusy ? "Excluindo…" : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}

      {pendingConfig.length > 0 && pendingConfig[pendingIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overscroll-contain"
          role="dialog"
          aria-modal="true"
          aria-labelledby="config-title"
          onClick={() => { if (!configSaving) closePendingConfig() }}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl max-h-[90dvh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 id="config-title" className="font-semibold flex items-center gap-2">
                <Pencil size={18} />
                Configurar imagem {pendingIndex + 1} de {pendingConfig.length}
              </h3>
              <button
                onClick={closePendingConfig}
                disabled={configSaving}
                className="p-1 text-muted hover:text-foreground transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 disabled:opacity-50"
                aria-label="Fechar"
              >
                <X size={20} />
              </button>
            </div>

            <div
              ref={configContainerRef}
              className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-grab active:cursor-grabbing mb-4 select-none touch-none"
              onMouseDown={handleConfigMouseDown}
              onMouseMove={handleConfigMouseMove}
              onMouseUp={endDrag}
              onMouseLeave={endDrag}
              onTouchStart={handleConfigTouchStart}
              onTouchMove={handleConfigTouchMove}
              onTouchEnd={endDrag}
              tabIndex={0}
              role="img"
              aria-label="Área de ajuste. Arraste para reposicionar a imagem."
            >
              <Image
                src={pendingConfig[pendingIndex].url}
                alt="Ajustar"
                fill
                className="pointer-events-none"
                style={cropTransformStyle(cropX, cropY, zoom)}
                draggable={false}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-muted mb-4">
              <span>Arraste para reposicionar</span>
              <span>{Math.round(cropX)}% / {Math.round(cropY)}%</span>
            </div>

            <div className="flex items-center justify-center gap-2 mb-4">
              <button
                onClick={() => setZoom((z) => Math.max(1, Math.round((z - 0.25) * 100) / 100))}
                disabled={configSaving}
                className="p-2 rounded-full border border-primary/30 text-primary-dark hover:bg-primary/5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 disabled:opacity-50"
                title="Diminuir zoom"
                aria-label="Diminuir zoom"
              >
                <ZoomOut size={16} />
              </button>
              <span className="w-16 text-center text-sm font-semibold tabular-nums text-foreground">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom((z) => Math.min(4, Math.round((z + 0.25) * 100) / 100))}
                disabled={configSaving}
                className="p-2 rounded-full border border-primary/30 text-primary-dark hover:bg-primary/5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 disabled:opacity-50"
                title="Aumentar zoom"
                aria-label="Aumentar zoom"
              >
                <ZoomIn size={16} />
              </button>
              <button
                onClick={() => setZoom(1)}
                disabled={configSaving}
                className="ml-2 px-3 py-1.5 rounded-full border border-primary/30 text-xs font-medium text-primary-dark hover:bg-primary/5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 disabled:opacity-50"
                title="Redefinir zoom"
              >
                Redefinir
              </button>
            </div>

            <div className="space-y-4 mb-4">
              <div>
                <label htmlFor="config-title-input" className="block text-sm font-medium text-muted mb-1.5">
                  Título
                </label>
                <input
                  id="config-title-input"
                  type="text"
                  value={pendingTitle}
                  onChange={(e) => setPendingTitle(e.target.value.slice(0, MAX_TITLE_LENGTH))}
                  placeholder="Ex: Tiara de Flores"
                  maxLength={MAX_TITLE_LENGTH}
                  className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>
              <div>
                <label htmlFor="config-desc-input" className="block text-sm font-medium text-muted mb-1.5">
                  Descrição
                </label>
                <textarea
                  id="config-desc-input"
                  value={pendingDesc}
                  onChange={(e) => setPendingDesc(e.target.value.slice(0, MAX_DESCRIPTION_LENGTH))}
                  placeholder="Ex: Descrição opcional"
                  rows={2}
                  maxLength={MAX_DESCRIPTION_LENGTH}
                  className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
                />
                <div className="flex justify-end mt-1">
                  <span
                    className={`text-[10px] tabular-nums ${
                      pendingDesc.length >= MAX_DESCRIPTION_LENGTH ? "text-red-500 font-semibold" : "text-muted"
                    }`}
                  >
                    {pendingDesc.length}/{MAX_DESCRIPTION_LENGTH}
                  </span>
                </div>
              </div>
            </div>

            {configError && (
              <p role="status" aria-live="polite" className="text-sm text-red-500 mb-4">{configError}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setCropX(50); setCropY(50); setZoom(1) }}
                disabled={configSaving}
                className="flex-1 rounded-full border border-primary/30 px-4 py-2.5 text-sm font-medium text-primary-dark hover:bg-primary/5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 disabled:opacity-50"
              >
                Centralizar
              </button>
              <button
                onClick={savePendingItem}
                disabled={configSaving}
                className="flex-1 rounded-full bg-primary-dark px-4 py-2.5 text-sm font-semibold text-white hover:brightness-95 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <Pencil size={16} />
                {configSaving ? "Salvando…" : pendingIndex + 1 < pendingConfig.length ? "Salvar e próxima" : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
