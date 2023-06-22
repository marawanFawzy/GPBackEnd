const db = require('../util/database')

module.exports = class Alert {
    constructor() {

    }
    markRead() {
        return db.execute('update alerts SET is_read=1 WHERE alert_id =?', [this.id])
    }
    static findAll() {
        return db.execute('SELECT * FROM alerts')
    }
    static findOne(id) {
        return db.execute('SELECT * FROM alerts WHERE alert_id =?', [id])
    }
}