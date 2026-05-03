const express = require('express')
const cors = require('cors')

const invoiceRoutes      = require('./routes/invoices')
const contractRoutes     = require('./routes/contracts')
const invoiceWordRoutes  = require('./routes/invoiceWord')
const contractWordRoutes = require('./routes/contractWord')

const app  = express()
const PORT = 4000

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true)
    const isLocalhost = /^http:\/\/localhost:\d+$/.test(origin)
    const isLoopback = /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)
    if (isLocalhost || isLoopback) return callback(null, true)
    return callback(new Error('Not allowed by CORS'))
  },
}))
app.use(express.json())

app.get('/health', (req, res) => res.json({ status: 'BillCraft backend running' }))

// PDF routes
app.use('/api/invoices',  invoiceRoutes)
app.use('/api/contracts', contractRoutes)

// Word routes
app.use('/api/invoices',  invoiceWordRoutes)
app.use('/api/contracts', contractWordRoutes)

app.listen(PORT, () => {
  console.log(`BillCraft backend running on http://localhost:${PORT}`)
  console.log(`  PDF  → POST /api/invoices/download`)
  console.log(`  PDF  → POST /api/contracts/download`)
  console.log(`  Word → POST /api/invoices/word`)
  console.log(`  Word → POST /api/contracts/word`)
})
