const { bold } = require('cli-color')
const app = require('express')()

const PORT = process.env.PORT || 8000

app.get('/', (_, res) => {
  res.send('Let\'s go!')
})

app.listen(PORT, () => {
  console.log(bold.underline.xterm(226)(`Server has been started on localhost: ${PORT}`))
})
