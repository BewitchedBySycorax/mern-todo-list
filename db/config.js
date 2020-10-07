const mongoose = require('mongoose')

const database = 'tasks'
const password = '*@Qysyhex!1'
const uri = `mongodb+srv://BewitchedBySycorax:${password}@cluster0.iqo9r.mongodb.net/${database}?retryWrites=true&w=majority`

// It lets mongoose call the createIndex method on the mongodb native driver
mongoose.set('useCreateIndex', true)

const dbConnect = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
    mongoose.connection.on('error', e => {
      process.stderr.write(e)
    })
  } catch (e) {
    process.stdout.write(e.message)
  }
}

module.exports = dbConnect
