const mongoose = require('mongoose')
const bcrypt    = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    name:           { type: String,  required: true,  trim: true },
    email:          { type: String,  required: true,  unique: true, lowercase: true, trim: true },
    hashedPassword: { type: String,  default: null },      // null for OAuth users
    provider:       { type: String,  enum: ['email', 'google'], default: 'email' },
    phone:          { type: String,  default: '' },
    businessName:   { type: String,  default: '' },
  },
  { timestamps: true }
)

// Hash the password before saving when it has been modified
userSchema.pre('save', async function () {
  if (!this.isModified('hashedPassword') || !this.hashedPassword) return
  this.hashedPassword = await bcrypt.hash(this.hashedPassword, 12)
})

// Instance method to compare a plain-text password with the stored hash
userSchema.methods.comparePassword = function (plain) {
  if (!this.hashedPassword) return Promise.resolve(false)
  return bcrypt.compare(plain, this.hashedPassword)
}

// Never expose the hash in JSON responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.hashedPassword
  return obj
}

module.exports = mongoose.model('User', userSchema)
