import fs from 'fs/promises';
import path from 'path';
import { load } from 'cheerio';

const WHO_FACTS_URL = 'https://www.who.int/ar/news-room/fact-sheets';
const EMRO_TOPICS_URL = 'https://www.emro.who.int/ar/health-topics/index.html';
const WHO_TOPICS_URL = 'https://www.who.int/ar/health-topics';

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36',
      'accept-language': 'ar,en;q=0.9'
    }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return await res.text();
}

function normalizeSpace(str = '') {
  return str.replace(/\s+/g, ' ').trim();
}

function parseFactList(html) {
  const $ = load(html);
  const items = [];

  // WHO layouts vary; try multiple selectors
  const candidates = [
    '.auto-grid__wrapper .auto-grid__item',
    '.list .list__item',
    '.grid, .grid--cards .grid__item',
    '.sf-list-vertical__item',
    'article',
  ];

  $(candidates.join(',')).each((_, el) => {
    const root = $(el);
    const titleEl = root.find('h3, h2, .heading, .card__title').first();
    const title = normalizeSpace(titleEl.text());
    let link = root.find('a').attr('href') || '';
    if (link && !/^https?:\/\//.test(link)) {
      link = new URL(link, WHO_FACTS_URL).toString();
    }
    const descEl = root.find('p, .card__summary, .summary, .list__summary').first();
    const desc = normalizeSpace(descEl.text());

    if (title && link) {
      items.push({ name: title, desc, link });
    }
  });

  // Deduplicate by link
  const seen = new Set();
  const unique = items.filter(it => {
    const k = it.link;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  return unique;
}

function parseEmroTopics(html) {
  const $ = load(html);
  const items = [];
  $('a[href*="health-topics"]').each((_, a) => {
    const name = normalizeSpace($(a).text());
    let link = $(a).attr('href') || '';
    if (link && !/^https?:\/\//.test(link)) {
      link = new URL(link, EMRO_TOPICS_URL).toString();
    }
    if (name && name.length > 2 && !/index\.html?$/.test(link)) {
      items.push({ name, desc: '', link });
    }
  });
  const seen = new Set();
  const unique = items.filter(it => {
    const k = it.link || it.name;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  return unique;
}

 function parseWhoTopics(html) {
   const $ = load(html);
   const items = [];
   $('a[href*="/ar/health-topics/"]').each((_, a) => {
     const name = normalizeSpace($(a).text());
     let link = $(a).attr('href') || '';
     if (link && !/^https?:\/\//.test(link)) {
       link = new URL(link, WHO_TOPICS_URL).toString();
     }
     if (name && name.length > 2) {
       items.push({ name, desc: '', link });
     }
   });
   const seen = new Set();
   const unique = items.filter(it => {
     const k = it.link || it.name;
     if (seen.has(k)) return false;
     seen.add(k);
     return true;
   });
   return unique;
 }

 async function crawlFacts(maxPages = 5) {
  const all = [];
  for (let i = 1; i <= maxPages; i++) {
    const url = i === 1 ? WHO_FACTS_URL : `${WHO_FACTS_URL}?page=${i}`;
    try {
      console.log(`WHO facts page ${i}: ${url}`);
      const html = await fetchHtml(url);
      const items = parseFactList(html);
      console.log(`Parsed ${items.length} items on page ${i}`);
      all.push(...items);
      await sleep(1200);
    } catch (e) {
      console.warn(`Skip page ${i}: ${e.message}`);
      await sleep(500);
    }
  }
  const seen = new Set();
  const final = all.filter(x => {
    const k = x.link;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  return final;
 }

async function crawlEmroTopics() {
  try {
    console.log(`EMRO topics: ${EMRO_TOPICS_URL}`);
    const html = await fetchHtml(EMRO_TOPICS_URL);
    const items = parseEmroTopics(html);
    console.log(`Parsed ${items.length} EMRO topics`);
    return items;
  } catch (e) {
    console.warn(`EMRO topics fetch failed: ${e.message}`);
    return [];
  }
}

async function crawlWhoTopics() {
  try {
    console.log(`WHO topics: ${WHO_TOPICS_URL}`);
    const html = await fetchHtml(WHO_TOPICS_URL);
    const items = parseWhoTopics(html);
    console.log(`Parsed ${items.length} WHO topics`);
    return items;
  } catch (e) {
    console.warn(`WHO topics fetch failed: ${e.message}`);
    return [];
  }
}

 async function main() {
  const args = Object.fromEntries(process.argv.slice(2).map(s => {
    const [k,v] = s.split('=');
    return [k.replace(/^--/, ''), v];
  }));
  const pages = Number(args.pages || 5);

  const facts = await crawlFacts(pages);
  let items = facts;
  if (items.length === 0) {
    const whoTopics = await crawlWhoTopics();
    if (whoTopics.length > 0) {
      items = whoTopics;
    } else {
      const emro = await crawlEmroTopics();
      items = emro;
    }
  }
  const mapped = facts.map((f, i) => ({
    id: i,
    name: f.name,
    desc: f.desc,
    link: f.link,
    source: 'WHO',
  }));

  const outPath = path.resolve(process.cwd(), 'public', 'who_diseases.json');
-  await fs.writeFile(outPath, JSON.stringify(mapped, null, 2), 'utf8');
-  console.log(`Wrote ${mapped.length} items to ${outPath} (pages=${pages})`);
+  await fs.writeFile(outPath, JSON.stringify(items.map((f, i) => ({ id: i, name: f.name, desc: f.desc || '', link: f.link, source: 'WHO' })), null, 2), 'utf8');
+  console.log(`Wrote ${items.length} items to ${outPath} (pages=${pages})`);
 }

 main().catch(err => { console.error(err); process.exit(1); });