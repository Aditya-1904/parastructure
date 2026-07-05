import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Chatbot from "@/components/Chatbot";
import Footer from "@/components/Footer";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Parastructure | Master Bridge Engineering",
  description:
    "India's most advanced cohort-based bridge engineering program. Learn advanced Bridge design from industry leaders. Live sessions, real projects, and professional portfolio building.",
  keywords: [
    "bridge engineering course",
    "structural engineering online",
    "advanced bridge design",
    "MIDAS Civil training",
    "infrastructure engineering India",
  ],
  openGraph: {
    title: "Parastructure | Master Bridge Engineering",
    description:
      "India's most advanced cohort-based bridge engineering program. Live sessions, real projects, portfolio building.",
    siteName: "Parastructure",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body>
        <Header />
        <main style={{ flexGrow: 1 }}>{children}</main>
        <Chatbot />
        <Footer />
      </body>
    </html>
  );
}
