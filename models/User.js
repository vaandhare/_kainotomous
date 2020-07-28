
const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
    fullname: {
        type: String,
        required: true,
    },
    email:{
        type:String,
        required:true,
        index:true,
    },
    address: {
        type: String,
        required: true,
    },
    isapproved:{
        type:Boolean,
        default:true
    },
    role:{
        type:String,
        required:true,
    },
    department:{
        type:String,
        require:true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const User = model('user', UserSchema)

module.exports = User