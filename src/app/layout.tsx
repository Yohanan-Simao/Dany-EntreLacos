import type { Metadata } from "next";
import { Inter, Dancing_Script } from "next/font/google";
import "./globals.css";
import MotionProvider from "@/components/layout/MotionProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-cursive",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dany EntreLaços | Tiaras e Laços Artesanais Sob Encomenda",
  description:
    "Dany EntreLaços — Tiaras e laços artesanais feitos sob encomenda. Peças únicas e delicadas para casamentos, formaturas e ocasiões especiais em Biguaçu, SC.",
  themeColor: "#fafbfc",
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
    siteName: "Dany EntreLaços",
    title: "Dany EntreLaços | Tiaras e Laços Artesanais",
    description:
      "Tiaras e laços artesanais feitos sob encomenda. Peças únicas e delicadas para momentos especiais.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${dancingScript.variable} scroll-smooth`}
    >
      <body className="font-sans antialiased">
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
