// full stack 2022 osan harjoitukset

require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.static('build'))
app.use(express.json())
app.use(cors())


morgan.token('bodyToken', function (request) {
    //console.log('morgan token for body', request.body)
    return JSON.stringify(request.body)
})
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :bodyToken"))

app.get('/', (request, response) => {
  response.send('<h1>Phonebook API is here</h1>')
})

app.get('/info', (request, response) => {
    const currentTime = new Date().toString()
    response.send(`<h1>Phonebook has ${persons.length} people</h1><div>${currentTime}</div>`)
})

app.get('/api/persons', (request, response) => {
    console.log('GET /api/persons/')
    Person.find({}).then(person => {
        response.json(person)
    }).catch(error => {
        next(error)
    })
})

app.get('/api/persons/:id', (request, response) => {
    console.log('GET /api/persons/', request.params.id)
    Person.findById(request.params.id)
        .then(person => {
            response.json(person)
        })
        .catch(error => {
            console.log(error)
        })
})

app.post('/api/persons', (request, response, next) => {
    const { name, number } = request.body
    console.log('POST /api/persons/', name, number)
    if (!name || !number) {
      return response.status(400).json({ 
        error: 'Name and number are required.' 
        }).end()
    }
    const person = new Person({ name, number })
    person.save()
        .then(newPerson => {
            response.json(newPerson)
        })
        .catch(error =>  {
            console.log('Error saving person:', error)
            next(error)
        })
})


app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log('GET /api/persons/', id)
    const person = persons.find(person => person.id === id)
    if (person) {
        console.log('response:', person)
        response.json(person)
    } else {
        console.log('404')
        response.status(404).end()
    }
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log('DELETE /api/persons/', id)
    person = persons.filter(person => person.id !== id)
    if (person.length) {
        console.log('204')
        response.status(204).end()
    } else {
        console.log('404')
        response.status(404).end()
    }
})

const errorHandler = (error, request, response) => {
    console.log('ERROR', error, request, response)
    return response.status(400).json({ error: error.message })
}
app.use(errorHandler)

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})