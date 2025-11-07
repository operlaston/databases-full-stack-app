const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('successfully connected to mongodb')
  })
  .catch(() => {
    console.log('failed to connect to mongo')
  })

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: String,
})

taskSchema.set('toJSON', 
  {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  }
)

const Task = mongoose.model('Task', taskSchema)

module.exports = Task