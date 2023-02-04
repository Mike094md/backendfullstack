const mongoose = require('mongoose')
const Schema = mongoose.Schema

/*
El mensaje esta formado por:
- sender: usuario que envia el mensaje
- recipient: usuario que recibe el mensaje
- subject: asunto del mensaje
- body: cuerpo del mensaje
- createdAt: fecha de creación del mensaje
*/

const messageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User' },
  recipient: { type: Schema.Types.ObjectId, ref: 'User' },
  body: String,
  createdAt: { type: Date, default: Date.now },
})


messageSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

const Message = mongoose.model('Message', messageSchema)

module.exports = Message