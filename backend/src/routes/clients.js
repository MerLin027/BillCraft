const router = require('express').Router()
const Client = require('../models/Client')
const auth   = require('../middleware/auth')

// All routes require a valid JWT
router.use(auth)

// ── GET /api/clients ─────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const clients = await Client.find({ userId: req.userId }).sort({ createdAt: -1 })
    res.json({ clients })
  } catch (err) {
    console.error('[GET clients]', err)
    res.status(500).json({ error: 'Server error.' })
  }
})

// ── POST /api/clients ────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { name, email, phone, business, industry } = req.body
  if (!name?.trim())  return res.status(400).json({ error: 'Client name is required.' })
  if (!email?.trim()) return res.status(400).json({ error: 'Email is required.' })

  try {
    const client = await Client.create({
      userId: req.userId,
      name:     name.trim(),
      email:    email.toLowerCase().trim(),
      phone:    phone?.trim()    || '',
      business: business?.trim() || '',
      industry: industry?.trim() || '',
    })
    res.status(201).json({ client })
  } catch (err) {
    console.error('[POST clients]', err)
    res.status(500).json({ error: 'Server error.' })
  }
})

// ── PUT /api/clients/:id ─────────────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  const { name, email, phone, business, industry } = req.body
  try {
    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      {
        ...(name     && { name:     name.trim() }),
        ...(email    && { email:    email.toLowerCase().trim() }),
        ...(phone    !== undefined && { phone:    phone.trim() }),
        ...(business !== undefined && { business: business.trim() }),
        ...(industry !== undefined && { industry: industry.trim() }),
      },
      { new: true, runValidators: true }
    )
    if (!client) return res.status(404).json({ error: 'Client not found.' })
    res.json({ client })
  } catch (err) {
    console.error('[PUT clients/:id]', err)
    res.status(500).json({ error: 'Server error.' })
  }
})

// ── DELETE /api/clients/:id ──────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const client = await Client.findOneAndDelete({ _id: req.params.id, userId: req.userId })
    if (!client) return res.status(404).json({ error: 'Client not found.' })
    res.json({ message: 'Client deleted.' })
  } catch (err) {
    console.error('[DELETE clients/:id]', err)
    res.status(500).json({ error: 'Server error.' })
  }
})

module.exports = router
