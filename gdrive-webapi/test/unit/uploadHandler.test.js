import {
  describe,
  test,
  expect,
  jest
} from '@jest/globals'
import UploadHandler from '../../src/uploadHandler.js'
import TestUtil from '../_util/testUtil.js'
import fs from 'fs'
import { resolve } from 'path'

describe('#UploadHandler test suite', () => {
  const ioObj = {
    to: (id) => ioObj,
    emit: (event, message) => { }
  }

  describe('#registerEvents', () => {
    test('should call onFile and onFinish on busBoy instance', () => {
      const uploadHandler = new UploadHandler({
        io: ioObj,
        socketId: '01'
      })

      jest.spyOn(uploadHandler, uploadHandler.onFile.name).mockResolvedValue()

      const headers = {
        'content-type': 'multipart/form-data; boundary='
      }

      const fn = jest.fn()
      const busBoyInstance = uploadHandler.registerEvents(headers, fn)

      const fileStream = TestUtil.generateReadableStream([ 'chunk', 'of', 'data' ])
      
      busBoyInstance.emit('file', 'fieldname', fileStream, 'filename.txt')
      busBoyInstance.listeners('finish')[0].call()

      expect(uploadHandler.onFile).toHaveBeenCalled()
      expect(fn).toHaveBeenCalled()
    })
  })

  describe('#onFile', () => {
    test('given a stream file it should save it on disk', async () => {
      const chunks = ['hey', 'dude']
      const folder = '/tmp'
      const handler = new UploadHandler({
        io: ioObj,
        socketId: '01',
        folder
      })

      const onData = jest.fn()
      const onTransform = jest.fn()

      jest.spyOn(fs, fs.createWriteStream.name).mockImplementation(() => TestUtil.generateWritableStream(onData))
      jest.spyOn(handler, handler.handleFileBytes.name).mockImplementation(() => TestUtil.generateTransformStream(onTransform))

      const params = {
        fieldname: 'video',
        file: TestUtil.generateReadableStream(chunks),
        filename: 'mockfile.mov'
      }

      await handler.onFile(...Object.values(params))

      expect(onData.mock.calls.join()).toEqual(chunks.join())
      expect(onTransform.mock.calls.join()).toEqual(chunks.join())

      const expectedFilename = resolve(handler.folder, params.filename)
      
      expect(fs.createWriteStream).toHaveBeenCalledWith(expectedFilename)
    })
  })
})