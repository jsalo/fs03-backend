// full stack 2022 osan harjoitukset

require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.static('build'))
app.use(express.json())
app.use(cors({
    origin: '*'
}))

morgan.token('bodyToken', function (request) {
    //console.log('morgan token for body', request.body)
    return JSON.stringify(request.body)
})
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :bodyToken"))

app.get('/', (request, response) => {
  response.send('<h1>Phonebook API is here</h1>')
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
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const { name, number } = request.body
    console.log('POST /api/persons/', name, number)
    if (!name || !number) {
        return response.status(400).json({ error: 'Name or number missing.' }).end()
    }
    const person = new Person({ name, number })
    person.save()
        .then(newPerson => {
            response.json(newPerson)
        })
        .catch(error =>  next(error))
})


app.get('/api/persons/:id', (request, response) => {
    console.log('GET /api/persons/', request.params.id)
    Person.findById(request.params.id)
        .then((person) => {
            if (person) {
                res.json(person)
            } else {
                console.log('Could not find:', request.params.id)
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})


app.delete("/api/persons/:id", (request, response, next) => {
    console.log('DELETE /api/persons/',request.params.id)
    Person.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch((error) => next(error))
})




const unknownEndpoint = (request, response) => {
    console.log('unknownEndpoint', request.url)
    response.status(404).send({ error: 'Unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.log('errorHandler', error, request)
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'Invalid id format' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    } else {
        console.log('errorHandler unexpexted error:', error.name)
    }
    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
