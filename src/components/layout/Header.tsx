"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Logo from "./Logo"

const navLinks = [
  { href: "#hero", label: "Início" },
  { href: "#sobre", label: "Sobre" },
  { href: "#produtos", label: "Produtos" },
  { href: "#contato", label: "Contato" },
]

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-dark"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [active, setActive] = useState("#hero")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`)
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    )
    navLinks.forEach((link) => {
      const el = document.getElementById(link.href.slice(1))
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false)
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener("keydown", onKey)
    }
  }, [isOpen])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary-dark shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <a href="#hero" className={`flex items-center gap-3 rounded-lg ${focusRing}`}>
            <Logo className="w-12 h-12 sm:w-14 sm:h-14 shrink-0" fill="#ffffff" />
            <span className="text-2xl font-cursive text-white">
              Dany EntreLaços
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={active === link.href ? "page" : undefined}
                className={`rounded text-sm font-medium transition-opacity ${
                  active === link.href
                    ? "text-white underline underline-offset-8 decoration-white/50"
                    : "text-white hover:opacity-80"
                } ${focusRing}`}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contato"
              className={`rounded-full bg-white px-5 py-2 text-sm font-semibold text-primary-dark transition-colors hover:bg-white/90 active:scale-[0.97] ${focusRing}`}
            >
              Fazer Pedido
            </a>
          </nav>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg text-white hover:text-white/80 ${focusRing}`}
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="md:hidden overflow-hidden bg-primary-dark border-t border-white/20"
            id="mobile-menu"
          >
            <nav className="flex flex-col px-4 py-4 gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  aria-current={active === link.href ? "page" : undefined}
                  className={`text-sm font-medium transition-opacity py-2 rounded ${
                    active === link.href
                      ? "text-white underline underline-offset-4 decoration-white/50"
                      : "text-white hover:opacity-80"
                  } ${focusRing}`}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contato"
                onClick={() => setIsOpen(false)}
                className={`mt-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-primary-dark text-center transition-colors hover:bg-white/90 active:scale-[0.97] ${focusRing}`}
              >
                Fazer Pedido
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
