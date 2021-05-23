const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const { authorization } = req.headers

  if (authorization) {
    // eslint-disable-next-line no-unused-vars
    const [_type, token] = authorization.split(' ') // authorization: Bearer <token>

    jwt.verify(token, '9UwBWnYD', (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Some error occurred! Please check authorization token and try again.' })

      req.user = decoded // decoded === token payload

      next()
    })

  } else {
    res.status(401).json({ message: 'Some error occurred! Please check authorization token and try again.' })
  }
}
