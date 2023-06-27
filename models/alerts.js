const db = require('../util/database')

module.exports = class Alert {
    constructor() {

    }
    static markRead(user_id, id) {
        return db.execute('update alerts SET is_read=1 , viewer_id=? WHERE alert_id =?', [user_id, id])
    }
    static findAll() {
        return db.execute('SELECT * FROM eprediction.alerts order by alert_id desc;')
    }
    static findOne(id) {
        return db.execute('SELECT * FROM alerts WHERE alert_id =?', [id])
    }
}