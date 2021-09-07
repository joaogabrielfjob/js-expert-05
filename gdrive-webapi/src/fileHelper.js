import fs from 'fs'
import prettyBytes from 'pretty-bytes'

export default class FileHelper {

  static async getFileStatus(folder) {
    const files = await fs.promises.readdir(folder)
    const stats = await Promise.all(files.map(file => {
      return fs.promises.stat(`${folder}/${file}`)
    }))

    const fileStats = []

    for (const file in files) {
      const { birthtime, size } = stats[file]

      fileStats.push({
        size: prettyBytes(size),
        file: files[file],
        lastModified: birthtime,
        owner: process.env.USER
      })
    }

    return fileStats
  }
}