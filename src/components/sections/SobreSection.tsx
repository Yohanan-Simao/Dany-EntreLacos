"use client"

import { motion } from "framer-motion"
import { Sparkles, Hand, Gem } from "lucide-react"

const values = [
  {
    icon: Sparkles,
    title: "Detalhe em tudo",
    desc: "Da escolha da fita ao último ponto do acabamento, cada etapa é planejada para a peça ficar perfeita.",
  },
  {
    icon: Hand,
    title: "100% feito à mão",
    desc: "Nada de produção em massa: cada laço e tiara é confeccionado manualmente, com atenção a cada detalhe.",
  },
  {
    icon: Gem,
    title: "Materiais selecionados",
    desc: "Fitas de alta qualidade e apliques delicados, escolhidos para garantir conforto, beleza e durabilidade.",
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
            Nossa história
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-balance mb-4">
            Cada peça começa com uma{" "}
            <span className="text-primary-dark font-cursive">dose de amor</span>
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
              O que começou como um hobby virou a nossa{" "}
              <span className="text-primary-dark font-cursive">paixão</span>.
            </h3>
            <p className="text-muted text-lg leading-relaxed">
              Tudo começou com a vontade de criar acessórios delicados e únicos para quem a gente amava. As primeiras
              tiaras nasceram como presentes — e a alegria de quem recebia mostrou que ali havia algo especial. Hoje,
              a vitrine reúne peças que criamos com carinho, e cada pedido — seja de uma peça pronta ou de uma exclusiva —
              carrega esse mesmo cuidado, do início ao fim.
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
