import React from "react";
import './globals.css';
import { Inter } from 'next/font/google';
import NavBar from '@/components/NavBar/NavBar';
import Footer from '@/components/Footer/Footer';
import ThemeProvider from '@/providers/ThemeProvider';
import { AuthProvider } from "@/providers/AuthProvider";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Blog of DavidWang',
  description: 'The best blog app!',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            <div className="container">
              <div className="wrapper">
                <NavBar />
                {children}
                <Footer />
              </div>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
} 