import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import pino from 'pino'
import { createDailyRotatingNdjsonStream, ensureLogsDir } from './logging.js'
import { IPC_CHANNELS, isLogEvent } from './shared/ipc.js'

let mainWindow: BrowserWindow | null = null

const logsDirectory = ensureLogsDir()
const rotatingStream = createDailyRotatingNdjsonStream(logsDirectory)
const logger = pino(
  {
    base: { process: 'main' },
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  rotatingStream,
)

function createMainWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })

  const isDev = process.env.VITE_DEV_SERVER_URL
  if (isDev && mainWindow) {
    mainWindow.loadURL(isDev)
  } else if (mainWindow) {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(() => {
  logger.info('Application starting')
  createMainWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })

  ipcMain.on(IPC_CHANNELS.LOG_EVENT, (event, payload) => {
    if (!isLogEvent(payload)) {
      logger.warn({ payload }, 'Rejected invalid log event from renderer')
      return
    }
    const { level, message, details } = payload
    const meta = { process: 'renderer', details }
    switch (level) {
      case 'trace':
        logger.trace(meta, message)
        break
      case 'debug':
        logger.debug(meta, message)
        break
      case 'info':
        logger.info(meta, message)
        break
      case 'warn':
        logger.warn(meta, message)
        break
      case 'error':
        logger.error(meta, message)
        break
      case 'fatal':
        logger.fatal(meta, message)
        break
      default:
        logger.info(meta, message)
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})


