import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PageLayout from "@/components/PageLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Copper Beauty Salon & Spa | Miami",
  description: "Salón de belleza profesional especializado en HairStyle, Makeup, Manicure, Pedicure, Skincare, Wax, Lashes y Eyebrows en Miami.",
  keywords: "salon de belleza, beauty salon, miami, hair style, makeup, manicure, pedicure, skincare, wax, lashes, eyebrows",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <PageLayout />
        {children}
      </body>
    </html>
  );
}
