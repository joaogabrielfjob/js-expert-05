import {
  describe,
  test,
  expect,
  jest
} from '@jest/globals'
import fs from 'fs'
import FileHelper from '../../src/fileHelper.js'


describe('#FileHelper', () => {
  describe('#getFileStatus', () => {
    test('it should return files statuses in correct format', async () => {
      const statMock = {
        dev: 2050,
        mode: 33204,
        nlink: 1,
        uid: 1000,
        gid: 1000,
        rdev: 0,
        blksize: 4096,
        ino: 10619264,
        size: 309078,
        blocks: 608,
        atimeMs: 1631021066549.7717,
        mtimeMs: 1619355326860.711,
        ctimeMs: 1631020890157.0679,
        birthtimeMs: 1631020890145.0676,
        atime: '2021-09-07T13:24:26.550Z',
        mtime: '2021-04-25T12:55:26.861Z',
        ctime: '2021-09-07T13:21:30.157Z',
        birthtime: '2021-09-07T13:21:30.145Z'
      }

      const mockUser = 'joaogabriel'
      process.env.USER = mockUser

      const filename = 'file.jpeg'

      jest.spyOn(fs.promises, fs.promises.readdir.name).mockResolvedValue([filename])
      jest.spyOn(fs.promises, fs.promises.stat.name).mockResolvedValue(statMock)

      const result = await FileHelper.getFileStatus('/tmp')

      const expectedResult = [
        {
          size: "309 kB",
          lastModified: statMock.birthtime,
          owner: mockUser,
          file: filename
        }
      ]

      expect(fs.promises.stat).toHaveBeenCalledWith(`/tmp/${filename}`)
      expect(result).toMatchObject(expectedResult)
    })
  })
})