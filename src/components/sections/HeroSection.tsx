"use client"

import { motion } from "framer-motion"
import { ArrowDown, Sparkles } from "lucide-react"

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-dvh flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent-light" />

      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 font-cursive text-lg text-primary-dark">
            <Sparkles size={14} />
            Mais do que laços, criamos memórias
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-balance leading-[1.05] mb-6"
        >
          <span className="text-primary-dark font-cursive">Bem-vinda à</span>{" "}
          <span className="text-foreground font-cursive">Dany EntreLaços</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Cada peça é produzida artesanalmente, com carinho, dedicação e atenção aos mínimos detalhes. Escolha uma das peças prontas da vitrine ou crie a sua exclusiva, feita sob encomenda do jeitinho que você imaginar.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#contato"
            className="rounded-full bg-primary-dark px-8 py-3.5 text-base font-semibold text-white transition hover:brightness-95 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2"
          >
            Encomendar minha peça
          </a>
          <a
            href="#produtos"
            className="rounded-full border-2 border-primary/30 px-8 py-3.5 text-base font-semibold text-primary-dark transition hover:border-primary-dark hover:bg-primary/5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2"
          >
            Ver criações
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16"
        >
          <a
            href="#sobre"
            className="inline-flex flex-col items-center gap-1 text-muted hover:text-primary-dark transition-colors"
          >
            <span className="text-xs font-medium">Descubra nossa história</span>
            <ArrowDown size={16} className="animate-bounce" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
