const mongoose = require('mongoose')

const generationSchema = new mongoose.Schema(
  {
    userId:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    invoiceNumber:   { type: String, default: '' },   // e.g. "INV-0001" — set at creation
    title:           { type: String, required: true },
    subtitle:        { type: String, default: '' },
    type:            { type: String, enum: ['Invoice', 'Contract'], required: true },
    typeIcon:        { type: String, default: 'receipt_long' },
    amount:          { type: String, default: '$0.00' },
    status:          { type: String, default: 'Pending' },
    downloadKind:    { type: String, default: 'invoice' },
    downloadPayload: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
)

// Virtual: formatted date string matching the frontend's toLocaleDateString format
generationSchema.virtual('date').get(function () {
  return this.createdAt.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
})

generationSchema.set('toJSON', { virtuals: true })

module.exports = mongoose.model('Generation', generationSchema)
