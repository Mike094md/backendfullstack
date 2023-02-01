const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const getTokenFrom = require('../utils/getTokenFrom')
const multer = require('multer')
const path_images = `${process.env.BASE_PATH}:${process.env.PORT}/public/images/`
const Property = require('../models/property')
//localhost:3001/public/images/1625580000000-IMG_20210703_162558.jpg

const storage = multer.diskStorage({

  destination: './public/images',
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' +file.originalname )
  }
})

var upload = multer({ storage: storage })

usersRouter.post('/upload',function(req, res) {
  console.log('/upload enter' ,req.files)
  upload(req, res, function (err) {
  if (err instanceof multer.MulterError) {
    return res.status(500).json(err)
  } else if (err) {
    return res.status(500).json(err)
  }
    return res.status(200).send(req.file)
  })
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('properties', { address: 1 })
  response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
  const user = await User.findById(request.params.id)
  response.json(user)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, lastName, email, password } = request.body

  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    lastName,
    email,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

 usersRouter.put('/updateUser/', async (request, response) => {
   const { username, name, lastName, email } = request.body
   const token = getTokenFrom(request)
   const decodedToken = jwt.verify(token, process.env.SECRET)
   if(!token || !decodedToken.id){
    return response.status(401).json({ error: 'token de usuario no válido' })
  }
  //tenemos que comprobar si ha cambiado el username
  //si ha cambiado el username, comprobar que no existe otro usuario con ese username
  //si no ha cambiado el username, no comprobar nada

  if(decodedToken.username !== username){
  const existingUsername = await User.findOne({ username })
  if (existingUsername) {
    return response.status(400).json({
      error: 'El nombre de usuario ya existe'
    })
  }
  }

    const user = {
      username,
      name,
      lastName,
      email,
    }

  const updatedUser = await User.findByIdAndUpdate(decodedToken.id, user, { new: true })
  response.json(updatedUser)
})

usersRouter.put('/updatePassword/', async (request, response) => {
  const { currentPass, password1 } = request.body
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if(!token || !decodedToken.id){
    return response.status(401).json({ error: 'token de usuario no válido' })
  }
  const user = await User.findById(decodedToken.id)
  const correctPassword = await bcrypt.compare(currentPass, user.passwordHash)
  //comprobar que currentPassword es la correcta y si lo es actualizar

  if (!correctPassword) {
    return response.status(400).json({
      error: 'La contraseña actual no es correcta o el usuario no existe'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password1, saltRounds)

  const newuser = {
    passwordHash,
  }

  //actualiza en base al id del token que se le pasa en el body y no por el id de params en la request
  const updatedUser = await User.findByIdAndUpdate(decodedToken.id, newuser, { new: true })
  response.json(updatedUser)
})

usersRouter.put('/updateImage/', upload.single('file'), async (request, response) => {
  const imageProfile = request.file
  console.log(imageProfile)
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)

  if(!token || !decodedToken.id){
    return response.status(401).json({ error: 'token de usuario no válido' })
  }

  const newUser = {
    image: `${path_images}${imageProfile.filename}`,
  }
  const updated = await User.findByIdAndUpdate(decodedToken.id, newUser, { new: true })
  response.json(updated)
})

usersRouter.get('/getImage/', async(request, response) => {
  console.log('getImage')
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if(!token || !decodedToken.id){
    return response.status(401).json({ error: 'token de usuario no válido' })
  }
  const user = await User.findById(decodedToken.id)
  response.json(user.image)
})

usersRouter.get('/:id/getLiked/', async(request, response) => {
  const userId = request.params.id
  const user = await User.findById(userId)
  const likedPropertiesIds = user.liked

  try {
    const properties = await Property.find({ _id: { $in: likedPropertiesIds } })
    response.json(properties)
  } catch (error) {
    response.status(400).json({ error: 'Error al buscar las propiedades' })
  }
})



usersRouter.put('/addLiked/', async(request, response) => {
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if(!token || !decodedToken.id){
    return response.status(401).json({ error: 'token de usuario no válido' })
  }
  const user = await User.findById(decodedToken.id)
  const { propertyId }  = request.body
  const propertyLiked = await Property.findById(propertyId)

  //Si ya hay alguna propiedad con ese id en el array de favoritos, no se añade
  for (let i = 0; i < user.liked.length; i++) {
    if(user.liked[i]._id.equals(propertyLiked._id)){
      return response.status(400).json({
        error: 'La propiedad ya está en favoritos'
      })
    }
  }

  //user.liked = user.liked.concat(propertyLiked)
  //let updated
  user.liked = user.liked.concat(propertyLiked)
  const updated = await user.save()
  response.json(updated)
})

usersRouter.put('/deleteLiked/', async(request, response) => {
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if(!token || !decodedToken.id){
    return response.status(401).json({ error: 'token de usuario no válido' })
  }

  const user = await User.findById(decodedToken.id)
  const { propertyId }  = request.body

  user.liked = user.liked.filter(property => {
    return property._id.toString() !== propertyId.toString()
  })

  const updated = await user.save()
  response.json(updated)
})




module.exports = usersRouter