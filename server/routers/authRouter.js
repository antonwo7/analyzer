const Router = require('express')
const cors = require('cors')
const router = new Router()
const authController = require('../controllers/authController')
const {check} = require('express-validator')

router.use(cors())

router.post('/registration', [
    check('username', 'Username error').notEmpty(),
    check('password', 'Password error').notEmpty().isLength({min: 4, max: 10}),
    check('name', 'Name error').notEmpty().isLength({min: 4, max: 200}),
    check('surname', 'Surname error').notEmpty().isLength({min: 4, max: 200})
], authController.registration)
router.post('/login', [
    check('username', 'Username error').notEmpty(),
    check('password', 'Password error').notEmpty().isLength({min: 4, max: 10}),
], authController.login)
router.post('/validation', [
    check('token', 'Token error').notEmpty()
], authController.validation)

module.exports = router