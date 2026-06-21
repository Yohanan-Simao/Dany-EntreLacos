"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Upload, Trash2, LogOut, ImageIcon, Move, X, Package, Sparkles, Pencil } from "lucide-react"

type ImageData = {
  id: number
  publicId: string
  url: string
  title: string
  description: string
  type: string
  cropX: number
  cropY: number
  createdAt: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [images, setImages] = useState<ImageData[]>([])
  const [tab, setTab] = useState<"produto" | "novidade">("produto")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [adjusting, setAdjusting] = useState<ImageData | null>(null)
  const [cropX, setCropX] = useState(50)
  const [cropY, setCropY] = useState(50)
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0, cx: 0, cy: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const [editingTitle, setEditingTitle] = useState<ImageData | null>(null)
  const [editValue, setEditValue] = useState("")
  const editRef = useRef<HTMLInputElement>(null)

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null

  useEffect(() => {
    if (!token) {
      router.push("/admin")
      return
    }
    fetchImages()
  }, [token])

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
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
      setPreview(URL.createObjectURL(f))
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!file || !title || !token) return

    setUploading(true)
    setUploadError("")

    const formData = new FormData()
    formData.append("image", file)
    formData.append("title", title)
    formData.append("description", description)
    formData.append("type", tab)

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000)

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
        signal: controller.signal,
      })
      clearTimeout(timeout)

      if (res.ok) {
        const newImage = await res.json()
        setImages((prev) => [newImage, ...prev])
        setTitle("")
        setDescription("")
        setFile(null)
        setPreview(null)
        setUploadError("")
      } else {
        const text = await res.text()
        try {
          const data = JSON.parse(text)
          setUploadError(data.error || `Erro ${res.status}`)
        } catch {
          setUploadError(`Erro ${res.status}: ${text.slice(0, 200)}`)
        }
      }
    } catch (err) {
      clearTimeout(timeout)
      if (err instanceof DOMException && err.name === "AbortError") {
        setUploadError("Tempo limite excedido. Imagem muito grande?")
      } else {
        setUploadError("Erro de conexão com o servidor.")
      }
    }

    setUploading(false)
  }

  async function handleDelete(img: ImageData) {
    if (!confirm("Excluir esta imagem?")) return
    await fetch("/api/admin/upload", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ publicId: img.publicId }),
    })
    await fetchImages()
  }

  function openAdjust(img: ImageData) {
    setCropX(img.cropX)
    setCropY(img.cropY)
    setAdjusting(img)
  }

  async function saveCrop() {
    if (!adjusting || !token) return
    const res = await fetch("/api/admin/upload", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ publicId: adjusting.publicId, cropX, cropY }),
    })
    setAdjusting(null)
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      alert(data.error || "Erro ao salvar posição")
      return
    }
    setImages((prev) =>
      prev.map((img) =>
        img.publicId === adjusting!.publicId ? { ...img, cropX, cropY } : img
      )
    )
  }

  function startDrag(clientX: number, clientY: number) {
    setDragging(true)
    dragStart.current = { x: clientX, y: clientY, cx: cropX, cy: cropY }
  }

  function moveDrag(clientX: number, clientY: number) {
    if (!dragging || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const dx = ((clientX - dragStart.current.x) / rect.width) * 100
    const dy = ((clientY - dragStart.current.y) / rect.height) * 100
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

  async function saveTitle() {
    if (!editingTitle || !token) return
    const res = await fetch("/api/admin/upload", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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

  function handleMouseDown(e: React.MouseEvent) {
    startDrag(e.clientX, e.clientY)
  }

  function handleMouseMove(e: React.MouseEvent) {
    moveDrag(e.clientX, e.clientY)
  }

  function handleTouchStart(e: React.TouchEvent) {
    const t = e.touches[0]
    startDrag(t.clientX, t.clientY)
  }

  function handleTouchMove(e: React.TouchEvent) {
    const t = e.touches[0]
    moveDrag(t.clientX, t.clientY)
  }

  async function handleLogout() {
    if (token) {
      await fetch("/api/admin/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
    }
    localStorage.removeItem("admin_token")
    router.push("/admin")
  }

  const imageList = Array.isArray(images) ? images : []
  const filteredImages = [...imageList.filter((img) => (img.type || "produto") === tab)].reverse()

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-white shadow-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <h1 className="text-lg font-bold">Painel Administrativo</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setTab("produto")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              tab === "produto"
                ? "bg-primary text-white shadow-md"
                : "bg-white text-muted border border-primary/20 hover:border-primary/40"
            }`}
          >
            <Package size={16} />
            Produtos
          </button>
          <button
            onClick={() => setTab("novidade")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              tab === "novidade"
                ? "bg-primary text-white shadow-md"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">Título</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={tab === "produto" ? "Ex: Tiara de Flores" : "Ex: Novas Tiaras de Verão"}
                className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">Descrição</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Descrição opcional"
                className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-muted mb-1.5">Imagem</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-primary/30 bg-background text-sm text-muted hover:border-primary/50 transition-all cursor-pointer">
                <ImageIcon size={18} />
                {file ? file.name : "Selecionar imagem"}
                <input type="file" accept="image/*" onChange={handleFile} className="hidden" required />
              </label>
              {preview && (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-primary/10">
                  <Image src={preview} alt="Preview" fill className="object-cover" />
                </div>
              )}
            </div>
            <p className="text-xs text-muted mt-1.5">Formatos: JPEG, PNG, WebP, AVIF — Máx 5MB</p>
          </div>

          {uploadError && (
            <p className="text-sm text-red-500 mb-4">{uploadError}</p>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-dark disabled:opacity-60 flex items-center gap-2"
          >
            <Upload size={16} />
            {uploading ? "Enviando..." : "Enviar"}
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
                    className="object-cover"
                    style={{ objectPosition: `${img.cropX}% ${img.cropY}%` }}
                  />
                  <div className="absolute top-2 right-2 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all">
                    <button
                      onClick={() => openAdjust(img)}
                      className="p-2 rounded-full bg-black/50 text-white hover:bg-primary transition-colors"
                      title="Ajustar posição"
                    >
                      <Move size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(img)}
                      className="p-2 rounded-full bg-black/50 text-white hover:bg-red-500 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  {editingTitle?.id === img.id ? (
                    <input
                      ref={editRef}
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={saveTitle}
                      onKeyDown={(e) => { if (e.key === "Enter") saveTitle(); if (e.key === "Escape") setEditingTitle(null) }}
                      className="w-full px-2 py-1 rounded-lg border border-primary/30 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm flex-1 min-w-0 truncate">{img.title}</h3>
                      <button
                        onClick={() => startEdit(img)}
                        className="shrink-0 p-1 text-muted hover:text-primary transition-colors"
                        title="Editar título"
                      >
                        <Pencil size={14} />
                      </button>
                    </div>
                  )}
                  {img.description && <p className="text-xs text-muted mt-1">{img.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {adjusting && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setAdjusting(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Move size={18} />
                Ajustar Posição
              </h3>
              <button onClick={() => setAdjusting(null)} className="p-1 text-muted hover:text-foreground transition-colors">
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-muted mb-4">Arraste a imagem para centralizar o foco no quadro.</p>

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
            >
              <Image
                src={adjusting.url}
                alt="Ajustar"
                fill
                className="pointer-events-none"
                style={{ objectPosition: `${cropX}% ${cropY}%`, objectFit: "cover" }}
                draggable={false}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-muted mb-4">
              <span>Arraste para reposicionar</span>
              <span>{Math.round(cropX)}% / {Math.round(cropY)}%</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setCropX(50); setCropY(50) }}
                className="flex-1 rounded-full border border-primary/30 px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/5 transition-all"
              >
                Centralizar
              </button>
              <button
                onClick={saveCrop}
                className="flex-1 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-all"
              >
                Salvar Posição
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
