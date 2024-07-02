const authService = require("../services/AuthService")
const {sequelize} = require("../services/BDService");
const {roleNames} = require("../config")

class AuthMiddleWare {
    authValidation = async (req, res, next) => {
        if (!req.headers.authorization) {
            return res.status(200).send({ message: "Tu petición no tiene cabecera de autorización" })
        }

        const token = req.headers.authorization.split(" ")[1]
        if (!token) {
            return res.status(200).json({ result: false, message: 'Empty token', unauthorized: true })
        }

        const authUser = await authService.validateToken(token)
        if (!authUser) {
            return res.status(200).json({ result: false, message: 'User unknown', unauthorized: true })
        }

        req.authUser = authUser

        next()
    }

    adminValidation = async (req, res, next) => {
        if (!req.headers.authorization) {
            return res.status(200).json({ result: false, message: 'Token empty', unauthorized: true })
        }

        const token = req.headers.authorization.split(" ")[1]

        const tokenData = authService.decodeToken(token)
        if (!tokenData) {
            return res.status(200).json({ result: false, message: 'Token invalid', unauthorized: true })
        }

        if (!tokenData.role) {
            return res.status(200).json({ result: false, message: 'Empty Role in Token', unauthorized: true })
        }

        if (tokenData.role !== roleNames.admin) {
            return res.status(200).json({ result: false, message: 'Access denied', unauthorized: true })
        }

        next()
    }
}

module.exports = new AuthMiddleWare()