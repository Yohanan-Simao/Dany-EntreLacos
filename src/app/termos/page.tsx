import Link from "next/link"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export default function TermosPage() {
  return (
    <>
      <Header />
      <main id="main" className="bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-24">
          <Link href="/" className="text-sm font-medium text-primary-dark hover:text-foreground transition-colors mb-8 inline-block rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark">
            ← Voltar para o início
          </Link>
          <p className="font-cursive text-primary-dark text-lg mb-3 block">Termos</p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-balance mb-6">
            Termos de Uso
          </h1>
          <div className="space-y-6 text-muted leading-relaxed text-base">
            <p>
              Este site apresenta as peças artesanais da Dany EntreLaços. Ao utilizar o site ou entrar em contato, você concorda com os termos abaixo.
            </p>
            <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-2">Pedidos e encomendas</h2>
            <p>
              Todas as peças são feitas sob encomenda. O prazo de produção, valores e condições de pagamento são combinados individualmente pelo WhatsApp antes da confirmação do pedido.
            </p>
            <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-2">Fotos e cores</h2>
            <p>
              Fazemos o possível para que as fotos representem fielmente as peças, mas pequenas variações de cor podem ocorrer devido à iluminação e configurações do dispositivo.
            </p>
            <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-2">Propriedade intelectual</h2>
            <p>
              As imagens e o conteúdo deste site pertencem à Dany EntreLaços e não podem ser reproduzidos sem autorização.
            </p>
            <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-2">Contato</h2>
            <p>
              Dúvidas sobre estes termos podem ser esclarecidas pelo WhatsApp (48) 98428-4149.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
