import { ThemeProvider } from "@/components/theme-provider"
import SessionProvider from "@/components/auth/SessionProvider"
import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "GrayCat Portfolio",
  description: "Full Stack Developer & Robotics Engineer Portfolio",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
          >
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
