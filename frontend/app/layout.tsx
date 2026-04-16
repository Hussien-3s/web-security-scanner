import type { Metadata } from 'next'
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'CyberScan - Security Posture Management',
  description: 'Enterprise grade vulnerability intelligence',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body cz-shortcut-listen="true" className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black w-[100%] h-[100vh] text-white selection:bg-blue-500/30 p-0 m-0 selection:text-blue-200`}>
        <ClerkProvider>
          <main className="w-full h-full bg-[#03050a]">
            {children}
          </main>
        </ClerkProvider>
      </body>
    </html>
  )
}