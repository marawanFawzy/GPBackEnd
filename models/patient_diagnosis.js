const db = require('../util/database')

module.exports = class Diagnosis {
    constructor() {

    }
    save() {
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
        return db.execute('DELETE FROM patient_diagnosis WHERE diagnosis_id =?', [id])
    }
    static findAll() {
        return db.execute('SELECT * FROM patient_diagnosis')
    }
    static findOne(id) {
        return db.execute('SELECT * FROM patient_diagnosis WHERE diagnosis_id =?', [id])
    }
    static numberOfCases() {
        return db.execute('Select count(*) from patient_diagnosis')
    }
    static maleVSfemale() {
        return db.execute(`SELECT
        COUNT(CASE WHEN p.gender = 'male' THEN 1 END) AS MaleCount,
        COUNT(CASE WHEN p.gender = 'female' THEN 1 END) AS FemaleCount
        FROM patient_diagnosis pd
        JOIN patients p ON pd.patient_id = p.patient_id;`)
    }
    static ageRange() {
        return db.execute(`
        SELECT 
        age_ranges.AgeRange,
        COALESCE(COUNT(pd.patient_id), 0) AS PatientCount
        FROM (
        SELECT 'Under 5' AS AgeRange, 0 AS AgeGroupMin, 5 AS AgeGroupMax
        UNION SELECT '6-15' AS AgeRange, 6 AS AgeGroupMin, 15 AS AgeGroupMax
        UNION SELECT '15-24' AS AgeRange, 16 AS AgeGroupMin, 24 AS AgeGroupMax
        UNION SELECT '25-64' AS AgeRange, 25 AS AgeGroupMin, 64 AS AgeGroupMax
        UNION SELECT '64 and over' AS AgeRange, 65 AS AgeGroupMin, 200 AS AgeGroupMax
        ) age_ranges
        LEFT JOIN patients p ON TIMESTAMPDIFF(YEAR, p.date_of_birth, CURDATE()) BETWEEN age_ranges.AgeGroupMin AND age_ranges.AgeGroupMax
        LEFT JOIN patient_diagnosis pd ON pd.patient_id = p.patient_id
        GROUP BY age_ranges.AgeRange;`
        )
    }
}