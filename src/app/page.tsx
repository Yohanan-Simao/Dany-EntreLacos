import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import InstagramSection from "@/components/sections/InstagramSection";
import SobreSection from "@/components/sections/SobreSection";
import ProdutosSection from "@/components/sections/ProdutosSection";
import NovidadesSection from "@/components/sections/NovidadesSection";
import ContatoSection from "@/components/sections/ContatoSection";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <NovidadesSection />
        <InstagramSection />
        <SobreSection />
        <ProdutosSection />
        <ContatoSection />
      </main>
      <Footer />
    </>
  );
}
