const path = require('path')

module.exports = {
    secret: "SECRET____",
    tokenExpiresIn: "24h",
    roleNames: {
        user: "USER",
        admin: "ADMIN"
    },
    paths: {
        files: path.resolve(__dirname) + "/files/",
        reportRouterDirUrl: "http://localhost:5002/report/download/",
        filesDirUrl: "http://ilusiak.loc/analyzer/server/files/",
    }
}