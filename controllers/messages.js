const messagesRouter = require('express').Router()
const Message = require('../models/message')
// const User = require('../models/user')
// const jwt = require('jsonwebtoken')
// const getTokenFrom = require('../utils/getTokenFrom')

messagesRouter.post('/', async (request, response) => {
    const body = request.body

    const message = new Message({
        sender: body.sender,
        recipient: body.recipient,
        body: body.body,
        createdAt: new Date(),
    })
    const savedMessage = await message.save()
    // user.messages = User.messages.concat(savedMessage)
    // await user.save()
    response.json(savedMessage)
})

messagesRouter.get('/', async (request, response) => {
    const messages = await Message.find({})
    response.json(messages)
})


module.exports = messagesRouter