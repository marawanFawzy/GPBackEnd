const db = require('../util/database')

module.exports = class Alert {
    constructor() {

    }
    static findOne(name) {
        return db.execute('SELECT district FROM eprediction.egy_loc WHERE governorate=?;', [name])
    }
}