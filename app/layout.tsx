import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Espaço de Dança Fernanda Becker",
  description:
    "Onde a paixão pela dança ganha vida através do movimento e da arte",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
