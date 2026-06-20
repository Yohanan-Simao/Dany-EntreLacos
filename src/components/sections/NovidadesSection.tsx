"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Sparkles } from "lucide-react"

type NovidadeImage = {
  id: number
  url: string
  title: string
  description: string
  cropX: number
  cropY: number
}

export default function NovidadesSection() {
  const [images, setImages] = useState<NovidadeImage[]>([])

  useEffect(() => {
    fetch("/api/admin/upload")
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return
        setImages(
          data
            .filter((img: { type?: string }) => (img.type || "produto") === "novidade")
            .slice(0, 4)
        )
      })
      .catch(() => {})
  }, [])

  if (images.length === 0) return null

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary font-semibold text-sm tracking-widest uppercase mb-4 block">
            Novidades
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4">
            <span className="text-primary font-cursive">Novidades</span> por aqui
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-lg leading-relaxed">
            Fique por dentro das últimas criações e lançamentos.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {images.map((img, index) => (
            <motion.a
              key={img.id}
              href={`https://wa.me/5548984284149?text=${encodeURIComponent(`Olá! Vi o modelo "${img.title}" no site de vocês e tenho interesse. Poderia me passar mais informações sobre valores e opções disponíveis?`)}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-primary/10 shadow-sm overflow-hidden group cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all"
            >
              <div className="relative aspect-square bg-gray-100">
                <Image
                  src={img.url}
                  alt={img.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  style={{ objectPosition: `${img.cropX}% ${img.cropY}%` }}
                />
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-primary text-white text-xs font-medium px-2.5 py-1 rounded-full">
                  <Sparkles size={12} />
                  Novo
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-primary/80 rounded-full px-4 py-2">
                    Solicitar via WhatsApp
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm">{img.title}</h3>
                {img.description && (
                  <p className="text-xs text-muted mt-1">{img.description}</p>
                )}
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
