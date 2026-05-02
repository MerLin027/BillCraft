const express = require('express')
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign,
  LevelFormat, Header, Footer, PageNumber,
} = require('docx')

const router = express.Router()

// ── helpers ────────────────────────────────────────────────────────────────
const DXA = (inches) => Math.round(inches * 1440)

const GREEN    = '22C55E'
const DARK_BG  = '1A1A1A'
const GRAY     = '888888'
const WHITE    = 'F5F5F5'
const BLACK    = '0A0A0A'
const AMBER    = 'F59E0B'

const border = { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' }
const allBorders = { top: border, bottom: border, left: border, right: border }
const noBorder   = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
const noBorders  = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder }

const cell = (children, opts = {}) =>
  new TableCell({
    children,
    borders: opts.borders ?? allBorders,
    shading: opts.shading ?? undefined,
    width: opts.width ? { size: opts.width, type: WidthType.DXA } : undefined,
    verticalAlign: opts.vAlign ?? VerticalAlign.TOP,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    columnSpan: opts.span,
  })

const run = (text, opts = {}) =>
  new TextRun({
    text: String(text ?? ''),
    font: 'Arial',
    size: opts.size ?? 22,
    bold: opts.bold ?? false,
    color: opts.color ?? '111111',
    italics: opts.italic ?? false,
  })

const para = (children, opts = {}) =>
  new Paragraph({
    children: Array.isArray(children) ? children : [children],
    alignment: opts.align ?? AlignmentType.LEFT,
    spacing: { before: opts.before ?? 0, after: opts.after ?? 100 },
    border: opts.border ?? undefined,
  })

const spacer = (pt = 1) =>
  para([run('')], { before: pt * 20, after: pt * 20 })

const fmt = (n) =>
  '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })

// ── route ──────────────────────────────────────────────────────────────────
router.post('/word', async (req, res) => {
  const {
    invoiceNumber = 'INV-0001',
    dateIssued = '',
    dateDue = '',
    fromName = '', fromEmail = '', fromStreet = '', fromCity = '', fromZip = '',
    toName = '', toEmail = '', toCompany = '', toPhone = '', toStreet = '', toCity = '', toZip = '',
    items = [],
    taxRate = 0,
    notes = '',
  } = req.body

  const subtotal  = items.reduce((s, it) => s + (parseFloat(it.rate) || 0) * (parseInt(it.qty) || 0), 0)
  const taxAmount = (subtotal * (parseFloat(taxRate) || 0)) / 100
  const total     = subtotal + taxAmount

  // ── content width for US Letter 1-inch margins ─
  const contentW = DXA(6.5)    // 9360

  // ── Page header: BillCraft wordmark + Invoice label ─
  const headerTable = new Table({
    width: { size: contentW, type: WidthType.DXA },
    columnWidths: [DXA(4), DXA(2.5)],
    borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideH: noBorder, insideV: noBorder },
    rows: [
      new TableRow({
        children: [
          cell([
            para([
              run('Bill', { size: 36, bold: true, color: '111111' }),
              run('Craft', { size: 36, bold: true, color: GREEN }),
            ]),
            para([run('Freelancer Operations Platform', { size: 18, color: GRAY })], { after: 0 }),
          ], { borders: noBorders, width: DXA(4) }),
          cell([
            para([run('INVOICE', { size: 18, bold: true, color: GRAY })], { align: AlignmentType.RIGHT }),
            para([run(invoiceNumber, { size: 28, bold: true, color: GREEN })], { align: AlignmentType.RIGHT }),
            para([run(`Status: PENDING`, { size: 18, bold: true, color: AMBER })], { align: AlignmentType.RIGHT, after: 0 }),
          ], { borders: noBorders, width: DXA(2.5) }),
        ],
      }),
    ],
  })

  // ── Thin green divider under header ─
  const greenDivider = para([run('')], {
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: GREEN, space: 1 } },
    after: 0,
  })

  // ── Dates strip ─
  const datesTable = new Table({
    width: { size: contentW, type: WidthType.DXA },
    columnWidths: [DXA(3.25), DXA(3.25)],
    borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideH: noBorder, insideV: noBorder },
    rows: [
      new TableRow({
        children: [
          cell([
            para([run('DATE ISSUED', { size: 16, bold: true, color: GRAY })]),
            para([run(dateIssued || '—', { size: 20, bold: true, color: '111111' })], { after: 0 }),
          ], { borders: noBorders, width: DXA(3.25) }),
          cell([
            para([run('DUE DATE', { size: 16, bold: true, color: GRAY })], { align: AlignmentType.RIGHT }),
            para([run(dateDue || '—', { size: 20, bold: true, color: '111111' })], { align: AlignmentType.RIGHT, after: 0 }),
          ], { borders: noBorders, width: DXA(3.25) }),
        ],
      }),
    ],
  })

  // ── Bill From / Bill To ─
  const fromLines = [fromName, fromEmail, fromStreet, [fromCity, fromZip].filter(Boolean).join(', ')].filter(Boolean)
  const toLines   = [toCompany || toName, toEmail || toName, toPhone, toStreet, [toCity, toZip].filter(Boolean).join(', ')].filter(Boolean)

  const addrTable = new Table({
    width: { size: contentW, type: WidthType.DXA },
    columnWidths: [DXA(3.1), DXA(0.3), DXA(3.1)],
    borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideH: noBorder, insideV: noBorder },
    rows: [
      new TableRow({
        children: [
          // Bill From
          cell([
            para([run('BILL FROM', { size: 17, bold: true, color: GREEN })], { after: 80 }),
            para([run(fromLines[0] || '—', { size: 22, bold: true, color: '111111' })], { after: 40 }),
            ...fromLines.slice(1).map(line =>
              para([run(line, { size: 19, color: GRAY })], { after: 30 })
            ),
          ], { borders: noBorders, width: DXA(3.1) }),
          // spacer column
          cell([para([run('')])], { borders: noBorders, width: DXA(0.3) }),
          // Bill To
          cell([
            para([run('BILL TO', { size: 17, bold: true, color: GREEN })], { after: 80 }),
            para([run(toLines[0] || '—', { size: 22, bold: true, color: '111111' })], { after: 40 }),
            ...toLines.slice(1).map(line =>
              para([run(line, { size: 19, color: GRAY })], { after: 30 })
            ),
          ], { borders: noBorders, width: DXA(3.1) }),
        ],
      }),
    ],
  })

  // ── Line items table ─
  const itemHeaderRow = new TableRow({
    children: [
      cell([para([run('DESCRIPTION', { size: 18, bold: true, color: GREEN })], { after: 0 })],
        { shading: { fill: '1A1A1A', type: ShadingType.CLEAR }, width: DXA(3.6) }),
      cell([para([run('QTY', { size: 18, bold: true, color: GREEN })], { align: AlignmentType.CENTER, after: 0 })],
        { shading: { fill: '1A1A1A', type: ShadingType.CLEAR }, width: DXA(0.8) }),
      cell([para([run('RATE', { size: 18, bold: true, color: GREEN })], { align: AlignmentType.RIGHT, after: 0 })],
        { shading: { fill: '1A1A1A', type: ShadingType.CLEAR }, width: DXA(1.0) }),
      cell([para([run('AMOUNT', { size: 18, bold: true, color: GREEN })], { align: AlignmentType.RIGHT, after: 0 })],
        { shading: { fill: '1A1A1A', type: ShadingType.CLEAR }, width: DXA(1.1) }),
    ],
    tableHeader: true,
  })

  const itemRows = items.map((item, i) => {
    const amount = (parseFloat(item.rate) || 0) * (parseInt(item.qty) || 0)
    const fill = i % 2 === 0 ? 'FAFAFA' : 'F3F3F3'
    return new TableRow({
      children: [
        cell([para([run(item.desc || '', { size: 20 })], { after: 0 })],
          { shading: { fill, type: ShadingType.CLEAR }, width: DXA(3.6) }),
        cell([para([run(String(item.qty || ''), { size: 20 })], { align: AlignmentType.CENTER, after: 0 })],
          { shading: { fill, type: ShadingType.CLEAR }, width: DXA(0.8) }),
        cell([para([run(fmt(parseFloat(item.rate) || 0), { size: 20 })], { align: AlignmentType.RIGHT, after: 0 })],
          { shading: { fill, type: ShadingType.CLEAR }, width: DXA(1.0) }),
        cell([para([run(fmt(amount), { size: 20 })], { align: AlignmentType.RIGHT, after: 0 })],
          { shading: { fill, type: ShadingType.CLEAR }, width: DXA(1.1) }),
      ],
    })
  })

  const itemsTable = new Table({
    width: { size: contentW, type: WidthType.DXA },
    columnWidths: [DXA(3.6), DXA(0.8), DXA(1.0), DXA(1.1)],
    rows: [itemHeaderRow, ...itemRows],
  })

  // ── Totals ─
  const totalsTable = new Table({
    width: { size: DXA(2.8), type: WidthType.DXA },
    columnWidths: [DXA(1.5), DXA(1.3)],
    borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideH: noBorder, insideV: noBorder },
    rows: [
      new TableRow({
        children: [
          cell([para([run('Subtotal', { size: 19, color: GRAY })], { after: 0 })], { borders: noBorders, width: DXA(1.5) }),
          cell([para([run(fmt(subtotal), { size: 19, color: GRAY })], { align: AlignmentType.RIGHT, after: 0 })], { borders: noBorders, width: DXA(1.3) }),
        ],
      }),
      new TableRow({
        children: [
          cell([para([run(`Tax (${taxRate}%)`, { size: 19, color: GRAY })], { after: 0 })], { borders: noBorders, width: DXA(1.5) }),
          cell([para([run(fmt(taxAmount), { size: 19, color: GRAY })], { align: AlignmentType.RIGHT, after: 0 })], { borders: noBorders, width: DXA(1.3) }),
        ],
      }),
      new TableRow({
        children: [
          cell([para([run('TOTAL DUE', { size: 22, bold: true, color: GREEN })], { after: 0 })],
            { shading: { fill: 'F0FDF4', type: ShadingType.CLEAR }, borders: { ...noBorders, top: { style: BorderStyle.SINGLE, size: 4, color: GREEN } }, width: DXA(1.5) }),
          cell([para([run(fmt(total), { size: 22, bold: true, color: GREEN })], { align: AlignmentType.RIGHT, after: 0 })],
            { shading: { fill: 'F0FDF4', type: ShadingType.CLEAR }, borders: { ...noBorders, top: { style: BorderStyle.SINGLE, size: 4, color: GREEN } }, width: DXA(1.3) }),
        ],
      }),
    ],
  })

  // right-align totals wrapper (put in a 2-col table)
  const totalsWrapper = new Table({
    width: { size: contentW, type: WidthType.DXA },
    columnWidths: [DXA(3.7), DXA(2.8)],
    borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideH: noBorder, insideV: noBorder },
    rows: [
      new TableRow({
        children: [
          cell([para([run('')], { after: 0 })], { borders: noBorders, width: DXA(3.7) }),
          cell([totalsTable], { borders: noBorders, width: DXA(2.8) }),
        ],
      }),
    ],
  })

  // ── Notes ─
  const notesSection = notes.trim()
    ? [
        spacer(6),
        para([run('NOTES', { size: 18, bold: true, color: GREEN })]),
        para([run(notes, { size: 20, color: GRAY })], { before: 60, after: 0 }),
      ]
    : []

  // ── Footer ─
  const footerDivider = para([run('')], {
    border: { top: { style: BorderStyle.SINGLE, size: 4, color: 'DDDDDD', space: 1 } },
    before: 80, after: 40,
  })

  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: 'Arial', size: 22, color: '111111' } },
      },
    },
    sections: [{
      properties: {
        page: {
          size: { width: DXA(8.5), height: DXA(11) },
          margin: { top: DXA(1), right: DXA(1), bottom: DXA(1), left: DXA(1) },
        },
      },
      children: [
        headerTable,
        spacer(4),
        greenDivider,
        spacer(6),
        datesTable,
        spacer(10),
        addrTable,
        spacer(12),
        itemsTable,
        spacer(6),
        totalsWrapper,
        ...notesSection,
        spacer(10),
        footerDivider,
        para([run('Generated by BillCraft · freelancer operations platform', { size: 16, color: GRAY, italic: true })],
          { align: AlignmentType.CENTER, after: 0 }),
      ],
    }],
  })

  const buffer = await Packer.toBuffer(doc)
  const filename = `${invoiceNumber}-${(toCompany || toName || 'invoice').replace(/\s+/g, '_')}.docx`
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  res.send(buffer)
})

module.exports = router
