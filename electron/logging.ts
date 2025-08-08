import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { Writable } from 'node:stream'

export function ensureLogsDir(): string {
  const baseDir = path.join(os.homedir(), 'MCPClient', 'logs')
  fs.mkdirSync(baseDir, { recursive: true })
  return baseDir
}

function currentDateStamp(): string {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function createDailyRotatingNdjsonStream(logsDirectory: string): Writable {
  let activeDate = currentDateStamp()
  let activeFile = path.join(logsDirectory, `${activeDate}.ndjson`)
  let fileStream = fs.createWriteStream(activeFile, { flags: 'a' })

  function rotateIfNeeded(): void {
    const nowDate = currentDateStamp()
    if (nowDate !== activeDate) {
      fileStream.end()
      activeDate = nowDate
      activeFile = path.join(logsDirectory, `${activeDate}.ndjson`)
      fileStream = fs.createWriteStream(activeFile, { flags: 'a' })
    }
  }

  const rotating = new Writable({
    write(chunk, _encoding, callback) {
      try {
        rotateIfNeeded()
        fileStream.write(chunk, callback)
      } catch (error) {
        callback(error as Error)
      }
    },
    final(callback) {
      try {
        fileStream.end()
        callback()
      } catch (error) {
        callback(error as Error)
      }
    },
  })

  return rotating
}


