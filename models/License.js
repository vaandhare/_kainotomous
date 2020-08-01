
const { Schema, model } = require('mongoose')

const LicenseSchema = new Schema({
    IATA_code: {
        type: String,
        required: true,
    },
    license_number: {
        type: String,
        required: true,
    },
    from:{
        type:Date,
        required:true
    },
    to:{
        type:Date,
        required:true
    }
})

const License = model('license', LicenseSchema)

module.exports = License