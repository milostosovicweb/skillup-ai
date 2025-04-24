import './globals.css'
import TopNav from '@/components/TopNav'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TopNav />
        <main className="pt-20 px-4">{children}</main>
      </body>
    </html>
  )
}
