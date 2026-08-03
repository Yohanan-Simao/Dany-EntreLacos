import Link from "next/link"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export default function PrivacidadePage() {
  return (
    <>
      <Header />
      <main id="main" className="bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-24">
          <Link href="/" className="text-sm font-medium text-primary-dark hover:text-foreground transition-colors mb-8 inline-block rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark">
            ← Voltar para o início
          </Link>
          <p className="font-cursive text-primary-dark text-lg mb-3 block">Privacidade</p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-balance mb-6">
            Política de Privacidade
          </h1>
          <div className="prose prose-neutral max-w-none space-y-6 text-muted leading-relaxed text-base">
            <p>
              A Dany EntreLaços valoriza a sua privacidade. Esta política explica quais informações coletamos e como as utilizamos.
            </p>
            <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-2">Dados que coletamos</h2>
            <p>
              Quando você entra em contato pelo formulário ou pelos nossos canais (WhatsApp e Instagram), coletamos apenas os dados que você nos informa voluntariamente: nome, telefone e o conteúdo da sua mensagem.
            </p>
            <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-2">Como usamos seus dados</h2>
            <p>
              Seus dados são usados exclusivamente para atender ao seu pedido de encomenda e responder às suas dúvidas. Não vendemos, alugamos ou compartilhamos suas informações com terceiros.
            </p>
            <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-2">Armazenamento e segurança</h2>
            <p>
              As mensagens enviadas pelo site são redirecionadas ao nosso WhatsApp, sem armazenamento de dados em servidores próprios. Tomamos medidas razoáveis para proteger qualquer informação pessoal que recebemos.
            </p>
            <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-2">Seus direitos</h2>
            <p>
              Você pode solicitar a qualquer momento a exclusão das suas informações pessoais entrando em contato conosco pelo WhatsApp (48) 98428-4149.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
