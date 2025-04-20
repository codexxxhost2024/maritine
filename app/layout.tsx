import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/layout/header"
import "./globals.css"
import "../styles/calendar.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Maritime Tools Suite",
  description: "A comprehensive suite of AI-enhanced maritime tools for navigation and operations",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Header />
          <main className="pt-20">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
