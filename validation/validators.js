const schema = require('./schema')

const registerValidator = async (req, res, next) => {
  try {
    const { email, password } = req.body

    await schema.validateAsync({ email, password }, { abortEarly: false })

  } catch (e) {
    res.status(400).json({ error: e })
  }

  // next() // ! Cannot set headers after they are sent to the client
}

const authValidator = async (req, res, next) => {
  try {
    const { email, password } = req.body

    await schema.validateAsync({ email, password }, { abortEarly: false })

  } catch (e) {
    res.status(400).json({ error: e })
  }

  // next() // ! Cannot set headers after they are sent to the client
}

module.exports = {
  registerValidator,
  authValidator
}
