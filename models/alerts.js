const db = require('../util/database')

module.exports = class Alert {
    constructor() {

    }
    save() {
    }
    update(id) {
    }
    static deleteById(id) {
        return db.execute('DELETE FROM alerts WHERE alert_id =?', [id])
    }
    static findAll() {
        return db.execute('SELECT * FROM alerts')
    }
    static findOne(id) {
        return db.execute('SELECT * FROM alerts WHERE alert_id =?', [id])
    }
}