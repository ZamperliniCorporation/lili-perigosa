import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Great_Vibes } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
});

const script = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-script",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Para a Lili, aos 19",
  description: "Um presente em forma de livro, lanternas e violino.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${cinzel.variable} ${cormorant.variable} ${script.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="preload"
          as="image"
          href="/assets/capa_lili.jpeg"
          type="image/jpeg"
        />
      </head>
      <body className="min-h-full font-body">{children}</body>
    </html>
  );
}
