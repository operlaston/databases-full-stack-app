require('dotenv').config()
const express = require('express')
const Task = require('./models/task')
const app = express()
const cors = require('cors')

const requestLogger = (request, response, next) => {
  console.log(request.method, request.path, request.body)
  next()
}

app.use(express.static('dist'))
app.use(express.json())
app.use(requestLogger)
app.use(cors())

app.get('/api/tasks', (request, response, next) => {
  Task.find({})
    .then(tasks => {
      response.json(tasks)
    })
    .catch(err => {
      next(err)
    })
})

app.post('/api/tasks', (request, response, next) => {
  const task = new Task({
    title: request.body.title,
    description: request.body.description,
    status: request.body.status
  })
  
  task.save()
    .then(newTask => {
      response.json(newTask)
    })
    .catch(error => {
      next(error)
    })
})

app.delete('/api/tasks/:id', (request, response, next) => {
  Task.findByIdAndDelete(request.params.id)
    .then(res => {
      response.status(204).end()
    })
    .catch(error => {
      next(error)
    })
})

app.put('/api/tasks/:id', (request, response, next) => {
  Task.findByIdAndUpdate(request.params.id, {title: request.body.title, description: request.body.description, status: request.body.status, id: request.params.id},
    {new: true, runValidators: true, context: 'query'}
  )
    .then(updatedTask => {
      response.json(updatedTask)
    })
    .catch(error => {
      next(error)
    })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({error: 'malformed request'})
  }
  if (error.name === 'ValidationError') {
    return response.status(400).send({error: error.message})
  }

  next(error)
}

app.use(errorHandler)

app.listen(process.env.PORT, () => {
  console.log('server started on port:', process.env.PORT)
})