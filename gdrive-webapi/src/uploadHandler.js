import Busboy from 'busboy'
import { pipeline } from 'stream/promises'
import fs from 'fs'
import { logger } from './logger.js'

export default class UploadHandler {

  constructor({ io, socketId, folder }) { 
    this.io = io
    this.socketId = socketId
    this.folder = folder
  }

  handleFileBytes() {
    
  }

  async onFile(fieldname, file, filename) {
    const saveTo = `${this.folder}/${filename}`

    await pipeline(
      file,
      this.handleFileBytes.apply(this, [ filename ]),
      fs.createWriteStream(saveTo)
    )

    logger.info(`File [${filename}] finished`)
  }

  registerEvents(headers, onFinish) {
    const busBoy = new Busboy({ headers })

    busBoy.on('file', this.onFile.bind(this))
    busBoy.on('finish', onFinish)

    return busBoy
  }
}