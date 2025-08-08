/// <reference types="vite/client" />

declare global {
  interface Window {
    log?: {
      send: (level: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal', message: string, details?: unknown) => void
      trace: (message: string, details?: unknown) => void
      debug: (message: string, details?: unknown) => void
      info: (message: string, details?: unknown) => void
      warn: (message: string, details?: unknown) => void
      error: (message: string, details?: unknown) => void
      fatal: (message: string, details?: unknown) => void
    }
  }
}

export {}
