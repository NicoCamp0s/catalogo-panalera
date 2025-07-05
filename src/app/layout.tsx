import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: {
    default: "Pañalera Nico",
    template: "%s | Pañalera Nico",
  },
  icons: {
    icon: "/icono-r.png",
    shortcut: "/icono-r.png",
    apple: "/icono-r.png",
  },
  metadataBase: new URL("https://catalogo-panaleranico.vercel.app"),
  description: "Pañales, accesorios y más para bebés. Compra fácil y rápido.",
  keywords: ["pañalera", "pañales", "bebés", "productos infantiles", "babysec", "pampers", "recien nacido", "accesorios"],
  authors: [{ name: "Nicolás Campos", url: "https://catalogo-panaleranico.vercel.app/" }],
  creator: "Nicolás Campos",
  openGraph: {
    title: "Pañalera Nico",
    description: "Todo lo que tu bebé necesita, en un solo lugar.",
    url: "https://catalogo-panaleranico.vercel.app/",
    siteName: "Pañalera Nico",
    images: [
      {
        url: "/images/panalera_nico.png",
        width: 900,
        height: 150,
        alt: "Pañalera Nico",
      },
    ],
    locale: "es_AR",
    type: "website",
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
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
