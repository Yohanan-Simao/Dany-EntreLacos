"use client"

import { motion } from "framer-motion"
import { Sparkles, Hand, Gem } from "lucide-react"

const values = [
  {
    icon: Sparkles,
    title: "Por que escolher Dany EntreLaços?",
    desc: "Tudo é planejado nos mínimos detalhes para a melhor experiência.",
  },
  {
    icon: Hand,
    title: "100% Feito à Mão!",
    desc: "Cada laço e tiara é confeccionado manualmente com amor e atenção extrema aos detalhes e acabamentos.",
  },
  {
    icon: Gem,
    title: "Materiais Selecionados.",
    desc: "Utilizamos fitas importadas de alta qualidade e apliques seguros para garantir conforto e durabilidade.",
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
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm tracking-widest uppercase mb-4 block">
            Sobre Nós
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4">
            A História da{" "}
            <span className="text-primary font-cursive">Dany EntreLaços</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-lg leading-relaxed">
            Tudo começou com a paixão por criar acessórios delicados e únicos. O que era um hobby se transformou
            em uma missão: levar elegância e charme através de tiaras e laços artesanais.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ y: 20 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group text-center p-8 rounded-2xl bg-white hover:bg-primary/5 border-2 border-primary/30 shadow-sm transition-all"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-5 group-hover:bg-primary group-hover:text-white transition-all">
                <item.icon size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-foreground text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
