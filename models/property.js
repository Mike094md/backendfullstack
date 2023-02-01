const mongoose = require('mongoose')

const propertySchema = new mongoose.Schema({
  type: { // piso o chalet
    type: String,
    required: true,
  },
  operation:{ //venta o alquiler
    type: String,
    required: true,
  },
  address:{ //location: {localidad: 'Madrid', calle: 'Panama', numero via: ' 12'}
    localidad: String,
    nombreVia: String,
    nVia: String,
  },
  type_apartment: {
    piso: Boolean,
    atico: Boolean,
    duplex: Boolean,
    estudio: Boolean,
  },
  floor: Number, //2º  estos dos campos son opcionales dependiendo de si se trata de un piso o de un chalet
  door: String, //B
  price: {
    type: Number,
    required: true,
  },
  features: {
    ascensor: Boolean,
    calefaccion: Boolean,
    aireAcondicionado: Boolean,
    piscina: Boolean,
    terraza: Boolean,
    jardin: Boolean,
    trastero: Boolean,
    garaje: Boolean,
    amueblado: Boolean,
    balcon: Boolean,
    armariosEmpotrados: Boolean,
  }, // ['ascensor', 'calefacción', 'aire acondicionado']
  images: [String],
  description: String,
  date: {
    type: Date,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

propertySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Property', propertySchema)