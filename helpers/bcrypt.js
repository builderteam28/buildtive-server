const bcrypt = require("bcryptjs")

function hash(password) {
    return bcrypt.hashSync(password, 10)
}
function compare(password, hash) {
    return bcrypt.compareSync(password, hash)
}

module.exports = {
    hash,
    compare
}