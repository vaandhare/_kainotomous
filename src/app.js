const express = require('express');
const app = express()
const mongoose = require('mongoose');
const {PORT,mongoUri} = require('../config')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const userRouter = require('../routes/api/userroute')
const airportRouter = require('../routes/api/airportroute')
const statusRouter = require('../routes/api/statusroute')
const licenseRouter = require('../routes/api/licenseroute')

const projectRouter = require('../routes/api/projectroute')

const appRouter = require('../routes/api/approute')



app.use(cors())
app.use(morgan('tiny'))
app.use(bodyParser.json())


mongoose
    .connect(mongoUri,{
        useNewUrlParser:true,
        useCreateIndex:true,
        useUnifiedTopology:true,
        useFindAndModify:false
    })
    .then(()=>console.log('MongoDb Database Connected...'))
    .catch((err)=> console.log(err))

app.use('/api/Users',userRouter)
app.use('/api/airports',airportRouter)
app.use('/api/status',statusRouter)
app.use('/api/licensetable',licenseRouter)

app.use('/api/projects',projectRouter)

app.use('/api/appform',appRouter)

if (process.env.NODE_ENV === 'production') { 
    app.use(express.static('client/build'))
}

app.listen(PORT,()=>{console.log(`App listening to at http://localhost:${PORT}`)})