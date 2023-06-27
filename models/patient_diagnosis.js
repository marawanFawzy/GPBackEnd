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
    static getCountsPermonthsFor2Years(year1, year2) {
        return db.execute(`
        SELECT months.year, months.month, COUNT(patient_diagnosis.created_at) AS count
        FROM (
            SELECT `+ year1 + ` AS year, 1 AS month
            UNION SELECT `+ year1 + `, 2
            UNION SELECT `+ year1 + `, 3
            UNION SELECT `+ year1 + `, 4
            UNION SELECT `+ year1 + `, 5
            UNION SELECT `+ year1 + `, 6
            UNION SELECT `+ year1 + `, 7
            UNION SELECT `+ year1 + `, 8
            UNION SELECT `+ year1 + `, 9
            UNION SELECT `+ year1 + `, 10
            UNION SELECT `+ year1 + `, 11
            UNION SELECT `+ year1 + `, 12
            UNION SELECT `+ year2 + `, 1
            UNION SELECT `+ year2 + `, 2
            UNION SELECT `+ year2 + `, 3
            UNION SELECT `+ year2 + `, 4
            UNION SELECT `+ year2 + `, 5
            UNION SELECT `+ year2 + `, 6
            UNION SELECT `+ year2 + `, 7
            UNION SELECT `+ year2 + `, 8
            UNION SELECT `+ year2 + `, 9
            UNION SELECT `+ year2 + `, 10
            UNION SELECT `+ year2 + `, 11
            UNION SELECT `+ year2 + `, 12
        ) AS months
        LEFT JOIN patient_diagnosis ON YEAR(patient_diagnosis.created_at) = months.year AND MONTH(patient_diagnosis.created_at) = months.month
        WHERE months.year IN (`+ year1 + `, ` + year2 + `)
        GROUP BY months.year, months.month
        ORDER BY months.year, months.month;
        `)
    }
    static getCountsPerWeekFor2Years(year1, year2) {
        return db.execute(`
        SELECT weeks.year, weeks.week, COUNT(patient_diagnosis.created_at) AS count
        FROM (
            SELECT `+ year1 + ` AS year, 1 AS week
            UNION SELECT `+ year1 + `, 2
            UNION SELECT `+ year1 + `, 3
            UNION SELECT `+ year1 + `, 4
            UNION SELECT `+ year1 + `, 5
            UNION SELECT `+ year1 + `, 6
            UNION SELECT `+ year1 + `, 7
            UNION SELECT `+ year1 + `, 8
            UNION SELECT `+ year1 + `, 9
            UNION SELECT `+ year1 + `, 10
            UNION SELECT `+ year1 + `, 11
            UNION SELECT `+ year1 + `, 12
            UNION SELECT `+ year1 + `, 13
            UNION SELECT `+ year1 + `, 14
            UNION SELECT `+ year1 + `, 15
            UNION SELECT `+ year1 + `, 16
            UNION SELECT `+ year1 + `, 17
            UNION SELECT `+ year1 + `, 18
            UNION SELECT `+ year1 + `, 19
            UNION SELECT `+ year1 + `, 20
            UNION SELECT `+ year1 + `, 21
            UNION SELECT `+ year1 + `, 22
            UNION SELECT `+ year1 + `, 23
            UNION SELECT `+ year1 + `, 24
            UNION SELECT `+ year1 + `, 25
            UNION SELECT `+ year1 + `, 26
            UNION SELECT `+ year1 + `, 27
            UNION SELECT `+ year1 + `, 28
            UNION SELECT `+ year1 + `, 29
            UNION SELECT `+ year1 + `, 30
            UNION SELECT `+ year1 + `, 31
            UNION SELECT `+ year1 + `, 32
            UNION SELECT `+ year1 + `, 33
            UNION SELECT `+ year1 + `, 34
            UNION SELECT `+ year1 + `, 35
            UNION SELECT `+ year1 + `, 36
            UNION SELECT `+ year1 + `, 37
            UNION SELECT `+ year1 + `, 38
            UNION SELECT `+ year1 + `, 39
            UNION SELECT `+ year1 + `, 40
            UNION SELECT `+ year1 + `, 41
            UNION SELECT `+ year1 + `, 42
            UNION SELECT `+ year1 + `, 43
            UNION SELECT `+ year1 + `, 44
            UNION SELECT `+ year1 + `, 45
            UNION SELECT `+ year1 + `, 46
            UNION SELECT `+ year1 + `, 47
            UNION SELECT `+ year1 + `, 48
            UNION SELECT `+ year1 + `, 49
            UNION SELECT `+ year1 + `, 50
            UNION SELECT `+ year1 + `, 51
            UNION SELECT `+ year1 + `, 52
            UNION SELECT `+ year2 + `, 1
            UNION SELECT `+ year2 + `, 2
            UNION SELECT `+ year2 + `, 3
            UNION SELECT `+ year2 + `, 4
            UNION SELECT `+ year2 + `, 5
            UNION SELECT `+ year2 + `, 6
            UNION SELECT `+ year2 + `, 7
            UNION SELECT `+ year2 + `, 8
            UNION SELECT `+ year2 + `, 9
            UNION SELECT `+ year2 + `, 10
            UNION SELECT `+ year2 + `, 11
            UNION SELECT `+ year2 + `, 12
            UNION SELECT `+ year2 + `, 13
            UNION SELECT `+ year2 + `, 14
            UNION SELECT `+ year2 + `, 15
            UNION SELECT `+ year2 + `, 16
            UNION SELECT `+ year2 + `, 17
            UNION SELECT `+ year2 + `, 18
            UNION SELECT `+ year2 + `, 19
            UNION SELECT `+ year2 + `, 20
            UNION SELECT `+ year2 + `, 21
            UNION SELECT `+ year2 + `, 22
            UNION SELECT `+ year2 + `, 23
            UNION SELECT `+ year2 + `, 24
            UNION SELECT `+ year2 + `, 25
            UNION SELECT `+ year2 + `, 26
            UNION SELECT `+ year2 + `, 27
            UNION SELECT `+ year2 + `, 28
            UNION SELECT `+ year2 + `, 29
            UNION SELECT `+ year2 + `, 30
            UNION SELECT `+ year2 + `, 31
            UNION SELECT `+ year2 + `, 32
            UNION SELECT `+ year2 + `, 33
            UNION SELECT `+ year2 + `, 34
            UNION SELECT `+ year2 + `, 35
            UNION SELECT `+ year2 + `, 36
            UNION SELECT `+ year2 + `, 37
            UNION SELECT `+ year2 + `, 38
            UNION SELECT `+ year2 + `, 39
            UNION SELECT `+ year2 + `, 40
            UNION SELECT `+ year2 + `, 41
            UNION SELECT `+ year2 + `, 42
            UNION SELECT `+ year2 + `, 43
            UNION SELECT `+ year2 + `, 44
            UNION SELECT `+ year2 + `, 45
            UNION SELECT `+ year2 + `, 46
            UNION SELECT `+ year2 + `, 47
            UNION SELECT `+ year2 + `, 48
            UNION SELECT `+ year2 + `, 49
            UNION SELECT `+ year2 + `, 50
            UNION SELECT `+ year2 + `, 51
            UNION SELECT `+ year2 + `, 52
        ) AS weeks
        LEFT JOIN patient_diagnosis ON YEAR(patient_diagnosis.created_at) = weeks.year AND WEEK(patient_diagnosis.created_at) = weeks.week
        WHERE weeks.year IN (`+ year1 + `, ` + year2 + `)
        GROUP BY weeks.year, weeks.week
        ORDER BY weeks.year, weeks.week;
        `)
    }
}