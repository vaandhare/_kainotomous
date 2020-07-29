const { Router } = require('express')
const Airport = require('../../models/Airport')

const router = Router()

router.get('/', async (req, res) => {
    try {
        const airports = await Airport.find()
        if (!airports) throw new Error('No Airports Found')
        
        res.status(200).json(airports)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
router.get('/:id', async (req, res) => {
    const { id } = req.params
    console.log(id);
    try {
        const airport = await Airport.find({IATA_code:id})
        if (!airport) throw new Error('No Airport Found')
        
        res.status(200).json(airport)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// router.put('/:id', async (req, res) => {
//     const { id } = req.params

//     try {
//         const response = await BucketListItem.findByIdAndUpdate(id, req.body)
//         if (!response) throw Error('Something went wrong ')
//         const updated = { ...response._doc, ...req.body }
//         res.status(200).json(updated)
//     } catch (error) {
//         res.status(500).json({ message: error.message })
//     }
// })

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