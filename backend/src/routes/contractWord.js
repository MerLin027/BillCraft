const express = require('express')
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign, LevelFormat,
} = require('docx')

const router = express.Router()

const DXA = (inches) => Math.round(inches * 1440)
const GREEN = '22C55E'
const GRAY  = '888888'
const AMBER = 'F59E0B'

const border    = { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' }
const allBorders = { top: border, bottom: border, left: border, right: border }
const noBorder  = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder }

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
    numbering: opts.numbering ?? undefined,
  })

const spacer = (pt = 1) =>
  para([run('')], { before: pt * 20, after: pt * 20 })

const sectionHeader = (text) =>
  para([run(text, { size: 19, bold: true, color: GREEN })], {
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: GREEN, space: 1 } },
    after: 80, before: 160,
  })

const fmt = (n) =>
  '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })

router.post('/word', async (req, res) => {
  const {
    contractTitle = 'Freelance Service Agreement',
    freelancerName = '', freelancerEmail = '', effectiveDate = '',
    clientName = '', businessName = '', clientPhone = '', businessType = '',
    items = [],
    deposit = 50, dueDate = 'Net 30',
    milestones = false, lateFee = true, ipTransfer = true, portfolio = false,
  } = req.body

  try {

  const total      = items.reduce((s, it) => s + (parseFloat(it.rate) || 0) * (parseInt(it.qty) || 0), 0)
  const depositAmt = (total * deposit) / 100
  const contentW   = DXA(6.5)

  // ── Header ─
  const headerTable = new Table({
    width: { size: contentW, type: WidthType.DXA },
    columnWidths: [DXA(3.5), DXA(3)],
    borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideH: noBorder, insideV: noBorder },
    rows: [
      new TableRow({
        children: [
          cell([
            para([
              run('Bill', { size: 34, bold: true, color: '111111' }),
              run('Craft', { size: 34, bold: true, color: GREEN }),
            ]),
            para([run('Freelancer Operations Platform', { size: 18, color: GRAY })], { after: 0 }),
          ], { borders: noBorders, width: DXA(3.5) }),
          cell([
            para([run('CONTRACT', { size: 16, bold: true, color: GRAY })], { align: AlignmentType.RIGHT }),
            para([run(contractTitle, { size: 20, bold: true, color: '111111' })], { align: AlignmentType.RIGHT }),
            para([run(`Effective: ${effectiveDate || '—'}`, { size: 18, color: GRAY })], { align: AlignmentType.RIGHT, after: 0 }),
          ], { borders: noBorders, width: DXA(3) }),
        ],
      }),
    ],
  })

  const greenDivider = para([run('')], {
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: GREEN, space: 1 } },
    after: 0,
  })

  // ── Parties ─
  const partiesTable = new Table({
    width: { size: contentW, type: WidthType.DXA },
    columnWidths: [DXA(3.1), DXA(0.3), DXA(3.1)],
    borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideH: noBorder, insideV: noBorder },
    rows: [
      new TableRow({
        children: [
          cell([
            para([run('FREELANCER', { size: 16, bold: true, color: GREEN })], { after: 60 }),
            para([run(freelancerName || '—', { size: 22, bold: true })], { after: 40 }),
            para([run(freelancerEmail || '', { size: 19, color: GRAY })], { after: 0 }),
          ], { borders: noBorders, width: DXA(3.1) }),
          cell([para([run('')])], { borders: noBorders, width: DXA(0.3) }),
          cell([
            para([run('CLIENT', { size: 16, bold: true, color: GREEN })], { after: 60 }),
            para([run(businessName || clientName || '—', { size: 22, bold: true })], { after: 40 }),
            ...[clientName !== businessName ? clientName : '', clientPhone, businessType]
              .filter(Boolean)
              .map(line => para([run(line, { size: 19, color: GRAY })], { after: 30 })),
          ], { borders: noBorders, width: DXA(3.1) }),
        ],
      }),
    ],
  })

  // ── Scope of work table ─
  const scopeHeader = new TableRow({
    children: [
      cell([para([run('DELIVERABLE', { size: 17, bold: true, color: GREEN })], { after: 0 })],
        { shading: { fill: '1A1A1A', type: ShadingType.CLEAR }, width: DXA(3.6) }),
      cell([para([run('QTY', { size: 17, bold: true, color: GREEN })], { align: AlignmentType.CENTER, after: 0 })],
        { shading: { fill: '1A1A1A', type: ShadingType.CLEAR }, width: DXA(0.7) }),
      cell([para([run('RATE', { size: 17, bold: true, color: GREEN })], { align: AlignmentType.RIGHT, after: 0 })],
        { shading: { fill: '1A1A1A', type: ShadingType.CLEAR }, width: DXA(1.0) }),
      cell([para([run('TOTAL', { size: 17, bold: true, color: GREEN })], { align: AlignmentType.RIGHT, after: 0 })],
        { shading: { fill: '1A1A1A', type: ShadingType.CLEAR }, width: DXA(1.2) }),
    ],
    tableHeader: true,
  })

  const scopeRows = items.map((item, i) => {
    const amt  = (parseFloat(item.rate) || 0) * (parseInt(item.qty) || 0)
    const fill = i % 2 === 0 ? 'FAFAFA' : 'F3F3F3'
    return new TableRow({
      children: [
        cell([para([run(item.desc || '', { size: 20 })], { after: 0 })],
          { shading: { fill, type: ShadingType.CLEAR }, width: DXA(3.6) }),
        cell([para([run(String(item.qty || 1), { size: 20 })], { align: AlignmentType.CENTER, after: 0 })],
          { shading: { fill, type: ShadingType.CLEAR }, width: DXA(0.7) }),
        cell([para([run(fmt(parseFloat(item.rate) || 0), { size: 20 })], { align: AlignmentType.RIGHT, after: 0 })],
          { shading: { fill, type: ShadingType.CLEAR }, width: DXA(1.0) }),
        cell([para([run(fmt(amt), { size: 20 })], { align: AlignmentType.RIGHT, after: 0 })],
          { shading: { fill, type: ShadingType.CLEAR }, width: DXA(1.2) }),
      ],
    })
  })

  const scopeTable = new Table({
    width: { size: contentW, type: WidthType.DXA },
    columnWidths: [DXA(3.6), DXA(0.7), DXA(1.0), DXA(1.2)],
    rows: [scopeHeader, ...scopeRows],
  })

  // ── Totals ─
  const totalsTable = new Table({
    width: { size: DXA(2.6), type: WidthType.DXA },
    columnWidths: [DXA(1.4), DXA(1.2)],
    borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideH: noBorder, insideV: noBorder },
    rows: [
      new TableRow({ children: [
        cell([para([run('Project Total', { size: 19, color: GRAY })], { after: 0 })], { borders: noBorders, width: DXA(1.4) }),
        cell([para([run(fmt(total), { size: 19, color: GRAY })], { align: AlignmentType.RIGHT, after: 0 })], { borders: noBorders, width: DXA(1.2) }),
      ]}),
      new TableRow({ children: [
        cell([para([run(`Deposit (${deposit}%)`, { size: 20, bold: true, color: GREEN })], { after: 0 })],
          { shading: { fill: 'F0FDF4', type: ShadingType.CLEAR }, borders: { ...noBorders, top: { style: BorderStyle.SINGLE, size: 4, color: GREEN } }, width: DXA(1.4) }),
        cell([para([run(fmt(depositAmt), { size: 20, bold: true, color: GREEN })], { align: AlignmentType.RIGHT, after: 0 })],
          { shading: { fill: 'F0FDF4', type: ShadingType.CLEAR }, borders: { ...noBorders, top: { style: BorderStyle.SINGLE, size: 4, color: GREEN } }, width: DXA(1.2) }),
      ]}),
    ],
  })

  const totalsWrapper = new Table({
    width: { size: contentW, type: WidthType.DXA },
    columnWidths: [DXA(3.9), DXA(2.6)],
    borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideH: noBorder, insideV: noBorder },
    rows: [new TableRow({ children: [
      cell([para([run('')], { after: 0 })], { borders: noBorders, width: DXA(3.9) }),
      cell([totalsTable], { borders: noBorders, width: DXA(2.6) }),
    ]})],
  })

  // ── Payment terms ─
  const paymentLines = [
    `Payment due: ${dueDate}`,
    `Deposit of ${deposit}% (${fmt(depositAmt)}) required before work begins`,
    ...(milestones ? ['Milestone-based payment schedule applies'] : []),
  ]

  // ── Clause paragraphs ─
  const clauseParas = []
  if (lateFee) {
    clauseParas.push(para([
      run('Late Payment Fee: ', { bold: true }),
      run('A 1.5% monthly fee applies to invoices not paid by the due date.'),
    ], { after: 80 }))
  }
  if (ipTransfer) {
    clauseParas.push(para([
      run('Intellectual Property: ', { bold: true }),
      run('All rights to deliverables transfer to the Client upon receipt of full payment. Freelancer retains rights until payment is complete.'),
    ], { after: 80 }))
  }
  if (portfolio) {
    clauseParas.push(para([
      run('Portfolio Rights: ', { bold: true }),
      run('Freelancer may display completed work in their portfolio and promotional materials.'),
    ], { after: 80 }))
  }
  clauseParas.push(para([
    run('Termination: ', { bold: true }),
    run('Either party may terminate this agreement with 14 days written notice. Work completed to date will be invoiced at the agreed hourly or project rate.'),
  ], { after: 80 }))

  // ── Signature boxes ─
  const sigTable = new Table({
    width: { size: contentW, type: WidthType.DXA },
    columnWidths: [DXA(2.8), DXA(0.9), DXA(2.8)],
    borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideH: noBorder, insideV: noBorder },
    rows: [
      new TableRow({ children: [
        cell([
          para([run('Freelancer Signature', { size: 16, color: GRAY })], { after: 480 }),
          para([run('')], {
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '333333', space: 1 } }, after: 60,
          }),
          para([run(freelancerName, { size: 19, bold: true })], { after: 0 }),
        ], { borders: { ...noBorders, left: { style: BorderStyle.SINGLE, size: 4, color: GREEN } }, width: DXA(2.8) }),
        cell([para([run('')])], { borders: noBorders, width: DXA(0.9) }),
        cell([
          para([run('Client Signature', { size: 16, color: GRAY })], { after: 480 }),
          para([run('')], {
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '333333', space: 1 } }, after: 60,
          }),
          para([run(clientName || businessName || '', { size: 19, bold: true })], { after: 0 }),
        ], { borders: { ...noBorders, left: { style: BorderStyle.SINGLE, size: 4, color: GREEN } }, width: DXA(2.8) }),
      ]}),
    ],
  })

  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: 'Arial', size: 22, color: '111111' } },
      },
    },
    numbering: {
      config: [{
        reference: 'bullets',
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 360, hanging: 240 } } },
        }],
      }],
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

        sectionHeader('PARTIES TO THIS AGREEMENT'),
        spacer(2),
        partiesTable,
        spacer(4),

        sectionHeader('SCOPE OF WORK'),
        spacer(2),
        scopeTable,
        spacer(6),
        totalsWrapper,
        spacer(4),

        sectionHeader('PAYMENT TERMS'),
        ...paymentLines.map(line =>
          para([run(line, { size: 20 })], {
            numbering: { reference: 'bullets', level: 0 }, after: 60,
          })
        ),
        spacer(2),

        sectionHeader('TERMS & CONDITIONS'),
        ...clauseParas,
        spacer(4),

        sectionHeader('SIGNATURES'),
        spacer(4),
        sigTable,
        spacer(10),

        para([run('')], {
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: 'DDDDDD', space: 1 } },
          before: 80, after: 40,
        }),
        para([run('Generated by BillCraft · freelancer operations platform', { size: 16, color: GRAY, italic: true })],
          { align: AlignmentType.CENTER, after: 0 }),
      ],
    }],
  })

  const buffer = await Packer.toBuffer(doc)
  const filename = `Contract-${(clientName || businessName || 'client').replace(/\s+/g, '_')}.docx`
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  res.send(buffer)

  } catch (err) {
    console.error('[contractWord.js] unhandled error', err)
    if (!res.headersSent) res.status(500).json({ error: 'Server error generating Word document' })
  }
})

module.exports = router
