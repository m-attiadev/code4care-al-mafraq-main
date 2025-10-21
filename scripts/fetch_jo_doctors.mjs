import fs from 'node:fs/promises';
import path from 'node:path';
import { load } from 'cheerio';

const BASE_URL = 'https://www.almubdaa.com/dir/ar/jo/All/';
const ALTIBBI_LIST_URL = 'https://altibbi.com/الدليل-الطبي/الاردن/المفرق/اطباء';
const ALTIBBI_SPECIALTY_SLUGS = [
  'طب-عام',
  'باطنية',
  'نسائية-وتوليد',
  'اطفال',
  'اسنان',
  'جلدية-وتناسلية',
  'عيون',
  'انف-اذن-حنجرة',
  'عظام',
  'قلب-واوعية',
];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function parseArgs() {
  const args = Object.fromEntries(process.argv.slice(2).map(a => {
    const m = a.match(/^--([^=]+)=(.*)$/);
    return m ? [m[1], m[2]] : [a.replace(/^--/, ''), true];
  }));
  const city = (args.city || args['مدينة'] || '').toString().trim();
  const pages = parseInt(args.pages || args['صفحات'] || '10', 10);
  const depts = parseInt(args.depts || args['اقسام'] || '80', 10);
  return { city, pages: isNaN(pages) ? 10 : pages, depts: isNaN(depts) ? 80 : depts };
}

async function fetchHtml(url) {
  const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }});
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return await res.text();
}

function extractCityFromText(text) {
  if (!text) return '';
  const t = text.replace(/\s+/g, ' ').trim();
  const m1 = t.match(/المدينه\s*:\s*([^|\n\r]+)/i);
  const m2 = t.match(/المدينة\s*:\s*([^|\n\r]+)/i);
  const m3 = t.match(/المدينه\s*:\s*([\p{L}\s-]{2,})/u);
  const m = m1 || m2 || m3;
  return m ? m[1].trim() : '';
}

function parseDoctors(html) {
  const $ = load(html);
  const items = [];
  $("a.card, div.card, li.card, .doctor-card, .listing").each((_, el) => {
    const $el = $(el);
    const text = $el.text();
    const name = $el.find('.card-title, .title, .name, .doctor-name').first().text().trim() || $el.attr('title') || '';
    const specialty = $el.find('.specialty, .category, .cat, .doctor-specialty').first().text().trim();
    const cityText = $el.find('.city, .doctor-city').first().text().trim() || extractCityFromText(text);
    const address = $el.find('.address, .location, .city, .doctor-address').first().text().trim() || cityText || 'الأردن';
    const phoneMatch = text.match(/(?:\+?\d[\d\s-]{6,}\d)/);
    const phone = phoneMatch ? phoneMatch[0].replace(/\s+/g,' ').trim() : '';
    if (name) {
      items.push({
        id: `${name}-${address}`,
        name,
        specialty: specialty || undefined,
        address: address,
        phone: phone || undefined,
      });
    }
  });

  if (items.length === 0) {
    const pageText = $('body').text();
    const nameMatch = pageText.match(/(?:د\.|الدكتور|الدكتورة)\s+[\p{L}\s'.-]+/u);
    const phoneMatch = pageText.match(/(?:\+?\d[\d\s-]{6,}\d)/);
    const city = extractCityFromText(pageText);
    const name = nameMatch ? nameMatch[0].trim() : '';
    const phone = phoneMatch ? phoneMatch[0].replace(/\s+/g,' ').trim() : '';
    if (name) {
      items.push({ id: `${name}-${items.length}`, name, address: city || 'الأردن', phone });
    }
  }

  const seen = new Set();
  const deduped = items.filter(d => {
    const key = `${d.name}-${d.address}-${d.phone || ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return deduped;
}

async function crawl(maxPages = 10) {
  let url = BASE_URL;
  const all = [];
  for (let i = 0; i < maxPages; i++) {
    try {
      console.log(`Fetching page ${i+1}: ${url}`);
      const html = await fetchHtml(url);
      const items = parseDoctors(html);
      console.log(`Parsed ${items.length} items`);
      all.push(...items);
      const $ = load(html);
      const nextHref = $('a:contains("التالي"), a[rel="next"], .pagination a.next').attr('href');
      if (!nextHref) break;
      url = new URL(nextHref, url).toString();
      await sleep(900);
    } catch (e) {
      console.warn('Page fetch/parse error:', e.message);
      break;
    }
  }
  const seen = new Set();
  const final = all.filter(d => {
    const key = `${d.name}-${d.address}-${d.phone || ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return final;
}

async function crawlDepartments(maxDept = 80) {
  const all = [];
  for (let i = 1; i <= maxDept; i++) {
    const deptUrl = `${BASE_URL}links_dept_${i}.html`;
    try {
      console.log(`Fetching dept ${i}: ${deptUrl}`);
      const html = await fetchHtml(deptUrl);
      const items = parseDoctors(html);
      console.log(`Dept ${i} parsed ${items.length} items`);
      all.push(...items);
      await sleep(700);
    } catch (e) {
      // Skip not found or other errors
      console.warn(`Dept ${i} skipped: ${e.message}`);
      await sleep(300);
    }
  }
  const seen = new Set();
  const final = all.filter(d => {
    const key = `${d.name}-${d.address}-${d.phone || ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return final;
}

function includesCity(text, city) {
  if (!city) return true;
  const t = (text || '').toLowerCase();
  const variants = [city, 'المفرق', 'mafraq', 'al mafraq', 'al-mafraq'];
  return variants.some(v => t.includes(v.toLowerCase()));
}

function parseAltibbiDoctors(html) {
  const $ = load(html);
  const items = [];
  $('div, article, li').each((_, el) => {
    const $el = $(el);
    const text = $el.text().replace(/\s+/g, ' ').trim();
    if (!/المفرق\s*,?\s*الاردن|المفرق/i.test(text)) return;
    const nameMatch = text.match(/(?:د\.|الدكتور|الدكتورة)\s+[\p{L}\s'.-]+/u);
    if (!nameMatch) return;
    const name = nameMatch[0].trim();
    const specialtyMatch = text.match(/(?:طب عام|باطنية|نسائية وتوليد|أطفال|أسنان|جلدية(?:\s*و(?:التناسلية)?)?|عيون|أنف وأذن وحنجرة|قلب(?: وأوعية)?|عظام|جراحة|مسالك بولية|نفسية|أعصاب|تغذية|صدرية)/u);
    const specialty = specialtyMatch ? specialtyMatch[0].trim() : undefined;
    const address = 'المفرق، الأردن';
    const phoneMatch = text.match(/(?:\+?\d[\d\s-]{6,}\d)/);
    const phone = phoneMatch ? phoneMatch[0].replace(/\s+/g,' ').trim() : '';
    items.push({ id: `${name}-${address}`, name, specialty, address, phone: phone || undefined });
  });
  const seen = new Set();
  const final = items.filter(d => {
    const key = `${d.name}-${d.phone || ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return final;
}

async function crawlAltibbiList(maxPages = 20) {
  const all = [];
  for (let i = 1; i <= maxPages; i++) {
    const url = i === 1 ? ALTIBBI_LIST_URL : `${ALTIBBI_LIST_URL}?page=${i}`;
    try {
      console.log(`Fetching Altibbi list page ${i}: ${url}`);
      const html = await fetchHtml(url);
      const items = parseAltibbiDoctors(html);
      console.log(`Altibbi list page ${i} parsed ${items.length} items`);
      all.push(...items);
      await sleep(800);
      if (items.length === 0 && i > 1) break;
    } catch (e) {
      console.warn(`Altibbi list page ${i} error: ${e.message}`);
      break;
    }
  }
  const seen = new Set();
  const final = all.filter(d => {
    const key = `${d.name}-${d.phone || ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return final;
}

async function crawlAltibbiSpecialties(maxPagesPer = 10) {
  const all = [];
  for (const slug of ALTIBBI_SPECIALTY_SLUGS) {
    for (let i = 1; i <= maxPagesPer; i++) {
      const base = `${ALTIBBI_LIST_URL}/${slug}`;
      const url = i === 1 ? base : `${base}?page=${i}`;
      try {
        console.log(`Fetching Altibbi specialty '${slug}' page ${i}: ${url}`);
        const html = await fetchHtml(url);
        const items = parseAltibbiDoctors(html);
        console.log(`Altibbi specialty '${slug}' page ${i} parsed ${items.length} items`);
        all.push(...items);
        await sleep(800);
        if (items.length === 0 && i > 1) break;
      } catch (e) {
        console.warn(`Altibbi specialty '${slug}' page ${i} error: ${e.message}`);
        break;
      }
    }
  }
  const seen = new Set();
  const final = all.filter(d => {
    const key = `${d.name}-${d.phone || ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return final;
}

async function main() {
  const { city, pages, depts } = parseArgs();
  const listGeneral = await crawl(pages);
  const listDept = await crawlDepartments(depts);
  const altibbiList = await crawlAltibbiList(20);
  const altibbiSpecs = await crawlAltibbiSpecialties(10);
  const combined = [...listGeneral, ...listDept, ...altibbiList, ...altibbiSpecs];
  const filtered = combined.filter(d => includesCity(d.address, city) || includesCity(d.name, city));
  const mapped = filtered.map((d, i) => ({
    id: d.id || i,
    name: d.name,
    specialty: d.specialty,
    address: d.address,
    phone: d.phone,
    clinic: undefined,
    languages: undefined,
    workingHours: undefined,
    rating: undefined,
    location: undefined,
  }));
  const outPath = path.resolve(process.cwd(), 'public', 'doctors.json');
  await fs.writeFile(outPath, JSON.stringify(mapped, null, 2), 'utf8');
  console.log(`Wrote ${mapped.length} doctors to ${outPath} (city filter: ${city || 'none'}, pages: ${pages}, depts: ${depts}, altibbi: list 20, specs 10)`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});