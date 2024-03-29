const db = require('../util/database')

module.exports = class User {
    constructor(first_name = "", last_name = "", national_id = "",
        specialization = "", gender = "", birth_date = "", email = "", hospital = "",
        address = "", is_researcher = "", is_doctor = "",
        is_observer = "", Governorate = "", District = "") {
        this.first_name = first_name
        this.last_name = last_name
        this.national_id = national_id
        this.specialization = specialization
        this.gender = gender
        this.birth_date = birth_date
        this.email = email
        this.hospital = hospital
        this.address = address
        this.Governorate = Governorate
        this.District = District
        this.is_researcher = is_researcher
        this.is_doctor = is_doctor
        this.is_observer = is_observer
        this.created_at = Date.now()
    }
    save() {
        return db.execute(`INSERT INTO users (first_name,last_name,national_id,
                            specialization,gender,birth_date,email,hospital,District,Governorate,
                            address,is_researcher,is_doctor,
                            is_observer,created_at) VALUES (?,?,?,?,?,CAST(? AS DATETIME) ,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP)` ,
            [this.first_name, this.last_name, this.national_id,
            this.specialization, this.gender, this.birth_date, this.email, this.hospital, this.District, this.Governorate,
            this.address, this.is_researcher, this.is_doctor,
            this.is_observer])
    }
    update() {
        return db.execute(`UPDATE users SET 
            first_name =?,last_name=?,
            specialization=?,gender=?,
            email=?,hospital=?,District=?,Governorate=?,
            address=?,is_researcher=?,
            is_doctor=?,is_observer=? 
            WHERE national_id =? ` ,
            [this.first_name, this.last_name,
            this.specialization, this.gender, this.email, this.hospital, this.District, this.Governorate,
            this.address, this.is_researcher, this.is_doctor,
            this.is_observer, this.national_id])
    }
    updatePassword(password) {
        return db.execute(`UPDATE users SET pass=? WHERE email =? `,
            [password, this.email])
    }
    static deleteById(id) {
        return db.execute('DELETE FROM users WHERE national_id =?', [id])
    }
    static findAll() {
        return db.execute('SELECT * FROM users')
    }
    static findOne(email) {
        return db.execute('SELECT * FROM users WHERE email =?', [email])
    }
    static findOneByNiD(Nid) {
        return db.execute('SELECT * FROM users WHERE national_id =?', [Nid])
    }
    static findOneByiD(id) {
        return db.execute('SELECT * FROM users WHERE user_id =?', [parseInt(id)])
    }
}