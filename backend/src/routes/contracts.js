const express = require('express')
const PDFDocument = require('pdfkit')
const router = express.Router()

// POST /api/contracts/download
router.post('/download', (req, res) => {
  const {
    contractTitle = 'Freelance Service Agreement',
    freelancerName = '',
    freelancerEmail = '',
    effectiveDate = '',
    clientName = '',
    businessName = '',
    clientEmail = '',
    clientPhone = '',
    businessType = '',
    items = [],
    deposit = 50,
    dueDate = 'Net 30',
    milestones = false,
    lateFee = true,
    ipTransfer = true,
    portfolio = false,
  } = req.body

  const total = items.reduce(
    (sum, it) => sum + (parseFloat(it.rate) || 0) * (parseInt(it.qty) || 0),
    0
  )
  const fmt = (n) => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2 })
  const depositAmt = (total * deposit) / 100

  const filename = `Contract-${(clientName || businessName || 'client').replace(/\s+/g, '_')}.pdf`
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)

  const doc = new PDFDocument({ margin: 50, size: 'A4' })
  doc.pipe(res)

  const BLACK     = '#0a0a0a'
  const WHITE     = '#f5f5f5'
  const GREEN     = '#22c55e'
  const GRAY_DARK = '#1a1a1a'
  const GRAY_MID  = '#2a2a2a'
  const GRAY_TEXT = '#888888'
  const pageW     = doc.page.width
  const margin    = 50

  // Background
  doc.rect(0, 0, pageW, doc.page.height).fill(BLACK)

  // Header bar
  doc.rect(0, 0, pageW, 80).fill(GRAY_DARK)
  doc.fontSize(22).font('Helvetica-Bold').fillColor(WHITE).text('Bill', margin, 28, { continued: true })
  doc.fillColor(GREEN).text('Craft')
  doc.fontSize(10).font('Helvetica').fillColor(GRAY_TEXT)
     .text('CONTRACT', pageW - margin - 90, 25, { width: 90, align: 'right' })
  doc.fontSize(12).font('Helvetica-Bold').fillColor(WHITE)
     .text(contractTitle, pageW - margin - 200, 42, { width: 200, align: 'right' })

  // Effective date strip
  doc.rect(margin, 90, pageW - margin * 2, 28).fill(GRAY_MID)
  doc.fontSize(9).font('Helvetica').fillColor(GRAY_TEXT)
     .text(`Effective Date: ${effectiveDate || '—'}`, margin + 8, 100)

  // Parties section
  let y = 138
  doc.fontSize(8).font('Helvetica-Bold').fillColor(GREEN).text('PARTIES TO THIS AGREEMENT', margin, y)
  y += 14

  const midX = pageW / 2 + 10
  doc.fontSize(8).font('Helvetica-Bold').fillColor(GRAY_TEXT).text('FREELANCER', margin, y)
  doc.fontSize(8).font('Helvetica-Bold').fillColor(GRAY_TEXT).text('CLIENT', midX, y)
  y += 12

  doc.fontSize(10).font('Helvetica-Bold').fillColor(WHITE).text(freelancerName || '—', margin, y)
  doc.fontSize(10).font('Helvetica-Bold').fillColor(WHITE).text(businessName || clientName || '—', midX, y)
  y += 14

  doc.fontSize(9).font('Helvetica').fillColor(GRAY_TEXT).text(freelancerEmail, margin, y)
  doc.fontSize(9).font('Helvetica').fillColor(GRAY_TEXT).text(clientEmail || clientPhone || '', midX, y)
  y += 14

  if (businessType) {
    doc.text(`Entity type: ${businessType}`, midX, y)
    y += 14
  }

  y += 12

  // Scope of work table
  doc.moveTo(margin, y).lineTo(pageW - margin, y).strokeColor(GRAY_MID).lineWidth(0.5).stroke()
  y += 10

  doc.fontSize(8).font('Helvetica-Bold').fillColor(GREEN).text('SCOPE OF WORK', margin, y)
  y += 14

  // Table header
  doc.rect(margin, y, pageW - margin * 2, 24).fill(GRAY_MID)
  doc.fontSize(8).font('Helvetica-Bold').fillColor(GREEN)
  doc.text('DELIVERABLE', margin + 8, y + 8)
  doc.text('QTY', pageW - margin - 120, y + 8, { width: 30, align: 'center' })
  doc.text('RATE', pageW - margin - 80, y + 8, { width: 50, align: 'right' })
  doc.text('TOTAL', pageW - margin - 8, y + 8, { width: 0, align: 'right' })
  y += 24

  items.forEach((item, i) => {
    const amt = (parseFloat(item.rate) || 0) * (parseInt(item.qty) || 0)
    doc.rect(margin, y, pageW - margin * 2, 22).fill(i % 2 === 0 ? '#111111' : GRAY_DARK)
    doc.fontSize(9).font('Helvetica').fillColor(WHITE)
       .text(item.desc || '', margin + 8, y + 7, { width: pageW - margin * 2 - 180, ellipsis: true })
    doc.fillColor(GRAY_TEXT)
       .text(String(item.qty || 1), pageW - margin - 120, y + 7, { width: 30, align: 'center' })
       .text(fmt(parseFloat(item.rate) || 0), pageW - margin - 80, y + 7, { width: 50, align: 'right' })
    doc.fillColor(WHITE)
       .text(fmt(amt), pageW - margin - 22, y + 7, { width: 0, align: 'right' })
    y += 22
  })

  doc.moveTo(margin, y).lineTo(pageW - margin, y).strokeColor(GRAY_MID).lineWidth(1).stroke()
  y += 12

  // Total
  const totX = pageW - margin - 180
  doc.fontSize(9).font('Helvetica').fillColor(GRAY_TEXT).text('Project Total', totX, y, { width: 100, align: 'right' })
  doc.fillColor(WHITE).text(fmt(total), totX + 108, y, { width: 72, align: 'right' })
  y += 14
  doc.fontSize(9).font('Helvetica-Bold').fillColor(GREEN)
     .text(`Deposit Due (${deposit}%)`, totX, y, { width: 100, align: 'right' })
  doc.fillColor(WHITE).text(fmt(depositAmt), totX + 108, y, { width: 72, align: 'right' })
  y += 24

  // Payment terms
  doc.moveTo(margin, y).lineTo(pageW - margin, y).strokeColor(GRAY_MID).lineWidth(0.5).stroke()
  y += 10
  doc.fontSize(8).font('Helvetica-Bold').fillColor(GREEN).text('PAYMENT TERMS', margin, y)
  y += 14
  doc.fontSize(9).font('Helvetica').fillColor(GRAY_TEXT)
  doc.text(`• Payment due: ${dueDate}`, margin, y); y += 13
  doc.text(`• Deposit of ${deposit}% (${fmt(depositAmt)}) required before work begins`, margin, y); y += 13
  if (milestones) { doc.text('• Milestone-based payment schedule applies', margin, y); y += 13 }
  y += 6

  // Clauses
  doc.moveTo(margin, y).lineTo(pageW - margin, y).strokeColor(GRAY_MID).lineWidth(0.5).stroke()
  y += 10
  doc.fontSize(8).font('Helvetica-Bold').fillColor(GREEN).text('TERMS & CONDITIONS', margin, y)
  y += 14
  doc.fontSize(9).font('Helvetica').fillColor(GRAY_TEXT)

  if (lateFee) {
    doc.text('Late Payment Fee: A 1.5% monthly fee applies to invoices unpaid after the due date.', margin, y, { width: pageW - margin * 2 })
    y += 26
  }
  if (ipTransfer) {
    doc.text('Intellectual Property: Upon receipt of full payment, all rights to deliverables transfer to the Client. Freelancer retains rights until payment is complete.', margin, y, { width: pageW - margin * 2 })
    y += 36
  }
  if (portfolio) {
    doc.text('Portfolio Rights: Freelancer may display completed work in their portfolio and promotional materials.', margin, y, { width: pageW - margin * 2 })
    y += 26
  }

  doc.text('Termination: Either party may terminate this agreement with 14 days written notice. Work completed to date will be invoiced at the agreed rate.', margin, y, { width: pageW - margin * 2 })
  y += 36

  // Signature section
  doc.moveTo(margin, y).lineTo(pageW - margin, y).strokeColor(GRAY_MID).lineWidth(0.5).stroke()
  y += 10
  doc.fontSize(8).font('Helvetica-Bold').fillColor(GREEN).text('SIGNATURES', margin, y)
  y += 20

  const sigW = (pageW - margin * 2 - 40) / 2

  // Freelancer sig box
  doc.rect(margin, y, sigW, 60).strokeColor(GRAY_MID).lineWidth(0.5).stroke()
  doc.fontSize(8).font('Helvetica').fillColor(GRAY_TEXT)
     .text('Freelancer Signature', margin + 8, y + 44)
     .text(freelancerName, margin + 8, y + 54)

  // Client sig box
  doc.rect(margin + sigW + 40, y, sigW, 60).strokeColor(GRAY_MID).lineWidth(0.5).stroke()
  doc.fontSize(8).font('Helvetica').fillColor(GRAY_TEXT)
     .text('Client Signature', margin + sigW + 48, y + 44)
     .text(clientName || businessName || '', margin + sigW + 48, y + 54)

  // Footer
  const footerY = doc.page.height - 36
  doc.moveTo(margin, footerY - 8).lineTo(pageW - margin, footerY - 8).strokeColor(GRAY_MID).lineWidth(0.5).stroke()
  doc.fontSize(8).font('Helvetica').fillColor(GRAY_TEXT)
     .text('Generated by BillCraft · freelancer operations platform', margin, footerY, {
       width: pageW - margin * 2, align: 'center',
     })

  doc.end()
})

module.exports = router
