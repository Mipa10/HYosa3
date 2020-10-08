require('dotenv').config()
//const { response } = require("express");
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./mongo')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('info', function getInfo(req) {
    const info = JSON.stringify(req.body)
    return info
})

app.use(
    morgan(
        ':method :url :status :res[content-length] - :response-time ms :info'
    )
)

app.get('/info', (req, res, next) => {
    Person.countDocuments()
        .then((response) => {
            console.log(response)

            res.send(`<p>phonebook has info of ${response} people<p>
    <p>${new Date()}</p>`)
        })
        .catch((error) => next(error))
})

app.get('/api/persons', (req, res, next) => {
    Person.find({})
        .then((response) => {
            console.log('person', response)
            //console.log('ressi', res.json(response))

            res.json(response)

            // console.log(ihmiset)
        })
        .catch((error) => {
            next(error)
        })
    //res.send(notes);
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then((result) => {
            console.log(result)

            res.json(result)
        })
        .catch((error) => {
            next(error)
        })
})

app.put('/api/persons/:id', (req, res, next) => {
    const person = {
        name: req.body.name,
        number: req.body.number,
    }
    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then((updatedPerson) => {
            res.json(updatedPerson)
        })
        .catch((error) => {
            next(error)
        })
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).end()
        })
        .catch((error) => {
            next(error)
        })
    // const id = Number(req.params.id);
    // notes = notes.filter((note) => note.id !== id);

    // res.status(204).end();
})

app.post('/api/persons/', (req, res, next) => {
    if (!req.body.name || !req.body.number) {
        return res.status(404).json({
            error: 'name and number required',
        })
    }
    // if (notes.some((person) => person.name === req.body.name)) {
    //   return res.status(404).json({
    //     error: "name must be unique",
    //   });
    // }

    const newPerson = new Person({
        name: req.body.name,
        number: req.body.number,
    })

    newPerson
        .save()
        .then(() => {
            console.log('person saved!')
            //mongoose.connection.close()
            res.json(newPerson)
        })
        .catch((error) => {
            next(error)
        })
})

const errorHandler = (error, req, res, next) => {
    console.log(error.name)

    if (error.name === 'ValidationError') {
        return res.status(400).send(error)
    }

    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})
