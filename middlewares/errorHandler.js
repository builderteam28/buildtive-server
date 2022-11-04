const errorHandler = (err, req, res, next) => {
    let code = 500
    let error = "Internal Server Error"
    if(err.name == "SequelizeValidationError" || err.name == "SequelizeUniqueConstraintError") {
        code = 400
        error = err.errors[0].message
    } else if (err.name == "Invalid email/password") {
        code = 401
        error = err.name
    }
    console.log(err.name)

    res.status(code).json({message: error})
}

module.exports = errorHandler