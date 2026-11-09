import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Datto-Metro · Tu destino salarial 2030",
  description: "Descubrí tu línea de carrera en el IES N° 9 Juana Azurduy.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, background: "#f4f4ef", color: "#17211a", fontFamily: "Arial, sans-serif", WebkitFontSmoothing: "antialiased" }}>
        {children}
      </body>
    </html>
  );
}
