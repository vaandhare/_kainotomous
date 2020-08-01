const { Router } = require('express')
const License = require('../../models/License')

const router = Router()

router.get('/', async (req, res) => {
    try {
        const licenselist = await License.find()
        if (!licenselist) throw new Error('No Airports Found')
        
        res.status(200).json(licenselist)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
router.get('/:id', async (req, res) => {
    const { id } = req.params
    console.log(id);
    try {
        const license = await License.find({IATA_code:id})
        if (!license) throw new Error('No License Found')
        
        res.status(200).json(license)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// router.put('/:id', async (req, res) => {
//     const { id } = req.params
//     const status= req.body;

//     try {
//         const oldstatus = await Status.findOne({IATA_code:id})
//         oldstatus.status = status
//         const response = await Status.findByIdAndUpdate(oldstatus._id,status)
//         if (!response) throw Error('Something went wrong ')
//         const updated = { ...response._doc, ...req.body }
//         res.status(200).json(updated)
//     } catch (error) {
//         res.status(500).json({ message: error.message })
//     }
// })

router.post('/', async (req, res) => {
    const newLicense = new License(req.body)
    try {
        const license = await newLicense.save()
        if (!license) throw new Error('Something went wrong saving the User')
        res.status(200).json(license)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// router.delete('/:id', async (req, res) => {
//     const { id } = req.params
//     try {
//         const removed = await BucketListItem.findByIdAndDelete(id)
//         if (!removed) throw Error('Something went wrong ')
//         res.status(200).json(removed)
//     } catch (error) {
//         res.status(500).json({ message: error.message })
//     }
// })

module.exports = router