
const { Schema, model } = require('mongoose')

const AirportSchema = new Schema({
    airport_code: {
        type: String,
        required: true,
    },
    airport_name:{
        type:String,
        required:true,
    },
    city_name: {
        type: String,
        required: true,
    },
    lat:{
        type:String,
        required:true
    },
    long:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    operatorAddr:{
        type:String,
        required:false
    }
})

const Airport = model('airport', AirportSchema)

module.exports = Airport