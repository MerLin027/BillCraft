import puppeteer from 'puppeteer'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 512px;
      height: 512px;
      background: #0a0a0a;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #icon {
      position: relative;
      width: 512px;
      height: 512px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 112px;
      background: #0a0a0a;
    }
    #glow {
      position: absolute;
      inset: 60px;
      background: rgba(34, 197, 94, 0.2);
      border-radius: 9999px;
      filter: blur(60px);
    }
    h1 {
      font-family: 'Pacifico', cursive;
      font-size: 320px;
      color: #22c55e;
      position: relative;
      z-index: 10;
      line-height: 1;
      filter: drop-shadow(0 0 24px rgba(34,197,94,0.5));
    }
  </style>
</head>
<body>
  <div id="icon">
    <div id="glow"></div>
    <h1>B</h1>
  </div>
</body>
</html>`

const browser = await puppeteer.launch({ headless: true })
const page = await browser.newPage()
await page.setViewport({ width: 512, height: 512, deviceScaleFactor: 1 })
await page.setContent(html, { waitUntil: 'networkidle0' })
await page.evaluate(() => document.fonts.ready)

const outputPath = path.join(__dirname, 'public', 'favicon.png')
const element = await page.$('#icon')
await element.screenshot({ path: outputPath, omitBackground: false })

await browser.close()
console.log(`✓ Favicon saved to ${outputPath}`)
