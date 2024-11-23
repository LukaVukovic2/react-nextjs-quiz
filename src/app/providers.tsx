'use client'
import { system } from '@/styles/theme/theme'
import { ChakraProvider } from '@chakra-ui/react'
import { ThemeProvider } from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
          {children}
      </ThemeProvider>
    </ChakraProvider>
  )
}