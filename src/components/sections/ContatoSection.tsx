"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MessageCircle, AtSign, Send } from "lucide-react"

const WHATSAPP_NUMBER = "5548984284149"

const contactMethods = [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    desc: "Respondemos rápido!",
    action: "Enviar Mensagem",
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
  },
  {
    icon: AtSign,
    title: "Instagram",
    desc: "Veja nossos trabalhos",
    action: "Seguir @danyentrelacos",
    href: "https://instagram.com/danyentrelacos",
  },
]

export default function ContatoSection() {
  const [nome, setNome] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [mensagem, setMensagem] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const text = `Olá, Dany EntreLaços! Me chamo ${nome || "(nome)"}.${whatsapp ? ` Meu WhatsApp é ${whatsapp}.` : ""} Quero ${mensagem ? `: ${mensagem}` : "uma peça de vocês"} — pode me ajudar?`
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    )
  }

  return (
    <section id="contato" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-2xl"
        >
          <span className="text-primary-dark font-cursive text-lg mb-3 block">
            Contato
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-balance mb-3">
            Viu uma peça ou quer uma <span className="text-primary-dark font-cursive">exclusiva</span>?
          </h2>
          <p className="text-muted max-w-xl text-lg leading-relaxed">
            Cada pedido é preparado como se fosse para alguém da nossa própria família, porque sabemos que por trás de cada escolha existe um amor. Conte o que você imagina — modelo, cores, ocasião — e a gente cria do seu jeito.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-16">
          {contactMethods.map((method, index) => (
            <motion.a
              key={method.title}
              href={method.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group flex flex-col items-center text-center p-8 rounded-3xl bg-accent-light border border-primary/10 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30`}
            >
              <div className={`mb-4 text-primary-dark`}>
                <method.icon size={32} aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold mb-1">{method.title}</h3>
              <p className="text-sm text-muted mb-4">{method.desc}</p>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-primary-dark transition-[gap,color] group-hover:gap-3">
                {method.action}
                <Send size={14} aria-hidden="true" />
              </span>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-muted mb-1.5">
                  Seu nome
                </label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Como podemos te chamar?"
                  className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  autoComplete="name"
                  required
                />
              </div>
              <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium text-muted mb-1.5">
                  Seu WhatsApp
                </label>
                <input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Seu WhatsApp (opcional, mas ajuda)"
                  className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  autoComplete="tel"
                  inputMode="tel"
                  spellCheck={false}
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="mensagem" className="block text-sm font-medium text-muted mb-1.5">
                O que você procura?
              </label>
              <textarea
                id="mensagem"
                name="mensagem"
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                placeholder="Ex.: gostei da tiara da vitrine, ou quero uma azul com flores para formatura…"
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-primary-dark px-8 py-3.5 text-base font-semibold text-white transition hover:brightness-95 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} />
              Chamar no WhatsApp
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
