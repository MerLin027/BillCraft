const router     = require('express').Router()
const Generation = require('../models/Generation')
const auth       = require('../middleware/auth')

// All routes require a valid JWT
router.use(auth)

// ── Helper: next invoice number for this user ────────────────────────────────
const invoiceLocks = new Set()

async function nextInvoiceNumber(userId) {
  const uid = userId.toString()
  while (invoiceLocks.has(uid)) {
    await new Promise(r => setTimeout(r, 50))
  }
  invoiceLocks.add(uid)
  try {
    const count = await Generation.countDocuments({ userId, type: 'Invoice' })
    return 'INV-' + String(count + 1).padStart(4, '0')
  } finally {
    invoiceLocks.delete(uid)
  }
}

// ── GET /api/generations ─────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const generations = await Generation.find({ userId: req.userId }).sort({ createdAt: -1 })
    res.json({ generations })
  } catch (err) {
    console.error('[GET generations]', err)
    res.status(500).json({ error: 'Server error.' })
  }
})

// ── POST /api/generations ─────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const {
    title, subtitle, type, typeIcon,
    amount, status, downloadKind, downloadPayload,
  } = req.body

  if (!title?.trim()) return res.status(400).json({ error: 'Title is required.' })
  if (!type)          return res.status(400).json({ error: 'Type (Invoice | Contract) is required.' })

  try {
    // Auto-assign invoice number only for Invoices
    const invoiceNumber = type === 'Invoice' ? await nextInvoiceNumber(req.userId) : ''

    const generation = await Generation.create({
      userId:          req.userId,
      invoiceNumber,
      title:           title.trim(),
      subtitle:        subtitle || '',
      type,
      typeIcon:        typeIcon  || (type === 'Invoice' ? 'receipt_long' : 'gavel'),
      amount:          amount    || '$0.00',
      status:          status    || 'Pending',
      downloadKind:    downloadKind || 'invoice',
      downloadPayload: downloadPayload || {},
    })

    res.status(201).json({ generation })
  } catch (err) {
    console.error('[POST generations]', err)
    res.status(500).json({ error: 'Server error.' })
  }
})

// ── PATCH /api/generations/:id ───────────────────────────────────────────────
// Update editable fields (title, subtitle) of a generation
router.patch('/:id', async (req, res) => {
  const { title, subtitle } = req.body
  if (!title?.trim()) return res.status(400).json({ error: 'Title is required.' })

  try {
    const generation = await Generation.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      {
        ...(title    && { title:    title.trim() }),
        ...(subtitle !== undefined && { subtitle: subtitle?.trim() || '' }),
      },
      { new: true }
    )
    if (!generation) return res.status(404).json({ error: 'Generation not found.' })
    res.json({ generation })
  } catch (err) {
    console.error('[PATCH generations/:id]', err)
    res.status(500).json({ error: 'Server error.' })
  }
})

// ── PATCH /api/generations/:id/status ────────────────────────────────────────
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body
  if (!status) return res.status(400).json({ error: 'status field is required.' })

  try {
    const generation = await Generation.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { status },
      { new: true }
    )
    if (!generation) return res.status(404).json({ error: 'Generation not found.' })
    res.json({ generation })
  } catch (err) {
    console.error('[PATCH generations/:id/status]', err)
    res.status(500).json({ error: 'Server error.' })
  }
})

// ── DELETE /api/generations/:id ───────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const generation = await Generation.findOneAndDelete({ _id: req.params.id, userId: req.userId })
    if (!generation) return res.status(404).json({ error: 'Generation not found.' })
    res.json({ message: 'Generation deleted.' })
  } catch (err) {
    console.error('[DELETE generations/:id]', err)
    res.status(500).json({ error: 'Server error.' })
  }
})

module.exports = router
