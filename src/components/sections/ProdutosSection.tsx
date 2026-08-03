"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Sparkles, Crown, Gift } from "lucide-react"
import { useGalleryImages, type GalleryImage } from "@/lib/use-gallery-images"

const products = [
  {
    icon: Crown,
    title: "Tiaras Artesanais",
    desc: "Tiaras delicadas para casamentos, formaturas, aniversários e ocasiões especiais. Personalizáveis com flores, pérolas e cristais.",
    features: ["Pronta entrega", "Personalizáveis", "Entrega em toda Santa Catarina"],
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
  const gallery = useGalleryImages("produto", initialImages)

  return (
    <section id="produtos" className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-2xl"
        >
          <span className="text-primary-dark font-cursive text-lg mb-3 block">
            Produtos
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-balance mb-3">
            Prontas para levar ou <span className="text-primary-dark font-cursive">feitas pra você</span>
          </h2>
          <p className="text-muted max-w-xl text-lg leading-relaxed">
            Gostou de alguma peça da vitrine? É só pedir. Ou conte o que você imagina e a gente cria uma exclusiva — sempre com materiais selecionados e acabamento impecável.
          </p>
        </motion.div>

        {gallery.length > 0 && (
          <div className="mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {gallery.map((img) => {
              const wa = `https://wa.me/5548984284149?text=${encodeURIComponent(`Olá! Vi o modelo "${img.title}" no site de vocês e tenho interesse. Poderia me passar mais informações sobre valores e opções disponíveis?`)}`
              return (
              <div
                key={img.id}
                className="bg-white rounded-3xl overflow-hidden group transition-shadow hover:shadow-xl hover:shadow-primary/10"
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
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    loading="lazy"
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
                    className="shrink-0 text-xs font-semibold text-primary-dark hover:text-foreground transition-colors whitespace-nowrap"
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
              className="group bg-accent-light rounded-3xl p-8 sm:p-10 transition-transform hover:-translate-y-1"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/10 text-primary-dark mb-4 sm:mb-5">
                <product.icon size={22} />
              </div>
              <h3 className="font-display text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{product.title}</h3>
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
            className="inline-flex rounded-full bg-primary-dark px-8 py-3.5 text-base font-semibold text-white transition hover:brightness-95 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2"
          >
            Solicite seu orçamento
          </a>
        </motion.div>
      </div>
    </section>
  )
}
