import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "Parastructure | Master Bridge Engineering",
  description: "Transform your career with specialized courses in RCC Bridge, Steel Bridge, and PSC I Design.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className} style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
        <Header />
        <main style={{flexGrow: 1}}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
