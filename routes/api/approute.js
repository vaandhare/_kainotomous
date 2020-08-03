const { Router } = require('express')
const ApplicationForm = require('../../models/ApplicationForm')

const router = Router()

router.get('/', async (req, res) => {
    try {
        const app_data = await ApplicationForm.find()
        if (!app_data) throw new Error('No Application Data Found')
        
        res.status(200).json(app_data)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


router.get('/:id', async (req, res) => {
    const { id } = req.params
    console.log(id);
    try {
        const app_data = await ApplicationForm.find({appid:id})
        if (!app_data) throw new Error('No Application Data Found')
        
        res.status(200).json(app_data)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/', async (req, res) => {
    const newApplicationForm = new ApplicationForm(req.body)
    console.log(req.body)
    try {
        const app_data = await newApplicationForm.save()
        if (!app_data) throw new Error('Something went wrong saving the Application')
        res.status(200).json(app_data)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router