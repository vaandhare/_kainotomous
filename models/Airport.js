
const { Schema, model } = require('mongoose')

const AirportSchema = new Schema({
    IATA_code: {
        type: String,
        required: true,
    },
    ICAO_code:{
        type:String,
        required:true,
    },
    airport_name: {
        type: String,
        required: true,
    },
    city_name:{
        type:String,
        required:true
    }
})

const Airport = model('airport', AirportSchema)

module.exports = Airport