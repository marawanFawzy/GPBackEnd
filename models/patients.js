const db = require('../util/database')
const Diagnosis = require('./patient_diagnosis')

module.exports = class Patient {
    constructor() {

    }
    save() {
        //change
        return db.execute(`INSERT INTO users (first_name,last_name,national_id,
            specialization,gender,birth_date,email,hospital_id,
            address,is_researcher,is_doctor,
            is_observer,created_at) VALUES (?,?,?,?,?,CAST(? AS DATETIME) ,?,?,?,?,?,?,CURRENT_TIMESTAMP)` ,
            [this.first_name, this.last_name, this.national_id,
            this.specialization, this.gender, this.birth_date, this.email, this.hospital_id,
            this.address, this.is_researcher, this.is_doctor,
            this.is_observer])
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
