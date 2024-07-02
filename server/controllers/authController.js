const Controller = require('../controllers/Controller')
require('dotenv').config()
const bcrypt = require('bcryptjs')
const {validationResult} = require('express-validator')
const authService = require('../services/AuthService')
const User = require("../models/User")
const Role = require("../models/Role")
const {roleNames} = require('../config')


class authController extends Controller {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return this.unsuccess(res, { message: 'Registration error', errors: errors })
            }

            const { username, password, name, surname } = req.body
            const candidate = await User.findOne({ where: { username }, attributes: ['id', 'username'] })
            if (candidate) {
                return this.unsuccess(res,{ message: "User exist", candidate })
            }

            const hashedPassword = bcrypt.hashSync(password, 7)
            const userRole = await Role.findOne({ where: { name: roleNames.user }, attributes: ['id', 'name'] })
            User.create({ username, password: hashedPassword, role: userRole.id, name, surname  })

            return this.success(res,{ message: 'User registered' })

        } catch (e) {
            this.error(res, e)
        }
    }

    login = async (req, res) => {
        try {
            const { username, password } = req.body
            const user = await User.findOne({ raw: true, where: { username }, attributes: ['id', 'username', 'password', 'role', 'name', 'surname'] })
            if (!user) {
                return this.unsuccess(res,{ message: 'User not found' })
            }

            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return this.unsuccess(res,{ message: 'Password incorrect' })
            }

            const userRole = await Role.findOne({ where: { id: user.role }, attributes: ['name'] })
            const userRoleName = userRole ? userRole.name : null
            const token = authService.generateToken(user.id, userRoleName)

            delete user.password

            return this.success(res,{ token: token, user: { ...user } })

        } catch (e) {
            this.error(res, e)
        }
    }

    validation = async (req, res) => {
        try {
            const { token } = req.body
            if (!token) {
                return this.unsuccess(res,{ message: 'Empty token', unauthorized: true  })
            }

            const authUser = await authService.validateToken(token)
            if (!authUser) {
                return this.unsuccess(res,{ message: 'User unknown', unauthorized: true })
            }

            return this.success(res, { user: { ...authUser } } )

        } catch (e) {
            this.error(res, e)
        }
    }
}

module.exports = new authController()