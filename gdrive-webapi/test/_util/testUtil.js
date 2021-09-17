import { Readable, Writable, Transform } from 'stream'

export default class TestUtil {
  
  static generateReadableStream(data) {
    return new Readable({
      read() {
        for (const item of data) {
          this.push(item)
        }

        this.push(null)
      }
    })
  }

  static generateWritableStream(onData) {
    return new Writable({
      objectMode: true,
      write(chunk, encoding, callback) {
        onData(chunk)
        
        callback(null, chunk)
      }
    })
  }

  static generateTransformStream(onTransform) {
    return new Transform({
      objectMode: true,
      transform(chunk, enconding, callback) {
        onTransform(chunk)
        
        callback(null, chunk)
      }
    })
  }
}