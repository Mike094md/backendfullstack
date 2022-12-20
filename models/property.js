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
    locality: String,
    street: String,
    streetNumber: String,
  },
  floor: Number, //2º  estos dos campos son opcionales dependiendo de si se trata de un piso o de un chalet
  door: String, //B
  price: {
    type: Number,
    required: true,
  },
  features: [String], // ['ascensor', 'calefacción', 'aire acondicionado']
  images: [Buffer],
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