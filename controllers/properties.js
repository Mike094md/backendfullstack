const propertiesRouter = require('express').Router()
const Property = require('../models/property')
const User = require('../models/user')
const getTokenFrom = require('../utils/getTokenFrom')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const path_images = `${process.env.BASE_PATH}:${process.env.PORT}/public/images/`
// const { ensureAuth } = require('../utils/AuthMiddleware')


/// MULTER CONFIGURATION
const storage = multer.diskStorage({

  destination: './public/images',
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' +file.originalname )
  }
})

var upload = multer({ storage: storage }).array('file')


propertiesRouter.post('/upload',function(req, res) {
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


propertiesRouter.get('/', async (request, response) => {
  const properties = await Property.find({}).populate('user', { username: 1, name: 1, email: 1 })
  response.json(properties)
})

propertiesRouter.post('/filter', async (request, response) => {
  const body = request.body
  // body = {localidad: "Madrid", precio: 100000, nHabitaciones: 3}
  const properties = await Property.find(body).populate('user', { username: 1, name: 1, email: 1 })
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



propertiesRouter.post('/', upload, async (request, response) => {
  const body = JSON.parse(request.body.body)
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)


  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)

  const newAddress = {
    localidad: body.localidad,
    nombreVia: body.nombreVia,
    nVia: body.nVia,
  }
  const newFeatures = {
    ascensor: body.ascensor,
    calefaccion: body.calefaccion,
    aireAcondicionado: body.aireAcondicionado,
    piscina: body.piscina,
    terraza: body.terraza,
    jardin: body.jardin,
    trastero: body.trastero,
    garaje: body.garaje,
    balcon: body.balcon,
    armariosEmpotrados: body.armariosEmpotrados,
    amueblado: body.amueblado,
  }

  const type_apartment = {
    piso: body.piso,
    atico: body.atico,
    duplex: body.duplex,
    estudio: body.estudio,
  }
  const imagenes = request.files.map(file => `${path_images}${file.filename}`)
  //http://localhost:3001/public/images/1620390000000-IMG_20210506_171725.jpg
  //${process.env.BASE_PATH}/public/images/${req.file.filename}
  console.log(imagenes)
  //TODO: cambiar porque hay campos que no son requeridos
  const property = new Property({
    type: body.type,
    operation: body.operation,
    address: newAddress,
    type_apartment: type_apartment,
    floor: body.planta,
    door: body.puerta,
    price: body.precio,
    features: newFeatures,
    images: imagenes,
    descripcion: body.descripcion,
    date: new Date(),
    user: user._id

  })

  const savedProperty = await property.save()
  user.properties = user.properties.concat(property)
  await user.save()
  response.json(savedProperty)

})


module.exports = propertiesRouter

