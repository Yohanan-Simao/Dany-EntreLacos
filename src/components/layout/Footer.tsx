import { AtSign, MessageCircle, MapPin } from "lucide-react"
import Link from "next/link"
import Logo from "./Logo"

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Logo className="w-14 h-14 shrink-0" fill="#ffffff" />
              <span className="text-2xl font-cursive">
                Dany EntreLaços
              </span>
            </div>
            <p className="text-white text-sm leading-relaxed">
              Tiaras e laços artesanais, feitos um a um com carinho. Cada peça é única — criada especialmente para o seu momento.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              {[
                { href: "#sobre", label: "Sobre Nós" },
                { href: "#produtos", label: "Produtos" },
                { href: "#contato", label: "Contato" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-white hover:text-white/80 transition-colors text-sm rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-dark"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-white">
                <AtSign size={16} aria-hidden="true" />
                <a
                  href="https://instagram.com/danyentrelacos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white/80 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-dark"
                >
                  @danyentrelacos
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-white">
                <MessageCircle size={16} aria-hidden="true" />
                <a
                  href="https://wa.me/5548984284149"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white/80 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-dark"
                >
                  (48) 98428-4149
                </a>
              </li>

              <li className="flex items-center gap-2 text-sm text-white">
                <MapPin size={16} aria-hidden="true" />
                <span>Biguaçu, SC</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/20 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center text-sm text-white">
          <p>&copy; {new Date().getFullYear()} Dany EntreLaços. Todos os direitos reservados.</p>
          <nav className="flex items-center gap-3" aria-label="Legal">
            <span className="hidden sm:inline text-white/50" aria-hidden="true">·</span>
            <Link href="/privacidade" className="hover:text-white/80 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-dark">
              Política de Privacidade
            </Link>
            <span className="hidden sm:inline text-white/50" aria-hidden="true">·</span>
            <Link href="/termos" className="hover:text-white/80 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-dark">
              Termos de Uso
            </Link>
            <span className="hidden sm:inline text-white/50" aria-hidden="true">·</span>
            <Link href="/admin" className="hover:text-white/80 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-dark">
              Administração
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
