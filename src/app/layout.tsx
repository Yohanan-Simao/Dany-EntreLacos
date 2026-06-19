import type { Metadata } from "next";
import { Inter, Dancing_Script } from "next/font/google";
import "./globals.css";

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
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
