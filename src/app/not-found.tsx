import Link from "next/link"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="min-h-dvh flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md py-32">
          <p className="font-cursive text-primary-dark text-xl mb-3">Ops, esse laço se desfez</p>
          <h1 className="font-display text-5xl font-semibold text-balance mb-4">
            Página não encontrada
          </h1>
          <p className="text-muted text-lg leading-relaxed mb-8">
            A página que você procura pode ter sido movida ou nunca existiu. Que tal voltar para a página inicial?
          </p>
          <Link
            href="/"
            className="inline-flex rounded-full bg-primary-dark px-8 py-3.5 text-base font-semibold text-white transition hover:brightness-95 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2"
          >
            Voltar para o início
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
