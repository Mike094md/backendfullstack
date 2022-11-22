const mongoose = require('mongoose')
const password = require('./mongoPass.js')

// if (process.argv.length < 3) {
//     console.log('Please provide the password as an argument: node mongo.js <password>')
//     process.exit(1)
//   }

//   const password = process.argv[2]

const url =
    `mongodb+srv://mike_malone:${password}@notescluster.fm3nmwo.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

// const note = new Note({
//   content: 'Using MongoDB with Node',
//   date: new Date(),
//   important: false,
// })

//   note.save().then(result => {
//     console.log('note saved!')
//     mongoose.connection.close()
//   })

Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})