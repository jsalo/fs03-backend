const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://jsalo:${password}@cluster0.frc5vpl.mongodb.net/phoneBook?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number,
})

const Person = mongoose.model('Person', personSchema)

const generateId = () => {
  return Math.floor(Math.random() * 100000000);
}

if (process.argv.length == 3) {
  console.log('Phonebook:')
  Person.find({}).then(result => {
    result.forEach(p => {
      console.log(p.name, p.number)
    })
    mongoose.connection.close()
  })

} else if (process.argv.length == 5) {

  const newName = process.argv[3]
  const newNumber = process.argv[4]
  const newId = generateId()

  const person = new Person({
    name: newName,
    number: newNumber,
    id: newId,
  })

  person.save().then(result => {
    console.log(`added ${person.name} number ${person.number} to phonebook.`)
    mongoose.connection.close()
  })
} else {
  console.log('Wrong number of arguments provided.')
}
