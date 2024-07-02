const {Sequelize} = require('sequelize')
const Controller = require('../controllers/Controller')
require('dotenv').config()
const {validationResult} = require('express-validator')
const File = require("../models/File")
const Type = require("../models/Type")
const User = require("../models/User")
const Option = require("../models/Option")
const fileService = require("../services/FileService")
const WebSocketService = require("../services/WebSocketService")
const config = require("../config")
const date = require('date-and-time')
const { Op } = require('sequelize')
const XLSX = require('xlsx')
const path = require('path')
const fs = require('fs').promises
const libre = require('libreoffice-convert')
libre.convertAsync = require('util').promisify(libre.convert)

class fileController extends Controller {
    getFile = (req, res) => {
        if (!req.params.filename) {
            return this.unsuccess(res,{ message: 'File determining error1' })
        }

        return res.download(config.paths.files + req.params.filename)
    }

    getReport = async (req, res) => {
        try {
            const todayStart = new Date().setHours(0, 0, 0, 0);
            const count = {}

            // all files
            const allFiles = fileService.getFilesFromDir(config.paths.files)
            count.all_files = Array.isArray(allFiles) ? allFiles.length : 0

            // determined
            const filesDetermined = await File.findAll({where: {status: 3}})
            count.determined = filesDetermined.length

            // determined today
            const filesDeterminedToday = await File.findAll({where: {status: 3, date: {[Op.gt]: todayStart}}})
            count.determined_today = filesDeterminedToday.length

            // not determined
            const filesNotDetermined = await File.findAll({where: {status: [1, 2, 4]}})
            count.not_determined = filesNotDetermined.length

            // not determined today
            const filesNotDeterminedToday = await File.findAll({where: {status: [1, 2, 4], date: {[Op.gt]: todayStart}}})
            count.not_determined_today = filesNotDeterminedToday.length

            // canceled
            const filesCanceled = await File.findAll({where: {status: 4}})
            count.canceled = filesCanceled.length

            return this.success(res,{ report: count })

        } catch (e) {
            this.error(res, e)
        }
    }

    getFiles = async (req, res) => {
        try {
            if (!config.paths.files) throw new Error('Files path is empty')

            const { authUser } = req
            const { processed, filename, status } = req.body

            const fileNameWhereValue = !filename ? '%' : filename

            if (status !== undefined) {
                const filesByStatus = await File.findAll(
                {
                    attributes: ['id', 'filename', 'type_id', 'date', 'user_id',
                        [Sequelize.literal(`concat('${config.paths.filesDirUrl}', filename)`), 'url'],
                        [Sequelize.literal("concat(User.name, ' ', User.surname)"), 'user'],
                    ],
                    include: [
                        {
                            model: User,
                            required: false,
                            attributes: []
                        }
                    ],
                    where: {
                        status: status,
                        filename: {[Op.like]: fileNameWhereValue}
                    }
                })

                return this.success(res,{ files: filesByStatus })
            }

            const option = await Option.findOne({ where: { name: 'quota' }, attributes: ['value'] })
            const filesQuota = option ? option.value : process.env.FILES_QUOTA

            // get files with status 1 for today
            const todayStart = new Date().setHours(0, 0, 0, 0);
            const filesInWork = await File.findAll({
                where: {
                    date: {[Op.gt]: todayStart}
                }
            })

            if (!filesInWork.length) {
                // get unprocessed files from path
                let PDFFiles = fileService.getFilesFromDir(config.paths.files)
                if (!PDFFiles || !PDFFiles.length) throw new Error('No pdf files')

                let files = await File.findAll({
                    attributes: ['filename'],
                })

                files = files.map(file => file.filename)
                PDFFiles = PDFFiles.filter(PDFFilename => !files.includes(PDFFilename))
                PDFFiles = PDFFiles.slice(0, filesQuota)

                await File.bulkCreate(PDFFiles.map(PDFFilename => ({
                    filename: PDFFilename,
                    status: 1
                })))

                // let createdFilesFromDB = await File.findAll({
                //     attributes: ['id', 'filename', 'type_id', 'date', 'user_id',
                //         [Sequelize.literal(`concat('${config.paths.filesDirUrl}', filename)`), 'url'],
                //         [Sequelize.literal("concat(User.name, ' ', User.surname)"), 'user'],
                //     ],
                //     include: [
                //         {
                //             model: User,
                //             required: false,
                //             attributes: []
                //         }
                //     ],
                //     where: {
                //         type_id: null,
                //         user_id: authUser.id,
                //         filename: PDFFiles
                //     },
                //     order: [
                //         ['date', 'desc']
                //     ]
                // })
                //
                // return this.success(res,{ files: createdFilesFromDB })
            }

            // get user unprocessed files from DB
            let filesFromDB = await File.findAll({
                attributes: ['id', 'filename', 'type_id', 'date', 'user_id', 'status',
                    [Sequelize.literal(`concat('${config.paths.filesDirUrl}', filename)`), 'url'],
                    [Sequelize.literal("concat(User.name, ' ', User.surname)"), 'user'],
                ],
                include: [
                    {
                        model: User,
                        required: false,
                        attributes: []
                    }
                ],
                where: {
                    filename: {[Op.like]: fileNameWhereValue},
                    [Op.or]: [
                        {status: 4, user_id: {[Op.not]: authUser.id}},
                        {status: 2, user_id: authUser.id},
                        {status: 1},
                    ],
                },
                order: [
                    ['date', 'DESC']
                ],
                limit: 1
            })

            const plannedFileIds = filesFromDB
                .filter(file => +file.status === 1)
                .map(file => file.id)

            await File.update( { status: 2, user_id: authUser.id }, { where: { id: plannedFileIds } })

            return this.success(res,{ files: filesFromDB })

        } catch (e) {
            this.error(res, e)
        }
    }

    // getFileList = async (req, res) => {
    //     const errors = validationResult(req)
    //     if (!errors.isEmpty()) {
    //         return this.unsuccess(res,{ message: 'Files list error', errors: errors })
    //     }
    //
    //     const { id, type_id, status } = req.body
    //
    //     const filesCanceled = await File.findAll({where: {status: 4}})
    // }

    export  = async (req, res) => {
        try {
            let files = await File.findAll(
            {
                raw: true,
                attributes: ['id', 'filename', 'type_id', 'date', 'user_id', 'status',
                    [Sequelize.literal(`concat('${config.paths.filesDirUrl}', filename)`), 'url'],
                    [Sequelize.literal("concat(User.name, ' ', User.surname)"), 'user'],
                    [Sequelize.literal("concat(Type.name)"), 'type'],
                ],
                include: [
                    {
                        model: User,
                        required: false,
                        attributes: []
                    },
                    {
                        model: Type,
                        required: false,
                        attributes: []
                    },
                ],
                where: {}
            })

            const filesFormatted = files.map(file => {
                const fileFormatted = {
                    id: file.id,
                    filename: file.filename,
                    status: file.status,
                    type: file.type,
                    user: file.user,
                    date: file.date,
                    // url: file.url
                }

                if (file.status === 1) {
                    fileFormatted.status = 'Planeado'
                } else if (file.status === 2) {
                    fileFormatted.status = 'Planeado'
                } else if (file.status === 3) {
                    fileFormatted.status = 'Determinado'
                } else if (file.status === 4) {
                    fileFormatted.status = 'Descartado'
                }

                return fileFormatted
            })

            console.log('fileFormatted', filesFormatted)

            const workSheet = XLSX.utils.json_to_sheet(filesFormatted)
            const workBook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet 1")

            const fileName = 'report-' + Date.now()
            const xlsxFilePath = process.env.FILES_PATH + fileName + '.xlsx'

            XLSX.writeFile(workBook, xlsxFilePath)

            const csvFilePath = process.env.FILES_PATH + fileName + '.csv'
            const csv = XLSX.utils.sheet_to_csv(workSheet)
            await fs.writeFile(csvFilePath, csv)

            const pdfFilePath = process.env.FILES_PATH + fileName + '.pdf'

            const xlsxBuf = await fs.readFile(xlsxFilePath)
            const pdfBuf = await libre.convertAsync(xlsxBuf, 'pdf', undefined)
            await fs.writeFile(pdfFilePath, pdfBuf)

            return this.success(res,{
                excel: process.env.SITE_URL + '/file/download_report/' + fileName + '.csv',
                pdf: process.env.SITE_URL + '/file/download_report/' + fileName + '.pdf',
            })

        } catch (e) {
            this.error(res, e)
        }
    }

    downloadExportFile = async (req, res) => {
        const { filename } = req.params
        if (!filename) {
            return this.unsuccess(res, {message: 'File is empty'})
        }

        res.download(process.env.FILES_PATH + filename)
    }

    determineType = async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return this.unsuccess(res,{ message: 'File determining error', errors: errors })
            }

            const { id, type_id, canceled } = req.body
            const { authUser } = req

            const updateValues = {
                user_id: authUser.id,
                date: Sequelize.fn('NOW')
            }

            if (!canceled && !!type_id) {
                const DBType = await Type.findOne({ where: { id: +type_id }, attributes: ['id', 'name'] })
                if (!DBType) return this.unsuccess(res,{ message: "Type not exist" })

                updateValues.type_id = type_id
                updateValues.status = 3

            } else {
                updateValues.status = 4
            }


            let DBFile = await File.findOne({ where: { id } })
            if (!DBFile) return this.unsuccess(res,{ message: 'File determining error', errors: errors })

            await File.update( updateValues, { where: { id: DBFile.id } })

            let DBFileWithUser = await File.findOne({
                attributes: ['id', 'filename', 'type_id', 'date', 'user_id',
                    [Sequelize.literal(`concat('${config.paths.filesDirUrl}', filename)`), 'url'],
                    [Sequelize.literal("concat(User.name, ' ', User.surname)"), 'user'],
                ],
                include: [
                    {
                        model: User,
                        required: false,
                        attributes: []
                    }
                ],
                where: {
                    id: DBFile.id,
                    user_id: authUser.id
                }
            })


            const wss = new WebSocketService()
            wss.init()
            wss.sendOnOpenAndClose(DBFileWithUser)

            return this.success(res)

        } catch (e) {
            this.error(res, e)
        }
    }

}

module.exports = new fileController()