const express = require('express')
const app = express()
app.use(express.json())

const cors = require('cors')

app.use(cors())

app.use(express.static('build'))

var morgan = require('morgan')
morgan.token('res-body', function(req, res) {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :res-body'));

let persons = [
    {
        name: "Arto Hellas",
        number: "040-1234567",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
]


let dateAndTimeNow = new Date()

app.get('/info', (req, res) => {
    res.send(`<div><p>Phonebook has info for ${persons.length} people</p><p>${dateAndTimeNow}</p></div>`)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, response) => {

    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const id = Math.floor(Math.random() * (1000 - 1) + 1)
    console.log(id)
    return id;
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    const names = persons.map(person => person.name)
    if (names.includes(body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }
    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(person)

    response.json(person)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})