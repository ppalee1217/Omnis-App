import { readFileSync, writeFile } from 'fs'

// Path: note that the following paths are respective to the file importing them
export const FileReader = { // Sync read
  readBoat1() {
    try {
      const data = readFileSync('../../res/data/Boat1location.json', 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      log(error)
    }
  },
  readBoat2() {
    try {
      const data = readFileSync('../../res/data/Boat2location.json', 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      log(error)
    }
  }
}

export const FileWriter = { // Async write
  writeBoat1(localPosts = null) {
    if (localPosts !== null)
      return writeFile('../../res/data/Boat1location.json',
        JSON.stringify(localPosts, null, 2))
  },
  writeBoat2(localPosts = null) {
    if (localPosts !== null)
      return writeFile('../../res/data/Boat2location.json',
        JSON.stringify(localPosts, null, 2))
  }
}