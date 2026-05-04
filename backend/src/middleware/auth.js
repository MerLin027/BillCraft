const jwt = require('jsonwebtoken')

/**
 * Middleware: verifies the Authorization: Bearer <token> header.
 * On success attaches req.userId (string) for downstream handlers.
 */
module.exports = function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization']
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided.' })
  }

  const token = authHeader.slice(7)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch {
    return res.status(401).json({ error: 'Token invalid or expired.' })
  }
}
