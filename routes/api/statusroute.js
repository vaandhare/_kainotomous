const { Router } = require('express')
const Status = require('../../models/Status')

const router = Router()

router.get('/', async (req, res) => {
    try {
        
        const statuslist = await Status.find()
        
        if (!statuslist) throw new Error('No Airports Found')
        
        res.status(200).json(statuslist)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
router.get('/:id', async (req, res) => {
    const { id } = req.params
   
    try {
        const status = await Status.find({airport_code:id})
        if (!status) throw new Error('No Airport Found')
        
        res.status(200).json(status)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.put('/:id', async (req, res) => {
    const { id } = req.params
    const status= req.body;

    try {
        const oldstatus = await Status.findOne({airport_code:id})
        
        const response = await Status.findByIdAndUpdate(oldstatus._id,status)
        if (!response) throw Error('Something went wrong ')
        const updated = { ...response._doc, ...req.body }
        res.status(200).json(updated)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/', async (req, res) => {
    const newStatus = new Status(req.body)
    try {
        const status = await newStatus.save()
        if (!status) throw new Error('Something went wrong saving the User')
        res.status(200).json(status)
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