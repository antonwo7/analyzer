require('dotenv').config()
const { Sequelize } = require('sequelize')

class BDService {
    sequelize = null

    constructor() {
        this.sequelize = new Sequelize(process.env.DATABASE, process.env.LOGIN, process.env.PASSWORD, {
            host: process.env.HOST,
            dialect: 'mysql'
        })
    }

    dbConnect = async () => {
        if (!this.sequelize) return;
        await this.sequelize.authenticate()
    }

    dbClose = async () => {
        console.log('BDService dbClose')
        await this.sequelize.close()
    }
}

module.exports = new BDService()