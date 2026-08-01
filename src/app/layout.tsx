import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/*
  Los iconos NO se declaran aqui: Next los toma por convencion de archivo desde
  `src/app/` (favicon.ico, icon.png, apple-icon.png) y les pone hash de version.
*/
export const metadata: Metadata = {
  // Base para las URLs absolutas que Next genera en el <head>.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Panel Adala",
    template: "%s · Adala",
  },
  description:
    "Panel interno de Adala para dar seguimiento a los prospectos que llegan por las campanas.",
  applicationName: "Panel Adala",
  // Es un panel interno con datos de contacto: que no lo indexe nadie.
  robots: { index: false, follow: false },
  // Al compartir el link por WhatsApp o Slack se ve el nombre, no una URL cruda.
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "Panel Adala",
    title: "Panel Adala",
    description: "Seguimiento de prospectos de las campanas de Adala.",
  },
  // Nombre corto si alguien lo guarda en la pantalla de inicio del telefono.
  appleWebApp: { title: "Adala" },
  // El panel ya pinta sus propios botones de llamada y WhatsApp; sin esto iOS
  // encima autodetecta los telefonos y los subraya con su estilo.
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  // Tine la barra del navegador movil del mismo color que la malla de fondo.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef4f8" },
    { media: "(prefers-color-scheme: dark)", color: "#06101a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      // suppressHydrationWarning: next-themes escribe la clase del tema en el
      // cliente antes de hidratar, asi que el html difiere del render servidor.
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <ThemeProvider>
          {/* NuqsAdapter conecta los filtros de la URL con el router de Next. */}
          <NuqsAdapter>{children}</NuqsAdapter>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
