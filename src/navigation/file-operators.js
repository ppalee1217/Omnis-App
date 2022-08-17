import { writeFile } from 'fs'

export const FileWriter = { // Async write
  writeEver(BOAT = null) {
    if (BOAT !== null)
      return writeFile('../../res/data/Everlocation.json',JSON.stringify(BOAT, null, 2))
  },
  writeChina(BOAT = null) {
    if (BOAT !== null)
      return writeFile('../../res/data/Chinalocation.json',JSON.stringify(BOAT, null, 2))
  }
}