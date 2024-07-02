const Controller = require('../controllers/Controller')
require('dotenv').config()
const {validationResult} = require('express-validator')
const Type = require("../models/Type")


class typeController extends Controller {
    getTypes = async (req, res) => {
        try {
            const types = await Type.findAll({ raw: true, attributes: ['id', 'name'] })
            return this.success(res,{ types: types })

        } catch (e) {
            this.error(res, e)
        }
    }

    addType = async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return this.unsuccess(res,{ message: 'Type adding error', errors: errors })
            }

            const { name } = req.body
            const candidate = await Type.findOne({ where: { name }, attributes: ['id', 'name'] })
            if (candidate) {
                return this.unsuccess(res,{ message: "Type exist", candidate })
            }

            await Type.create({ name })

            return this.success(res)

        } catch (e) {
            this.error(res, e)
        }
    }

    removeType = async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return this.unsuccess(res,{ message: 'Type removing error', errors: errors })
            }

            const { type_id } = req.body

            const candidate = await Type.findOne({ where: { id: type_id }, attributes: ['id'] })
            if (!candidate) {
                return this.unsuccess(res,{ message: "Type not exist", candidate })
            }

            await Type.destroy({ where: { id: type_id } })

            return this.success(res)

        } catch (e) {
            this.error(res, e)
        }
    }
}

module.exports = new typeController()