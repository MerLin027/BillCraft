require('dotenv').config()
const express    = require('express')
const cors       = require('cors')
const mongoose   = require('mongoose')

// ── Route imports ────────────────────────────────────────────────────────────
const invoiceRoutes      = require('./routes/invoices')
const contractRoutes     = require('./routes/contracts')
const invoiceWordRoutes  = require('./routes/invoiceWord')
const contractWordRoutes = require('./routes/contractWord')
const authRoutes         = require('./routes/auth')
const clientRoutes       = require('./routes/clients')
const generationRoutes   = require('./routes/generations')

// ── App setup ────────────────────────────────────────────────────────────────
const app  = express()
const PORT = process.env.PORT || 4000

// ── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : []

app.use(cors({
  origin(origin, callback) {
    // Production: Strictly enforce allowed origins
    if (process.env.NODE_ENV === 'production') {
      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }
      return callback(new Error('Not allowed by CORS'))
    }

    // Development: Allow requests with no origin (Postman), localhost, loopback
    if (!origin) return callback(null, true)
    const isLocalhost = /^http:\/\/localhost:\d+$/.test(origin)
    const isLoopback  = /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)
    if (isLocalhost || isLoopback || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    return callback(new Error('Not allowed by CORS'))
  },
}))

app.use(express.json())

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) =>
  res.json({ status: 'BillCraft backend running', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' })
)

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',        authRoutes)
app.use('/api/clients',     clientRoutes)
app.use('/api/generations', generationRoutes)

// PDF + Word document generation routes (stateless — no auth required)
app.use('/api/invoices',    invoiceRoutes)
app.use('/api/invoices',    invoiceWordRoutes)
app.use('/api/contracts',   contractRoutes)
app.use('/api/contracts',   contractWordRoutes)

// ── 404 fallback ─────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found.' }))

// ── MongoDB connection → then start server ────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅  MongoDB connected')
    app.listen(PORT, () => {
      console.log(`🚀  BillCraft backend → http://localhost:${PORT}`)
    })
  })
  .catch(err => {
    console.error('❌  MongoDB connection failed:', err.message)
    process.exit(1)
  })
