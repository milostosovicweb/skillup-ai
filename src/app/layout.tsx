import './globals.css'
import TopNav from '@/components/TopNav'
import Footer from '@/components/Footer'
import { Quicksand } from "next/font/google";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // adjust as needed
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="business" className={quicksand.className}>
      <body>
        <TopNav />
        <main className="pt-10">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
