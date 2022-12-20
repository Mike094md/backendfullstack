const Note = require('../models/note')
const User = require('../models/user')
const Property = require('../models/property')

const initialNotes = [
  {
    content: 'HTML is easy',
    date: new Date(),
    important: false
  },
  {
    content: 'Browser can execute only Javascript',
    date: new Date(),
    important: true
  }
]

const initialProperties = [
  {
    type: 'apartment',
    operation: 'sale',
    price: 100000,
    location: {
      locality: 'Majadahonda',
      street: 'Panama',
      streetNumber: '20'
    },
    floor: 3,
    door: 'A',
    features: ['elevator', 'heating', 'air conditioning'],
    description: 'Piso en majadahonda con ascensor, calefacción y aire acondicionado',
    date: new Date(),
  },
  {
    type: 'apartment',
    operation: 'rent',
    price: 500,
    location: {
      locality: 'Las Rozas',
      street: 'San Patricio',
      streetNumber: '13'
    },
    floor: 2,
    door: 'C',
    features: ['elevator', 'heating'],
    description: 'Piso en las rozas con ascensor, calefacción',
    date: new Date(),
  },
]




const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon', date: new Date() })
  await note.save()
  await note.remove()

  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

const propertiesInDb = async () => {
  const properties = await Property.find({})
  return properties.map(note => note.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialNotes, initialProperties, nonExistingId, notesInDb, usersInDb, propertiesInDb
}