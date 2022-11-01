const errorHandler = (err, req, res, next) => {
    let code = 500
    let error = "Internal Server Error"



    res.status(code).json({error})
}

module.exports = errorHandler