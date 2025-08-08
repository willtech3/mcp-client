export const IPC_CHANNELS = {
  LOG_EVENT: 'log:event',
} as const

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'

export interface RendererLogEvent {
  level: LogLevel
  message: string
  details?: unknown
}

export function isLogEvent(value: unknown): value is RendererLogEvent {
  if (typeof value !== 'object' || value === null) return false
  const anyVal = value as Record<string, unknown>
  const level = anyVal.level
  const message = anyVal.message
  const validLevels: ReadonlyArray<LogLevel> = ['trace', 'debug', 'info', 'warn', 'error', 'fatal']
  return (
    typeof message === 'string' &&
    typeof level === 'string' &&
    (validLevels as ReadonlyArray<string>).includes(level)
  )
}


