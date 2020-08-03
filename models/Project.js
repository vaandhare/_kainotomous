
const { Schema, model } = require('mongoose')

const ProjectSchema = new Schema({
    
    pname:{
        type:String,
        required:true,
    },
    pdesc: {
        type: String,
        required: true,
    },
    author:{
        type:String,
        required:true
    },
    airport_code: {
        type: String,
        required: true,
    },
    attachment:[
        {
            filename:{type:String},
            fileaddr:{type:String}
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

const Project = model('project', ProjectSchema)

module.exports = Project