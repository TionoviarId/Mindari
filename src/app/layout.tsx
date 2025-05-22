import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

// Load Poppins font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // Tambahkan berat yang kamu butuhkan
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Mindari",
  description: "Jaga Kesehatan Mentalmu, Mulai dari Sekarang",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
