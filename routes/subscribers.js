const express = require('express')
const router = express.Router()
const Subscriber = require('../models/subscribers')

//getting all
router.get('/', async (req, res) => {
    try{
    	const subscribers = await Subscriber.find()
        res.json(subscribers)
    } catch(error){
        res.status(500).json({message: err.message})

    }
})

router.get('/:id', getSubscriber, (req,res) =>{
    res.send(res.subscriberData)
})

router.post('/', async (req, res) => {
    const subscribers = new Subscriber({
        name: req.body.name,
        subscriberToChannel: req.body.subscriberToChannel
    })

    try{
        const newSubscribers = await subscribers.save()
        res.status(201).json(newSubscribers)
    }catch(error){
        //400 error maybe from client (users input) and from server
        res.status(400).json({message: error.message})
    }
})

router.patch('/:id', getSubscriber, async (req, res) => {
    if(req.body.name != null){
        res.subscriberData.name = req.body.name
    }
    if(req.body.subscriberToChannel != null){
        res.subscriberData.subscriberToChannel = req.body.subscriberToChannel
    }

    try{
        
        const update = await res.subscriberData.save()
        res.json(update)
    }catch(error){
        res.status(400).json({message: error.message})
    }
})

router.delete('/:id', getSubscriber, async(req, res) => {
    try{
        if (!res.subscriberData) {
            return res.status(404).json({ message: 'Subscriber not found' });
        }

        // await res.subscriberData.remove();
        await Subscriber.deleteOne({ _id: res.subscriberData._id });
        res.json({ message: 'Deleted successfully' });
        
    }catch(error){
        return res.status(500).json({message: error.message})
    }
})

async function getSubscriber(req, res, next){
    let subscribers
    try{
        subscribers = await Subscriber.findById(req.params.id)
        if(subscribers == null){
            return res.status(404).json({message: 'cannot found '})
        }

    }catch(error){
        return res.status(500).json({message : error.message})
    }
    res.subscriberData = subscribers
    console.log('Subscriber data:', subscribers); // Add this line for debugging
    next() //melanjutkan ke bagian dari middleware berikutnya atau permintaan itu sendiri
}

module.exports = router