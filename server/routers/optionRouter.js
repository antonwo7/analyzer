const authMiddleWare = require('../middlewares/authMiddleware')
const Router = require('express')
const cors = require('cors')
const router = new Router()
const optionController = require('../controllers/optionController')
const { check } = require('express-validator')

router.use(cors())

router.post('/get_options', [
    authMiddleWare.authValidation,
    authMiddleWare.adminValidation,
], optionController.getTypes)

router.post('/change_option', [
    authMiddleWare.authValidation,
    authMiddleWare.adminValidation,
    check('id', 'Id error').notEmpty(),
    check('value', 'Value error').notEmpty(),
], optionController.changeOption)

module.exports = router