const authMiddleWare = require('../middlewares/authMiddleware')
const Router = require('express')
const cors = require('cors')
const router = new Router()
const userController = require('../controllers/userController')
const AuthService = require("../services/AuthService");
const { check } = require('express-validator')

router.use(cors())

router.post('/get_users', [], userController.getUsers)

router.post('/add_user', [
    authMiddleWare.authValidation,
    authMiddleWare.adminValidation,
    check('username', 'Username error').notEmpty(),
    check('password', 'Password error').notEmpty().isLength({min: 4, max: 10}),
    check('name', 'Name error').notEmpty(),
    check('surname', 'Surname error').notEmpty()
], userController.addUser)

router.post('/edit_user', [
    authMiddleWare.authValidation,
    authMiddleWare.adminValidation,
    check('id', 'Id error').notEmpty(),
    check('username', 'Username error').notEmpty(),
    check('name', 'Name error').notEmpty(),
    check('surname', 'Surname error').notEmpty()
], userController.editUser)

router.post('/remove_user', [
    authMiddleWare.authValidation,
    authMiddleWare.adminValidation,
    check('user_id', 'Id error').notEmpty()
], userController.removeUser)

module.exports = router