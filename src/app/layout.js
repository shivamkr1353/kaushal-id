import { Outfit, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Kaushal-ID — Trust Digitized, Skills Recognized",
  description:
    "India's first phygital platform connecting verified local talent with trusted households through neighborhood hardware store hubs.",
  keywords: [
    "Kaushal-ID",
    "verified workers",
    "trusted services",
    "electrician",
    "plumber",
    "carpenter",
    "India",
    "service marketplace",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a1a] text-[#e2e8f0]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
        <Header />
        <main className="flex-1 pt-16 lg:pt-18">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
