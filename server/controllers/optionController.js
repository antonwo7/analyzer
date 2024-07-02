const Controller = require('../controllers/Controller')
require('dotenv').config()
const {validationResult} = require('express-validator')
const Option = require("../models/Option")


class optionController extends Controller {
    getTypes = async (req, res) => {
        try {
            const options = await Option.findAll({ raw: true })
            return this.success(res,{ options: options })

        } catch (e) {
            this.error(res, e)
        }
    }

    changeOption = async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return this.unsuccess(res,{ message: 'Option changing error', errors: errors })
            }

            const { id, value } = req.body
            const candidate = await Option.findOne({ where: { id }, attributes: ['id', 'name'] })
            if (!candidate) {
                return this.unsuccess(res,{ message: "Option not exist", candidate })
            }

            await Option.update({value}, { where: { id: id } })

            return this.success(res)

        } catch (e) {
            this.error(res, e)
        }
    }
}

module.exports = new optionController()