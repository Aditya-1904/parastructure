import { Outfit, Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
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
  metadataBase: new URL('https://parastructure.in'),
  title: {
    default: "ParaStructure | Master Bridge Engineering",
    template: "%s | ParaStructure"
  },
  description: "India's most advanced cohort-based bridge engineering program. Learn advanced Bridge design from industry leaders. Live sessions, real projects, and professional portfolio building.",
  keywords: [
    "parastructure",
    "para structure",
    "bridge engineering course",
    "structural engineering online",
    "advanced bridge design",
    "MIDAS Civil training",
    "infrastructure engineering India",
    "civil engineering cohort"
  ],
  authors: [{ name: 'ParaStructure Pvt. Ltd.' }],
  creator: 'ParaStructure',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://parastructure.in',
    siteName: 'ParaStructure',
    title: 'ParaStructure | Advanced Bridge Engineering Cohort',
    description: 'Transform your civil engineering career with industry-leading bridge design education, live mentorship, and real-world projects.',
    images: [
      {
        url: '/og-image.jpg', // You can add an actual image to the public folder later
        width: 1200,
        height: 630,
        alt: 'ParaStructure Masterclass',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ParaStructure | Master Bridge Engineering',
    description: 'Transform your civil engineering career with industry-leading bridge design education.',
  },
  verification: {
    google: 'bqknNfZkhnTbjrNzUB0QAQbuQCkz4NhFM-uuDsLLMy4',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
        <body>
          <Header />
          <main style={{ flexGrow: 1 }}>{children}</main>
          <Chatbot />
          <Footer />
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
