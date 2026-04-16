import type { Metadata } from 'next'
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import '../globals.css'

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white selection:bg-blue-500/30 selection:text-blue-200`}>
        <ClerkProvider>
          <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-4 bg-black/60 backdrop-blur-md border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <span className="text-xl font-bold tracking-tight">CyberScan</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
              <a href="#" className="hover:text-white transition-colors">Home</a>
              <a href="#" className="hover:text-white transition-colors">Features</a>
              <a href="#" className="hover:text-white transition-colors">Docs</a>
            </nav>

            <div className="flex items-center gap-4">
              <button className="text-zinc-400 hover:text-white transition-colors flex items-center justify-center w-8 h-8">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
              
              <Show when="signed-out">
                <div className="text-sm font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer hidden sm:block">
                  <SignInButton />
                </div>
                <SignUpButton>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium text-sm h-10 px-6 transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                    Get Started
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <UserButton appearance={{ elements: { userButtonAvatarBox: "w-9 h-9" } }} />
              </Show>
            </div>
          </header>
          <main className="pt-20">
            {children}
          </main>
        </ClerkProvider>
      </body>
    </html>
  )
}