const fs = require('fs')

class FileService {
    getFilesFromDir = (dir) => {
        return fs.readdirSync(dir)
    }
}

module.exports = new FileService()