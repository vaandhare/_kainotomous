const { Router } = require('express')
const Project = require('../../models/Project')

const router = Router()

router.get('/', async (req, res) => {
    try {
        const projects = await Project.find()
        if (!projects) throw new Error('No Project Found')
        const sorted = projects.sort((a, b) => {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        })
        res.status(200).json(sorted)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
router.get('/:id', async (req, res) => {
    const { id } = req.params
    console.log(id);
    try {
        const project = await Project.find({airport_code:id})
        if (!project) throw new Error('No Project Found')
        
        res.status(200).json(project)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/search', async (req, res) => {
    const q = req.query
    console.log("Query",req.query.q);
    try {
        console.log("Query",q);
        const project = await Project.find(
                { pname : {
                    $regex:q,
                    $options:"i"
                }},{ pdesc : {
                    $regex:q,
                    $options:"i"
                }})
        if (!airport) throw new Error('No Airport Found')
        
        res.status(200).json(airport)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.put('/:id', async (req, res) => {
    const { id } = req.params
    
    try {
        
        const updated = await Project.findByIdAndUpdate(id,req.body)
        if (!updated) throw new Error('No  Found')
        
        res.status(200).json(updated)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/', async (req, res) => {
    const newProject = new Project(req.body)
    console.log("Request Body",req.body)
    try {
        const project = await newProject.save()
        if (!project) throw new Error('Something went wrong saving the User')
        res.status(200).json(project)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const removed = await Project.findByIdAndDelete(id)
        if (!removed) throw Error('Something went wrong ')
        res.status(200).json(removed)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router