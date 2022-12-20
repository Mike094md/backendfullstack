const propertiesRouter = require('express').Router()
const Property = require('../models/property')
const User = require('../models/user')
const getTokenFrom = require('../utils/getTokenFrom')
const jwt = require('jsonwebtoken')

propertiesRouter.get('/', async (request, response) => {
  const properties = await Property.find({}).populate('user', { username: 1, name: 1, email: 1 })
  response.json(properties)
})

propertiesRouter.get('/:id', async (request, response) => {
  const property = await Property.findById(request.params.id)
  if (property){
    response.json(property)
  }else{
    response.status(404).end()
  }
})

propertiesRouter.post('/', async (request, response) => {
  const body = request.body
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)

  const property = new Property({
    type: body.type,
    operation: body.operation,
    address: body.location,
    floor: body.floor,
    door: body.door,
    price: body.price,
    features: body.features,
    images: body.images,
    description: body.description,
    date: new Date(),
    user: user._id

  })

  const savedProperty = await property.save()
  user.properties = user.properties.concat(property)
  await user.save()
  response.json(savedProperty)

})


module.exports = propertiesRouter

