"use client"

import { motion } from "framer-motion"
import { MessageCircle, Camera, Send } from "lucide-react"

const contactMethods = [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    desc: "Respondemos rápido!",
    action: "Enviar Mensagem",
    href: "https://wa.me/5548984284149",
    color: "hover:bg-green-50 hover:border-green-300",
    iconColor: "text-green-500",
  },
  {
    icon: Camera,
    title: "Instagram",
    desc: "Veja nossos trabalhos",
    action: "Seguir @danyentrelacos",
    href: "https://instagram.com/danyentrelacos",
    color: "hover:bg-pink-50 hover:border-pink-300",
    iconColor: "text-pink-500",
  },
]

export default function ContatoSection() {
  return (
    <section id="contato" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm tracking-widest uppercase mb-4 block">
            Contato
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4">
            Faça Sua Encomenda
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-lg leading-relaxed">
            Entre em contato pelo canal que preferir e conte como quer sua peça especial.
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
              className={`group flex flex-col items-center text-center p-8 rounded-2xl border border-primary/10 transition-all ${method.color}`}
            >
              <div className={`mb-4 ${method.iconColor}`}>
                <method.icon size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-1">{method.title}</h3>
              <p className="text-sm text-muted mb-4">{method.desc}</p>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                {method.action}
                <Send size={14} />
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
          <form
            action="https://wa.me/5548984284149"
            method="GET"
            target="_blank"
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Seu nome"
                className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                required
              />
              <input
                type="tel"
                placeholder="Seu WhatsApp"
                className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                required
              />
            </div>
            <textarea
              placeholder="Conte o que você deseja: modelo, cores, ocasião especial..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
              required
            />
            <button
              type="submit"
              className="w-full rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} />
              Enviar Pedido pelo WhatsApp
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
