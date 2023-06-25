const db = require('../util/database')

module.exports = class Diagnosis {
    constructor(diagnosis, notes, Irritability, ALTERD_CONSCIOUSNESS
        , BULGING_FONTANEL, fever, SIEZURE, Headache, Vomiting, NECK_RIGIDITY,
        Governorate, District, symp, doctorID, patient_id) {
        this.diagnosis = diagnosis
        this.notes = notes
        this.Irritability = Irritability
        this.ALTERD_CONSCIOUSNESS = ALTERD_CONSCIOUSNESS
        this.BULGING_FONTANEL = BULGING_FONTANEL
        this.SIEZURE = SIEZURE
        this.Headache = Headache
        this.Vomiting = Vomiting
        this.NECK_RIGIDITY = NECK_RIGIDITY
        this.fever = fever
        this.Governorate = Governorate
        this.District = District
        this.symp = symp
        this.doctorID = doctorID
        this.patient_id = patient_id
    }
    save() {
        return db.execute(`INSERT INTO patient_diagnosis (patient_id,report_date,district,
            governorate,diagnosis,doctor_id,notes,
            sym_days,fever,vomiting,headache,siezure,Bulging_Fontanel,Alterd_Consciousness,Neck_Rigidity,
            Irritability,created_at) VALUES (?,CURRENT_TIMESTAMP,?,?,?,?,?,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP)` ,
            [this.patient_id, this.District,
            this.Governorate, this.diagnosis, this.doctorID, this.notes, this.symp,
            this.fever, this.Vomiting, this.Headache, this.SIEZURE, this.BULGING_FONTANEL, this.ALTERD_CONSCIOUSNESS, this.NECK_RIGIDITY,
            this.Irritability])
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