const jwt = require('jsonwebtoken')

const SECRET_KEY = process.env.SECRET



exports.ensureAuth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res
      .status(403)
      .send({ message: 'La petición no tiene cabecera de autentificación' })
  }
  const token = req.headers.authorization.replace(/['']+/g, '')
  let payload = ''
  try {
    payload= jwt.verify(token, SECRET_KEY)
    // Token expired
  } catch (error) {

    return res.status(404).send({ message: 'Token inválido' })
  }
  req.user = payload
  next()
}