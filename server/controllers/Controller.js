class Controller {
    error = (res, e) => {
        !(e instanceof Error) && (e = new Error(e))
        res.status(200).json({ result: false, message: e.message })
    }

    success = (res, value) => {
        res.status(200).json({ result: true, ...value })
    }

    unsuccess = (res, value) => {
        res.status(200).json({ result: false, ...value })
    }
}

module.exports = Controller