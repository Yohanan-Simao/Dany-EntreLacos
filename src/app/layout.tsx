import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";
import MotionProvider from "@/components/layout/MotionProvider";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#faf7f2",
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dany-entrelacos.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Dany EntreLaços | Tiaras e Laços Artesanais Sob Encomenda",
  description:
    "Dany EntreLaços — Tiaras e laços artesanais feitos sob encomenda. Peças únicas e delicadas para casamentos, formaturas e ocasiões especiais em Biguaçu, SC.",
  keywords: [
    "tiaras artesanais",
    "laços artesanais",
    "acessórios femininos",
    "encomenda de tiaras",
    "Dany EntreLaços",
    "acessórios para casamento",
    "tiaras para noivas",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: "Dany EntreLaços",
    title: "Dany EntreLaços | Tiaras e Laços Artesanais",
    description:
      "Tiaras e laços artesanais feitos sob encomenda. Peças únicas e delicadas para momentos especiais.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Dany EntreLaços",
    description:
      "Tiaras e laços artesanais feitos sob encomenda. Peças únicas e delicadas para casamentos, formaturas e ocasiões especiais.",
    telephone: "+5548984284149",
    url: SITE_URL,
    image: `${SITE_URL}/images/logo.svg`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Biguaçu",
      addressRegion: "SC",
      addressCountry: "BR",
    },
    areaServed: "Santa Catarina",
    sameAs: ["https://instagram.com/danyentrelacos"],
  };

  return (
    <html
      lang="pt-BR"
      className={`${outfit.variable} ${fraunces.variable} scroll-smooth`}
    >
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-primary-dark focus:shadow-lg"
        >
          Pular para o conteúdo
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
