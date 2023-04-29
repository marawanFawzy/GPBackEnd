const db = require('../util/database')
const Diagnosis = require('./patient_diagnosis')

module.exports = class Patient {
    constructor() {

    }
    save() {
    }
    update(id) {
    }
    static deleteById(id) {
        return db.execute('DELETE FROM patients WHERE patient_id =?', [id])
    }
    static findAll() {
        return db.execute('SELECT * FROM patients')
    }
    static findOne(id) {
        return db.execute('SELECT * FROM patients WHERE patient_id =?', [id])
    }
}
