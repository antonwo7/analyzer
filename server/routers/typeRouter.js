const authMiddleWare = require('../middlewares/authMiddleware')
const Router = require('express')
const cors = require('cors')
const router = new Router()
const typeController = require('../controllers/typeController')
const { check } = require('express-validator')

router.use(cors())

router.post('/get_types', [], typeController.getTypes)

router.post('/add_type', [
    authMiddleWare.authValidation,
    authMiddleWare.adminValidation,
    check('name', 'Name error').notEmpty()
], typeController.addType)

router.post('/remove_type', [
    authMiddleWare.authValidation,
    authMiddleWare.adminValidation,
    check('type_id', 'Id error').notEmpty()
], typeController.removeType)

module.exports = router