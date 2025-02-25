import type { Metadata } from 'next'
import './globals.css'
import GlobalModalProvider from '@/components/GlobalModalProvider'

export const metadata: Metadata = {
  title: 'Dessert Recipes App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <GlobalModalProvider>
          {children}
        </GlobalModalProvider>
      </body>
    </html>
  )
}
