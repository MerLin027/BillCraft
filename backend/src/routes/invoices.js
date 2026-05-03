const express = require('express')
const PDFDocument = require('pdfkit')
const router = express.Router()

// POST /api/invoices/download
// Accepts invoice data, streams back a PDF
router.post('/download', (req, res) => {
  const {
    invoiceNumber = 'INV-0001',
    dateIssued,
    dateDue,
    fromName,
    fromEmail,
    fromStreet,
    fromCity,
    fromZip,
    toName,
    toEmail,
    toCompany,
    toPhone,
    toStreet,
    toCity,
    toZip,
    items = [],
    taxRate = 0,
    notes = '',
  } = req.body

  // Compute totals
  const subtotal = items.reduce(
    (sum, item) => sum + (parseFloat(item.rate) || 0) * (parseInt(item.qty) || 0),
    0
  )
  const taxAmount = (subtotal * (parseFloat(taxRate) || 0)) / 100
  const total = subtotal + taxAmount
  const fmt = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2 })

  // Set response headers so browser downloads the file
  const filename = `${invoiceNumber}-${(toCompany || toName || 'invoice').replace(/\s+/g, '_')}.pdf`
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)

  const doc = new PDFDocument({ margin: 50, size: 'A4' })
  doc.pipe(res)

  // ── Colors ──
  const BLACK      = '#0a0a0a'
  const WHITE      = '#f5f5f5'
  const GREEN      = '#22c55e'
  const GRAY_DARK  = '#1a1a1a'
  const GRAY_MID   = '#2a2a2a'
  const GRAY_TEXT  = '#888888'

  // ── Background ──
  doc.rect(0, 0, doc.page.width, doc.page.height).fill(BLACK)

  const pageW = doc.page.width   // 595
  const margin = 50

  // ── Header bar ──
  doc.rect(0, 0, pageW, 80).fill(GRAY_DARK)

  // BillCraft wordmark
  doc.fontSize(22).font('Helvetica-Bold').fillColor(WHITE).text('Bill', margin, 28, { continued: true })
  doc.fillColor(GREEN).text('Craft')

  // Invoice label top-right
  doc.fontSize(10).font('Helvetica').fillColor(GRAY_TEXT)
     .text('INVOICE', pageW - margin - 80, 25, { width: 80, align: 'right' })
  doc.fontSize(16).font('Helvetica-Bold').fillColor(WHITE)
     .text(invoiceNumber, pageW - margin - 80, 38, { width: 80, align: 'right' })

  // ── Status & dates strip ──
  const stripY = 90
  doc.rect(margin, stripY, pageW - margin * 2, 36).fill(GRAY_MID)

  // Status pill
  doc.roundedRect(margin + 8, stripY + 8, 70, 20, 4).fill('#f59e0b')
  doc.fontSize(9).font('Helvetica-Bold').fillColor(BLACK)
     .text('PENDING', margin + 8, stripY + 13, { width: 70, align: 'center' })

  // Dates
  const dateText = `Issued: ${dateIssued || '—'}     Due: ${dateDue || '—'}`
  doc.fontSize(9).font('Helvetica').fillColor(GRAY_TEXT)
     .text(dateText, margin + 90, stripY + 13, { width: 400 })

  // ── Bill From / Bill To ──
  const fromX = margin
  const toX   = pageW / 2 + 10
  const addrY = 148

  doc.fontSize(8).font('Helvetica-Bold').fillColor(GREEN)
  doc.text('BILL FROM', fromX, addrY)
  doc.text('BILL TO', toX, addrY)

  doc.fontSize(11).font('Helvetica-Bold').fillColor(WHITE)
  doc.text(fromName || '—', fromX, addrY + 14)
  doc.text(toCompany || toName || '—', toX, addrY + 14)

  doc.fontSize(9).font('Helvetica').fillColor(GRAY_TEXT)
  const fromLines = [fromEmail, fromStreet, [fromCity, fromZip].filter(Boolean).join(', ')].filter(Boolean)
  const toLines   = [toName, toEmail, toPhone, toStreet, [toCity, toZip].filter(Boolean).join(', ')].filter(Boolean)

  fromLines.forEach((line, i) => doc.text(line, fromX, addrY + 30 + i * 14))
  toLines.forEach(  (line, i) => doc.text(line, toX,   addrY + 30 + i * 14))

  // ── Line items table ──
  const tableTop = Math.max(addrY + 30 + Math.max(fromLines.length, toLines.length) * 14 + 24, 260)

  // Table header row
  doc.rect(margin, tableTop, pageW - margin * 2, 26).fill(GRAY_MID)

  const colDesc  = margin + 8
  const colQty   = pageW - margin - 130
  const colRate  = pageW - margin - 75
  const colAmt   = pageW - margin - 8

  doc.fontSize(8).font('Helvetica-Bold').fillColor(GREEN)
  doc.text('DESCRIPTION', colDesc,  tableTop + 9)
  doc.text('QTY',         colQty,   tableTop + 9, { width: 40, align: 'center' })
  doc.text('RATE',        colRate,  tableTop + 9, { width: 60, align: 'right' })
  doc.text('AMOUNT',      colAmt - 60, tableTop + 9, { width: 60, align: 'right' })

  // Table rows
  let rowY = tableTop + 26
  items.forEach((item, i) => {
    const amt = (parseFloat(item.rate) || 0) * (parseInt(item.qty) || 0)
    const rowBg = i % 2 === 0 ? '#111111' : GRAY_DARK
    doc.rect(margin, rowY, pageW - margin * 2, 24).fill(rowBg)

    doc.fontSize(9).font('Helvetica').fillColor(WHITE)
       .text(item.desc || '', colDesc, rowY + 8, { width: colQty - colDesc - 10, ellipsis: true })

    doc.fillColor(GRAY_TEXT)
       .text(String(item.qty || ''), colQty,  rowY + 8, { width: 40,  align: 'center' })
       .text(fmt(parseFloat(item.rate) || 0), colRate, rowY + 8, { width: 60, align: 'right' })

    doc.fillColor(WHITE)
       .text(fmt(amt), colAmt - 60, rowY + 8, { width: 60, align: 'right' })

    rowY += 24
  })

  // Bottom border of table
  doc.moveTo(margin, rowY).lineTo(pageW - margin, rowY).strokeColor(GRAY_MID).lineWidth(1).stroke()

  // ── Totals ──
  const totalsX = pageW - margin - 180
  let totY = rowY + 16

  const drawTotalRow = (label, value, bold = false, color = GRAY_TEXT) => {
    doc.fontSize(9).font(bold ? 'Helvetica-Bold' : 'Helvetica').fillColor(color)
    doc.text(label, totalsX, totY, { width: 100, align: 'right' })
    doc.fillColor(bold ? WHITE : GRAY_TEXT)
       .text(value, totalsX + 108, totY, { width: 72, align: 'right' })
    totY += 16
  }

  drawTotalRow('Subtotal', fmt(subtotal))
  drawTotalRow(`Tax (${taxRate}%)`, fmt(taxAmount))

  // Total divider
  doc.moveTo(totalsX, totY).lineTo(pageW - margin, totY).strokeColor(GRAY_MID).lineWidth(0.5).stroke()
  totY += 8

  drawTotalRow('TOTAL DUE', fmt(total), true, GREEN)

  // ── Notes ──
  if (notes.trim()) {
    const notesY = totY + 24
    doc.fontSize(8).font('Helvetica-Bold').fillColor(GREEN).text('NOTES', margin, notesY)
    doc.fontSize(9).font('Helvetica').fillColor(GRAY_TEXT).text(notes, margin, notesY + 14, {
      width: pageW - margin * 2,
      lineGap: 2,
    })
  }

  // ── Footer ──
  const footerY = doc.page.height - 40
  doc.moveTo(margin, footerY - 10).lineTo(pageW - margin, footerY - 10)
     .strokeColor(GRAY_MID).lineWidth(0.5).stroke()
  doc.fontSize(8).font('Helvetica').fillColor(GRAY_TEXT)
     .text('Generated by BillCraft · freelancer operations platform', margin, footerY, {
       width: pageW - margin * 2,
       align: 'center',
     })

  doc.end()
})

module.exports = router
