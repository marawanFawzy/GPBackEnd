const User = require('../models/users')
const Alert = require('../models/alerts')
const Patient = require('../models/patients')
const patient_diagnosis = require('../models/patient_diagnosis')
const governorates = require('../models/governorates')
const districts = require('../models/districts')
const path = require('path')
const fs = require('fs')
const { count } = require('console')

exports.userPages = (req, res, next) => {
    if (req.code === 401) {
        console.log("no access")
        res.status(req.code).json({
            code: req.code,
            success: false,

        })
    }
    else {
        User.findOne(req.email)
            .then(([result, meta]) => {
                if (result[0]) {
                    res.status(req.code).json({
                        code: req.code,
                        success: true,
                        researcher: result[0]['is_researcher'],
                        doctor: result[0]['is_doctor'],
                        observer: result[0]['is_observer'],
                    })
                }
                else
                    throw new Error()
            }).catch((err) => {
                res.status(404).json({
                    code: 404,
                    success: false,
                })
            })

    }
};
exports.addRecord = (req, res, next) => {
    if (req.code === 401) {
        console.log("no access")
        res.status(req.code).json({
            code: req.code,
            success: false,

        })
    }
    else {
        const data = req.body
        Patient.findOne(parseInt(req.body.Nid))
            .then(([userId, meta]) => {
                if (userId[0]) {
                    console.log(data)
                    const updatePatient = new Patient(data.Nid, data.Fname, data.Lname, data.gender, data.birth, data.address, data.occupation)
                    console.log(userId[0]['patient_id'])
                    updatePatient.update(userId[0]['patient_id'])
                        .then(([result, meta]) => {
                            console.log(result)
                            console.log("user id " + req.session.user_id)
                            res.status(200).json({
                                success: true,
                                code: 200
                            })
                        })
                        .catch((err) => {
                            console.log(err)
                            res.status(500).json({
                                success: true,
                                code: 500
                            })
                        })
                }
                else {
                    const addedPatient = new Patient(data.Nid, data.Fname, data.Lname, data.gender, data.birth, data.address, data.occupation)
                    addedPatient.save()
                        .then(([result, meta]) => {
                            console.log(result)
                            res.status(200).json({
                                success: true,
                                code: 200
                            })
                        })
                        .catch((err) => {
                            console.log(err)
                            res.status(500).json({
                                success: true,
                                code: 500
                            })
                        })
                }
                const diagnosis = new patient_diagnosis(data.diagnosis, data.notes, data.Irritability, data.ALTERD_CONSCIOUSNESS
                    , data.BULGING_FONTANEL, data.fever, data.SIEZURE, data.Headache, data.Vomiting, data.NECK_RIGIDITY,
                    data.Governorate, data.District, data.symp, req.session.user_id, userId[0]['patient_id'])
                diagnosis.save()
                    .then(([res, meta]) => { console.log(res) })
                    .catch((err) => console.log(err))
            })
            .catch((err) => {
                res.status(404).json({
                    code: 404,
                    success: false,
                })
            })
    }

}
exports.dynamicData = (req, res, next) => {
    //TODO: get the data to render the dashboards 
    if (req.code === 401) {
        console.log("no access")
        res.status(req.code).json({
            code: req.code,
            success: false,
        })
    }
    else {
        const year1 = parseInt(req.params.year1);
        const year2 = parseInt(req.params.year2);
        console.log(year1)
        console.log(year2)
        patient_diagnosis.getCountsPermonthsFor2Years(year1, year2)
            .then(([listOfMonths, meta]) => {
                if (listOfMonths[0]) {
                    const months = listOfMonths.map(dict => dict['count']);
                    const first12 = months.slice(0, 12);
                    const last12 = months.slice(12, 24);
                    patient_diagnosis.getCountsPerWeekFor2Years(year1, year2)
                        .then(([listOfWeeks, meta]) => {
                            if (listOfWeeks[0]) {
                                const weeks = listOfWeeks.map(dict => dict['count']);
                                const first52 = weeks.slice(0, 52);
                                const last52 = weeks.slice(52, 105);
                                res.status(200).json({
                                    success: true,
                                    code: 200,
                                    dateMonth: year1,
                                    dateMonth2: year2,
                                    dataMonth: first12,
                                    dataMonth2: last12,
                                    dateWeeks: year1,
                                    dateWeeks2: year2,
                                    dataWeeks: first52,
                                    dataWeeks2: last52
                                })
                            }
                            else throw new Error()
                        })
                        .catch((err) => {
                            console.log(err)
                            res.status(500).json({
                                code: 500,
                                success: false,

                            })
                        })
                }
                else {
                    throw new Error();
                }
            })
            .catch((err) => {
                console.log(err)
                res.status(500).json({
                    code: 500,
                    success: false,

                })
            })
    }
}
exports.staticData = (req, res, next) => {
    //TODO: get the data to render the dashboards 
    if (req.code === 401) {
        console.log("no access")
        res.status(req.code).json({
            code: req.code,
            success: false,
        })
    }
    else {
        patient_diagnosis.maleVSfemale()
            .then(([resultMF, meta]) => {
                if (!resultMF[0])
                    throw new Error()
                else if (req.code === 200) {
                    patient_diagnosis.numberOfCases()
                        .then(([result, meta]) => {
                            if (!result[0])
                                throw new Error()
                            else {

                                patient_diagnosis.ageRange()
                                    .then(([resultAGE, meta]) => {
                                        if (!resultAGE[0])
                                            throw new Error()
                                        else {
                                            res.status(req.code).json({
                                                success: true,
                                                code: req.code,
                                                gender: [resultMF[0]['MaleCount'], resultMF[0]['FemaleCount']],
                                                age: [resultAGE[0]['PatientCount'], resultAGE[1]['PatientCount'],
                                                resultAGE[2]['PatientCount'], resultAGE[3]['PatientCount'], resultAGE[4]['PatientCount']],
                                                numebrOfCases: result[0]['count(*)'],
                                            })
                                        }
                                    })
                                    .catch((err) => {
                                        res.status(404).json({
                                            success: false,
                                            code: 404
                                        })
                                    })

                            }
                        }
                        ).catch((err) => {
                            res.status(404).json({
                                success: false,
                                code: 404
                            })
                        })
                }
                else {
                    res.status(req.code).json({
                        success: false,
                        code: req.code
                    })
                }
            })
            .catch((err) => {
                res.status(404).json({
                    success: false,
                    code: 404
                })
            })
    }
}
exports.alerts = (req, res, next) => {
    Alert.findAll()
        .then(([alerts, meta]) => {
            if (req.code === 401) {
                console.log("no access")
                res.status(req.code).json({
                    code: req.code,
                    success: false,
                })
            }
            else {
                User.findOne(req.email)
                    .then(([result, meta]) => {
                        if (result[0]) {
                            res.status(req.code).json({
                                code: req.code,
                                success: true,
                                researcher: result[0]['is_researcher'],
                                doctor: result[0]['is_doctor'],
                                observer: result[0]['is_observer'],
                                alerts: alerts
                            })
                        }
                        else
                            throw new Error()
                    }).catch((err) => {
                        res.status(404).json({
                            code: 404,
                            success: false,
                        })
                    })

            }
        }).catch((err) => {
            console.log(err)
            res.status(500).json({
                code: 500,
                success: false,
            })
        });


}
exports.alert = (req, res, next) => {
    //WAIT:fetch single alert (discuss with pola)
    if (req.code === 401) {
        console.log("no access")
        res.status(req.code).json({
            code: req.code,
            success: false,

        })
    }
    else {
        console.log(req.params)
        console.log(req.session.user_id)
        Alert.markRead(req.session.user_id, req.params.id)
            .then(([read, meta]) => {
                console.log(read)
                res.status(200).json({
                    success: true,
                    code: 200
                })
            }).catch((err) => {
                console.log(err)
                res.status(500).json({
                    success: true,
                    code: 500
                })
            })

    }
}
exports.getGovernorates = (req, res, next) => {
    if (req.code === 401) {
        console.log("no access")
        res.status(req.code).json({
            code: req.code,
            success: false,

        })
    }
    else {
        governorates.findAll()
            .then(([result, meta]) => {
                if (result[0]) {
                    res.status(200).json({
                        success: true,
                        governorateOptions: result,
                        code: 200
                    })
                }
                else
                    throw new Error()
            })
            .catch((err) => {
                res.status(404).json({
                    code: 404,
                    success: false,
                })
            })
    }
}
exports.getDistricts = (req, res, next) => {
    if (req.code === 401) {
        console.log("no access")
        res.status(req.code).json({
            code: req.code,
            success: false,

        })
    }
    else {
        console.log(req.params)
        districts.findOne(req.params.Governorate)
            .then(([result, meta]) => {
                if (result[0]) {
                    res.status(200).json({
                        success: true,
                        districtOptions: result,
                        code: 200
                    })
                }
                else
                    throw new Error()
            })
            .catch((err) => {
                res.status(404).json({
                    code: 404,
                    success: false,
                })
            })
    }
}
