const mongoose = require('mongoose')

const clientSchema = new mongoose.Schema(
  {
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, lowercase: true, trim: true },
    phone:    { type: String, default: '' },
    business: { type: String, default: '' },
    industry: { type: String, default: '' },
  },
  { timestamps: true }
)

// Virtual: formatted date string for the frontend table
clientSchema.virtual('dateAdded').get(function () {
  return this.createdAt.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
})

clientSchema.set('toJSON', { virtuals: true })

module.exports = mongoose.model('Client', clientSchema)
