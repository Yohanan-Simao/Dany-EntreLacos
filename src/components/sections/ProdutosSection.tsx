"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Sparkles, Crown, Gift } from "lucide-react"

type GalleryImage = {
  id: number
  url: string
  title: string
  cropX: number
  cropY: number
}

const products = [
  {
    icon: Crown,
    title: "Tiaras Artesanais",
    desc: "Tiaras delicadas para casamentos, formaturas, aniversários e ocasiões especiais. Personalizáveis com flores, pérolas e cristais.",
    features: ["Sob encomenda", "Personalizáveis", "Entrega em toda Santa Catarina"],
  },
  {
    icon: Sparkles,
    title: "Laços Decorativos",
    desc: "Laços de cetim, veludo e gorgorão. Perfeitos para penteados, presentes e decoração. Disponíveis em diversos tamanhos.",
    features: ["Várias cores", "Diferentes tamanhos", "Acabamento impecável"],
  },
  {
    icon: Gift,
    title: "Kits Presente",
    desc: "Conjuntos especiais com tiara + laço combinando. O presente perfeito para quem ama acessórios exclusivos.",
    features: ["Embalagem especial", "Combinações únicas", "Pronto para entregar"],
  },
]

export default function ProdutosSection({ initialImages = [] }: { initialImages?: GalleryImage[] }) {
  const [gallery, setGallery] = useState<GalleryImage[]>(initialImages)

  useEffect(() => {
    let polling: number

    async function loadImages() {
      try {
        const res = await fetch(`/api/admin/upload?t=${Date.now()}`, { cache: "no-store" })
        const data = await res.json()
        if (Array.isArray(data)) {
          setGallery(
            data
              .filter((img: { type?: string }) => (img.type || "produto") === "produto")
              .slice(0, 4)
          )
        }
      } catch {}
    }

    loadImages()

    function onPageShow(e: PageTransitionEvent) {
      if (e.persisted) loadImages()
    }

    function onVisibilityChange() {
      if (document.visibilityState === "visible") loadImages()
    }

    window.addEventListener("pageshow", onPageShow)
    document.addEventListener("visibilitychange", onVisibilityChange)

    polling = window.setInterval(() => {
      if (document.visibilityState === "visible") loadImages()
    }, 5000)

    return () => {
      window.removeEventListener("pageshow", onPageShow)
      document.removeEventListener("visibilitychange", onVisibilityChange)
      clearInterval(polling)
    }
  }, [])

  return (
    <section id="produtos" className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm tracking-widest uppercase mb-4 block">
            Produtos
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4">
            Nossas Criações
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-lg leading-relaxed">
            Cada peça é feita sob encomenda com materiais selecionados e acabamento impecável.
          </p>
        </motion.div>

        {gallery.length > 0 && (
          <div className="mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {gallery.map((img) => {
              const wa = `https://wa.me/5548984284149?text=${encodeURIComponent(`Olá! Vi o modelo "${img.title}" no site de vocês e tenho interesse. Poderia me passar mais informações sobre valores e opções disponíveis?`)}`
              return (
              <div
                key={img.id}
                className="bg-white rounded-2xl border border-primary/10 shadow-sm overflow-hidden group"
              >
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative aspect-square bg-gray-100 overflow-hidden"
                >
                  <Image
                    src={img.url}
                    alt={img.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    style={{ objectPosition: `${img.cropX}% ${img.cropY}%` }}
                  />
                </a>
                <div className="p-4 flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-sm truncate min-w-0">{img.title}</h3>
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-xs font-semibold text-primary hover:text-primary-dark transition-colors whitespace-nowrap"
                  >
                    Solicitar
                  </a>
                </div>
              </div>
              )
            })}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group bg-white rounded-2xl p-6 sm:p-8 border border-primary/10 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/10 text-primary mb-4 sm:mb-5">
                <product.icon size={22} />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{product.title}</h3>
              <p className="text-muted text-sm leading-relaxed mb-4 sm:mb-5">{product.desc}</p>
              <ul className="space-y-2">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-muted">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <a
            href="#contato"
            className="inline-flex rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/30"
          >
            Solicite seu Orçamento
          </a>
        </motion.div>
      </div>
    </section>
  )
}
