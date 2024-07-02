const authMiddleWare = require('../middlewares/authMiddleware')
const Router = require('express')
const cors = require('cors')
const router = new Router()
const fileController = require('../controllers/fileController')
const { check } = require('express-validator')

router.use(cors())

router.get('/get_file/:filename', [], fileController.getFile)

router.post('/get_files', [
    authMiddleWare.authValidation
], fileController.getFiles)

router.post('/get_report', [
    authMiddleWare.authValidation
], fileController.getReport)

router.post('/export', [
    authMiddleWare.authValidation
], fileController.export)

router.get('/download_report/:filename', [], fileController.downloadExportFile)

router.post('/determine_file', [
    authMiddleWare.authValidation,
    check('id', 'File id error').notEmpty()
], fileController.determineType)

module.exports = router