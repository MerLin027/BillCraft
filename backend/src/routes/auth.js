const router    = require('express').Router()
const jwt       = require('jsonwebtoken')
const rateLimit = require('express-rate-limit')
const User      = require('../models/User')
const auth      = require('../middleware/auth')

// ── Rate Limiting ───────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per 15 minutes
  message: { error: 'Too many login/register attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

// ── Helper ──────────────────────────────────────────────────────────────────
function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// ── POST /api/auth/register ─────────────────────────────────────────────────
router.post('/register', authLimiter, async (req, res) => {
  const { name, email, password } = req.body
  if (!name?.trim())     return res.status(400).json({ error: 'Name is required.' })
  if (!email?.trim())    return res.status(400).json({ error: 'Email is required.' })
  if (!password?.trim()) return res.status(400).json({ error: 'Password is required.' })
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' })

  try {
    const exists = await User.findOne({ email: email.toLowerCase().trim() })
    if (exists) return res.status(409).json({ error: 'An account with that email already exists.' })

    const user = new User({ name: name.trim(), email, hashedPassword: password, provider: 'email' })
    await user.save()

    const token = signToken(user._id.toString())
    res.status(201).json({ token, user })
  } catch (err) {
    console.error('[register]', err)
    res.status(500).json({ error: 'Server error during registration.' })
  }
})

// ── POST /api/auth/login ─────────────────────────────────────────────────────
router.post('/login', authLimiter, async (req, res) => {
  const { email, password } = req.body
  if (!email?.trim())    return res.status(400).json({ error: 'Email is required.' })
  if (!password?.trim()) return res.status(400).json({ error: 'Password is required.' })

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) return res.status(401).json({ error: 'Invalid email or password.' })
    if (user.provider !== 'email') {
      return res.status(401).json({ error: `This account uses ${user.provider} login.` })
    }

    const valid = await user.comparePassword(password)
    if (!valid) return res.status(401).json({ error: 'Invalid email or password.' })

    const token = signToken(user._id.toString())
    res.json({ token, user })
  } catch (err) {
    console.error('[login]', err)
    res.status(500).json({ error: 'Server error during login.' })
  }
})

// ── GET /api/auth/me ─────────────────────────────────────────────────────────
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) return res.status(404).json({ error: 'User not found.' })
    res.json({ user })
  } catch (err) {
    console.error('[me]', err)
    res.status(500).json({ error: 'Server error.' })
  }
})

// ── PATCH /api/auth/profile ─────────────────────────────────────────────────
router.patch('/profile', auth, async (req, res) => {
  const { name, email, phone, businessName } = req.body
  try {
    const user = await User.findById(req.userId)
    if (!user) return res.status(404).json({ error: 'User not found.' })

    if (name?.trim())         user.name         = name.trim()
    if (email?.trim())        user.email        = email.toLowerCase().trim()
    if (phone !== undefined)  user.phone        = phone.trim()
    if (businessName !== undefined) user.businessName = businessName.trim()

    await user.save()
    res.json({ user })
  } catch (err) {
    if (err.code === 11000 && err.keyPattern?.email) {
      return res.status(409).json({ error: 'That email is already in use by another account.' })
    }
    console.error('[profile patch]', err)
    res.status(500).json({ error: 'Server error.' })
  }
})

// ── PATCH /api/auth/password ─────────────────────────────────────────────────
router.patch('/password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Both currentPassword and newPassword are required.' })
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters.' })
  }

  try {
    const user = await User.findById(req.userId)
    if (!user) return res.status(404).json({ error: 'User not found.' })

    const valid = await user.comparePassword(currentPassword)
    if (!valid) return res.status(401).json({ error: 'Current password is incorrect.' })

    user.hashedPassword = newPassword  // pre-save hook will re-hash
    await user.save()
    res.json({ message: 'Password updated successfully.' })
  } catch (err) {
    console.error('[password patch]', err)
    res.status(500).json({ error: 'Server error.' })
  }
})

// ── DELETE /api/auth/account ─────────────────────────────────────────────────
// Permanently deletes the user's account and all associated data (clients, generations)
router.delete('/account', auth, async (req, res) => {
  try {
    const userId = req.userId

    // Cascade delete all user data
    const Client     = require('../models/Client')
    const Generation = require('../models/Generation')

    await Promise.all([
      Client.deleteMany({ userId }),
      Generation.deleteMany({ userId }),
    ])

    await require('../models/User').findByIdAndDelete(userId)

    res.json({ message: 'Account and all associated data deleted successfully.' })
  } catch (err) {
    console.error('[delete account]', err)
    res.status(500).json({ error: 'Server error while deleting account.' })
  }
})

module.exports = router

