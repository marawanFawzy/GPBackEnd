const db = require('../util/database')

module.exports = class Diagnosis {
    constructor() {

    }
    save() {
    }
    update(id) {
    }
    static deleteById(id) {
        return db.execute('DELETE FROM patient_diagnosis WHERE diagnosis_id =?', [id])
    }
    static findAll() {
        return db.execute('SELECT * FROM patient_diagnosis')
    }
    static findOne(id) {
        return db.execute('SELECT * FROM patient_diagnosis WHERE diagnosis_id =?', [id])
    }
}