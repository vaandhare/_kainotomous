
const { Schema, model } = require('mongoose')

const ApplicationSchema = new Schema({
    formid: {
        type: String,
        required: true,
    },
    appid: {
        type: String,
        required: true,

    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    telephone: {
        type: String,
        required: true,
    },
    nationality: {
        type: String,
        required: true,
    },
    aerodrome_name: {
        type: String,
        required: true,
    },
    aerodrome_owner: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    is_enclosed: {
        type: Boolean,
        required: true,
    },
    enclosing_details: {
        type:String,
        required: false,
    },
    category: {
        type: String,
        required: true,
    },
    isAllWeather: {
        type: Boolean,
        required: true,
    },
    weatherDetails: {
        type: String,
        required: false,
    },
})

const ApplicationForm = model('applicationForm', ApplicationSchema)

module.exports = ApplicationForm