const db = require('../util/database')

module.exports = class Alert {
    constructor() {

    }
    static findAll() {
        return db.execute('SELECT governorate_name_en FROM eprediction.governorates')
    }
    static findOne(name) {
        return db.execute('SELECT id FROM eprediction.governorates WHERE governorate_name_en=?', [name])
    }
}