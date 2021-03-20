const schema = require('./schema')

const registerValidator = async (req, res, next) => {
  try {
    const { email, password, repassword } = req.body

    await schema.validateAsync({ email, password, repassword }, { abortEarly: false })

  } catch (e) {
    res.status(400).json({ error: e })
  }

  next()
}

const authValidator = async (req, res, next) => {
  try {
    const { email, password } = req.body

    await schema.validateAsync({ email, password }, { abortEarly: false })

  } catch (e) {
    res.status(400).json({ error: e })
  }

  next()
}

module.exports = {
  registerValidator,
  authValidator
}
