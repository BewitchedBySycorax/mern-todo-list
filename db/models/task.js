const mongoose = require('mongoose')

const { Schema } = mongoose

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    deadline: { type: Date, default: null },
    user: { type: Schema.ObjectId, ref: 'User' } // User-Task binding (User model)
  }, {
    versionKey: false
  }
)

module.exports = mongoose.model('Task', taskSchema, 'tasks')
