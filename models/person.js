const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

const personSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    number: {
      type: String,
      required: true
    }
 })

 personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

console.log('Connecting to mongodb at ', url)

mongoose.connect(url)
  .then(() => 
    console.log('Successfully connected'))
  .catch((error) => 
    console.log('error:', error.message))

module.exports = mongoose.model('Person', personSchema)


