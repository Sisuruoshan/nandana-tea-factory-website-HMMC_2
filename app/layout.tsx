import type { Metadata } from 'next'
import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'
import KeyboardShortcuts from './components/KeyboardShortcuts'

export const metadata: Metadata = {
  title: 'Nandana Tea - Experience the Essence of Ceylon',
  description: 'Discover the rich heritage and exquisite flavors of Nandana Tea, crafted with passion and tradition.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body>
        <KeyboardShortcuts />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
