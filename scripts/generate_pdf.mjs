import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import puppeteer from 'puppeteer';

async function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const projectRoot = path.resolve(__dirname, '..');
  const htmlPath = path.join(projectRoot, 'docs', 'pdf_overview_ar.html');
  const outPath = path.join(projectRoot, 'docs', 'Code4Care-Overview-AR.pdf');

  if (!fs.existsSync(htmlPath)) {
    throw new Error(`HTML file not found: ${htmlPath}`);
  }

  const browser = await puppeteer.launch({
    headless: true,
  });
  try {
    const page = await browser.newPage();
    // Load local HTML via file:// protocol
    const fileUrl = 'file://' + htmlPath.replace(/\\/g, '/');
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });

    await page.pdf({
      path: outPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' },
      preferCSSPageSize: true,
    });

    console.log(`PDF generated: ${outPath}`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});