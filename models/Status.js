
const { Schema, model } = require('mongoose')

const StatusSchema = new Schema({
    airport_code: {
        type: String,
        required: true,
    },
    appId:{
        type:String,
        required:true
    },
    status: {
        type: String,
        required: true,
    }
})

const Status = model('status', StatusSchema)

module.exports = Status