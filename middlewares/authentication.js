const { verify } = require("../helpers/jwt")
const { User } = require("../models")

const authentication = async (req, res, next) => {
    try {
        const { access_token } = req.headers
        if(!access_token) throw {name : "Invalid Token"}
        const payload = verify(access_token)
        const user = await User.findByPk(payload.id)
        if(!user) throw {name : "Invalid Token"}
        req.user = {
            id: user.id,
            email : user.email
        }
        next()
    } catch (error) {
        console.log(error)
        next(error)
    }
}

module.exports = authentication