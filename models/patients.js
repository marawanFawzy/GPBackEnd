const db = require('../util/database')

module.exports = class Patient {
    constructor(Nid, first_name, last_name, gender, birth_date, address, occupation) {
        console.log("here")
        this.Nid = Nid
        this.first_name = first_name
        this.last_name = last_name
        this.gender = gender
        this.birth_date = birth_date
        this.address = address
        this.occupation = occupation
    }
    save() {
        return db.execute(`INSERT INTO patients (national_id,first_name,last_name,
            gender,date_of_birth,address,occupation,created_at,
            updated_at) VALUES (?,?,?,?,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)` ,
            [this.Nid, this.first_name, this.last_name,
            this.gender, this.birth_date, this.address, this.occupation])
    }
    update(id) {
        return db.execute(`UPDATE patients
        SET address = ?, occupation = ?, updated_at=CURRENT_TIMESTAMP 
        WHERE patient_id=?;` ,
            [this.address, this.occupation, id])
    }
    static deleteById(id) {
        return db.execute('DELETE FROM patients WHERE patient_id =?', [id])
    }
    static findAll() {
        return db.execute('SELECT * FROM patients')
    }
    static findOne(Nid) {
        return db.execute('SELECT patient_id FROM patients WHERE national_id =?', [Nid])
    }
}
