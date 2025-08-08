import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS, LogLevel, RendererLogEvent } from '../src/shared/ipc'

type RendererLogger = {
  send: (level: LogLevel, message: string, details?: unknown) => void
  trace: (message: string, details?: unknown) => void
  debug: (message: string, details?: unknown) => void
  info: (message: string, details?: unknown) => void
  warn: (message: string, details?: unknown) => void
  error: (message: string, details?: unknown) => void
  fatal: (message: string, details?: unknown) => void
}

const logApi: RendererLogger = {
  send(level, message, details) {
    const payload: RendererLogEvent = { level, message, details }
    ipcRenderer.send(IPC_CHANNELS.LOG_EVENT, payload)
  },
  trace(message, details) {
    logApi.send('trace', message, details)
  },
  debug(message, details) {
    logApi.send('debug', message, details)
  },
  info(message, details) {
    logApi.send('info', message, details)
  },
  warn(message, details) {
    logApi.send('warn', message, details)
  },
  error(message, details) {
    logApi.send('error', message, details)
  },
  fatal(message, details) {
    logApi.send('fatal', message, details)
  },
}

contextBridge.exposeInMainWorld('log', logApi)

export {}


