const { Router } = require('express')
const User = require('../../models/User')


const router = Router()

router.get('/', async (req, res) => {
    try {
        const userlist = await User.find()
        if (!userlist) throw new Error('No User Found')
        const sorted = userlist.sort((a, b) => {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        })
        res.status(200).json(sorted)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
router.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const user = await User.findOne({address:id})

        if (!user) throw new Error('No User Found')
        
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/login', async (req, res) => {
    const email = req.body.email;
    const addr = req.body.address;
    try {
        const user = await User.findOne({email:email,address:addr})
        if (user == null){
            console.log("Error Authenticating");
            res.send({message:"error"})
        }
        else{
            res.status(200).json(user)
        } 
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/register', async (req, res) => {
    const newUser = new User(req.body)
    try {
        
        const user = await newUser.save()
        if (!user) throw new Error('Something went wrong saving the User')
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.put('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const response = await User.findByIdAndUpdate(id, req.body)
        if (!response) throw Error('Something went wrong ')
        const updated = { ...response._doc, ...req.body }
        res.status(200).json(updated)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const removed = await User.findByIdAndDelete(id)
        if (!removed) throw Error('Something went wrong ')
        res.status(200).json(removed)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router