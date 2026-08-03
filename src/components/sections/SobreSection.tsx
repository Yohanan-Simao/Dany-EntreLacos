"use client"

import { motion } from "framer-motion"
import { Sparkles, Hand, Gem } from "lucide-react"

const values = [
  {
    icon: Sparkles,
    title: "Detalhe em tudo",
    desc: "Tudo é planejado nos mínimos detalhes para a melhor experiência, da escolha da fita ao acabamento final.",
  },
  {
    icon: Hand,
    title: "100% feito à mão",
    desc: "Cada laço e tiara é confeccionado manualmente, com amor e atenção extrema aos detalhes e acabamentos.",
  },
  {
    icon: Gem,
    title: "Materiais selecionados",
    desc: "Fitas importadas de alta qualidade e apliques seguros para garantir conforto e durabilidade.",
  },
]

export default function SobreSection() {
  return (
    <section id="sobre" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 20 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-2xl"
        >
          <span className="text-primary-dark font-cursive text-lg mb-3 block">
            Sobre nós
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-balance mb-4">
            A história da{" "}
            <span className="text-primary-dark font-cursive">Dany EntreLaços</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-display text-2xl sm:text-3xl font-semibold text-balance leading-snug mb-6">
              Cada peça nasce de um processo feito{" "}
              <span className="text-primary-dark font-cursive">à mão</span>, do
              início ao fim.
            </h3>
            <p className="text-muted text-lg leading-relaxed">
              Tudo começou com a paixão por criar acessórios delicados e únicos. O que era um hobby se transformou
              em uma missão: levar elegância e charme através de tiaras e laços artesanais.
            </p>
          </motion.div>

          <ul className="divide-y divide-primary/15">
            {values.map((item, index) => (
              <motion.li
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="py-6 group first:pt-0 last:pb-0"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary-dark group-hover:bg-primary-dark group-hover:text-white transition-colors">
                    <item.icon size={22} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold mb-1">{item.title}</h3>
                    <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
