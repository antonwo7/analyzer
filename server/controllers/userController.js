const Controller = require('../controllers/Controller')
require('dotenv').config()
const bcrypt = require('bcryptjs')
const {validationResult} = require('express-validator')
const authService = require('../services/AuthService')
const User = require("../models/User")
const Role = require("../models/Role")
const {paramToDate} = require("../functions/days");
const {sequelize} = require("../services/BDService");
const {roleNames} = require('../config')


class userController extends Controller {
    getUsers = async (req, res) => {
        try {
            const users = await User.findAll({ raw: true, attributes: ['id', 'username', 'name', 'surname'] })
            return this.success(res,{ users: users })

        } catch (e) {
            this.error(res, e)
        }
    }

    addUser = async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return this.unsuccess(res,{ message: 'User adding error', errors: errors })
            }

            const { username, password, name, surname } = req.body
            const candidate = await User.findOne({ where: { username }, attributes: ['id', 'username'] })
            if (candidate) {
                return this.unsuccess(res,{ message: "User exist", candidate })
            }

            const hashedPassword = bcrypt.hashSync(password, 7)
            const userRole = await Role.findOne({ where: { name: roleNames.user }, attributes: ['id', 'name'] })
            if (!userRole) {
                return this.unsuccess(res,{ message: "Role not exist" })
            }

            await User.create({ username, password: hashedPassword, role: userRole.id, name, surname  })

            // const users = await User.findAll({ raw: true, attributes: ['id', 'username', 'name', 'surname'] })

            return this.success(res)

        } catch (e) {
            this.error(res, e)
        }
    }

    removeUser = async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return this.unsuccess(res,{ message: 'User removing error', errors: errors })
            }

            const { user_id } = req.body

            const candidate = await User.findOne({ where: { id: user_id }, attributes: ['id'] })
            if (!candidate) {
                return this.unsuccess(res,{ message: "User not exist", candidate })
            }

            await User.destroy({ where: { id: user_id } })

            // const users = await User.findAll({ raw: true, attributes: ['id', 'username', 'name', 'surname'] })

            return this.success(res)

        } catch (e) {
            this.error(res, e)
        }
    }

    editUser = async(req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return this.unsuccess({ message: 'User editing error', errors: errors })
            }

            const { id, username, password, name, surname } = req.body
            const candidate = await User.findOne({ where: { id }, attributes: ['id'] })
            if (!candidate) {
                return this.unsuccess(res,{ message: "User not exist", candidate })
            }

            const newUserData = { username, name, surname }

            if (password) {
                newUserData.password = bcrypt.hashSync(password, 7)
            }

            await User.update( {  ...newUserData }, { where: { id } })
            const users = await User.findAll({ raw: true, attributes: ['id', 'username', 'name', 'surname'] })

            return this.success(res,{ users: users })

        } catch (e) {
            this.error(res, e)
        }
    }
}

module.exports = new userController()