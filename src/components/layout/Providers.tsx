'use client'
// src/components/layout/Providers.tsx
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            fontFamily: 'var(--font-instrument)',
            fontSize: '13.5px',
            fontWeight: '600',
            borderRadius: '10px',
            padding: '12px 18px',
            boxShadow: '0 8px 28px rgba(0,0,0,.14)',
          },
          success: { iconTheme: { primary: '#00873D', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#C8102E', secondary: '#fff' } },
        }}
      />
    </SessionProvider>
  )
}
