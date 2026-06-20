export const dynamic = "force-dynamic"

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import InstagramSection from "@/components/sections/InstagramSection";
import SobreSection from "@/components/sections/SobreSection";
import ProdutosSection from "@/components/sections/ProdutosSection";
import NovidadesSection from "@/components/sections/NovidadesSection";
import ContatoSection from "@/components/sections/ContatoSection";
import { listImages } from "@/lib/cloudinary";
import type { ImageMeta } from "@/lib/cloudinary";

type SectionImage = ImageMeta & {
  id: number;
  url: string;
  title: string;
  description: string;
  cropX: number;
  cropY: number;
};

export default async function Home() {
  let novidades: SectionImage[] = [];
  let produtos: SectionImage[] = [];

  try {
    const images = await listImages();
    const all = images as SectionImage[];
    novidades = all.filter((img) => (img.type || "produto") === "novidade").slice(0, 4);
    produtos = all.filter((img) => (img.type || "produto") === "produto").slice(0, 4);
  } catch {
    // API error — show empty sections
  }

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <NovidadesSection initialImages={novidades} />
        <InstagramSection />
        <SobreSection />
        <ProdutosSection initialImages={produtos} />
        <ContatoSection />
      </main>
      <Footer />
    </>
  );
}
