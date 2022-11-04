const errorHandler = (err, req, res, next) => {
    let code = 500
    let error = "Internal Server Error"
    if(err.name == "SequelizeValidationError" || err.name == "SequelizeUniqueConstraintError") {
        code = 400
        error = err.errors[0].message
    }
    console.log(err.errors[0].message)

    res.status(code).json({message: error})
}

module.exports = errorHandler