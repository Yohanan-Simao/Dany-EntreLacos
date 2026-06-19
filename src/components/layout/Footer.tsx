import { Camera, MessageCircle, MapPin } from "lucide-react"
import Logo from "./Logo"

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Logo className="w-28 h-28" />
              <span className="text-2xl font-cursive">
                Dany EntreLaços
              </span>
            </div>
            <p className="text-white/85 text-sm leading-relaxed">
              Tiaras e laços artesanais feitos com amor e carinho. Cada peça é única, feita especialmente para você.
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
                    className="text-white/85 hover:text-white transition-colors text-sm"
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
              <li className="flex items-center gap-2 text-sm text-white/85">
                <Camera size={16} />
                <a
                  href="https://instagram.com/danyentrelacos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  @danyentrelacos
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/85">
                <MessageCircle size={16} />
                <a
                  href="https://wa.me/5548984284149"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  (48) 98428-4149
                </a>
              </li>

              <li className="flex items-center gap-2 text-sm text-white/85">
                <MapPin size={16} />
                <span>Biguaçu, SC</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/20 text-center text-sm text-white/85">
          <p>&copy; {new Date().getFullYear()} Dany EntreLaços. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
