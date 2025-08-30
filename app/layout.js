// app/layout.js
import './globals.css'

export const metadata = {
  title: 'MEMPOOL.LON - London Crypto Directory',
  description: 'A living directory of ongoing and emerging blockchain companies in London',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}