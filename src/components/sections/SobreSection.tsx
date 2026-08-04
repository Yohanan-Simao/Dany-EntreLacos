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
            Sobre nós
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-balance mb-4">
            Mais do que laços,{" "}
            <span className="text-primary-dark font-cursive">criamos memórias</span>
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
              Há mais de 14 anos, a Dany EntreLaços nasceu da união de duas grandes paixões: minha{" "}
              <span className="text-primary-dark font-cursive">filha</span> e o{" "}
              <span className="text-primary-dark font-cursive">artesanato</span>.
            </h3>
            <p className="text-muted text-lg leading-relaxed">
              Tudo começou quando ela tinha 7 anos. Eu sentia dificuldade em encontrar laços que combinassem com as
              roupas dela e refletissem toda a delicadeza que eu imaginava. Foi então que decidi criar os meus próprios
              acessórios.
            </p>
            <p className="text-muted text-lg leading-relaxed mt-4">
              Na verdade, essa história começou ainda antes. Desde que minha filha nasceu, o artesanato já fazia parte
              da minha vida — as primeiras touquinhas de crochê que ela usou foram feitas por mim, com muito amor. Sem
              perceber, ali nascia uma paixão que anos depois se transformaria em um sonho.
            </p>
            <p className="text-muted text-lg leading-relaxed mt-4">
              O que começou como uma necessidade e um gesto de carinho foi crescendo com dedicação, aprendizado e muito
              amor. Ao longo dessa trajetória, tive o privilégio de fazer parte de momentos especiais na vida de
              centenas de famílias, criando acessórios que acompanham sorrisos, aniversários, comunhão, primeiros dias
              de aula e tantas outras memórias.
            </p>
            <p className="text-muted text-lg leading-relaxed mt-4">
              Hoje, cada laço continua sendo feito à mão, com o mesmo cuidado e carinho do início. Acredito que o
              verdadeiro valor de um produto artesanal está na história que ele carrega e no amor colocado em cada
              detalhe. A menina que inspirou os meus primeiros laços cresceu, mas o propósito continua o mesmo: criar
              peças que levem beleza, carinho e memórias para outras meninas e suas famílias.
            </p>
            <p className="text-muted text-lg leading-relaxed mt-4">
              Seja bem-vinda à Dany EntreLaços. É uma alegria fazer parte da sua história também.
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
