"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Sparkles } from "lucide-react"
import { useGalleryImages, type GalleryImage } from "@/lib/use-gallery-images"

export default function NovidadesSection({ initialImages = [] }: { initialImages?: GalleryImage[] }) {
  const images = useGalleryImages("novidade", initialImages)

  if (images.length === 0) return null

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 max-w-2xl"
        >
          <span className="text-primary-dark font-cursive text-lg mb-3 block">
            Novidades
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-balance mb-3">
            As criações mais <span className="text-primary-dark font-cursive">recentes</span>
          </h2>
          <p className="text-muted max-w-xl text-lg leading-relaxed">
            Dê uma olhada nas peças que acabaram de sair das nossas mãos — quem sabe a próxima não é feita pra você?
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {images.map((img, index) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden group transition-shadow hover:shadow-xl hover:shadow-primary/10"
            >
              <a
                href={`https://wa.me/5548984284149?text=${encodeURIComponent(`Olá! Vi o modelo "${img.title}" no site de vocês e tenho interesse. Poderia me passar mais informações sobre valores e opções disponíveis?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative aspect-square bg-gray-100 overflow-hidden"
              >
                <Image
                  src={img.url}
                  alt={img.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  loading="lazy"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  style={{ objectPosition: `${img.cropX}% ${img.cropY}%` }}
                />
                <div className="absolute top-3 left-3 bg-primary-dark text-white text-xs font-medium px-2.5 py-1 rounded-md tracking-wide">
                  <Sparkles size={12} className="inline -mt-0.5 mr-1" />
                  Novo
                </div>
              </a>
              <div className="p-5 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm truncate">{img.title}</h3>
                  {img.description && (
                    <p className="text-xs text-muted mt-1 leading-snug">{img.description}</p>
                  )}
                </div>
                <a
                  href={`https://wa.me/5548984284149?text=${encodeURIComponent(`Olá! Vi o modelo "${img.title}" no site de vocês e tenho interesse. Poderia me passar mais informações sobre valores e opções disponíveis?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-xs font-semibold text-primary-dark hover:text-foreground transition-colors whitespace-nowrap rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2"
                >
                  Solicitar
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
