// app/layout.js
import './globals.css'

export const metadata = {
  title: 'The London Crypto Directory',
  description: 'A Database of crypto firms in London built in an attempt to solve the fragmented crypto scene here.',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#004225',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}