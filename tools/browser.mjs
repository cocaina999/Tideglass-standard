// Launches the local Chrome, Chromium or Edge through puppeteer-core (a dev dependency).
// Used by `npm run smoke` and `npm run shots`. Set CHROME_PATH to pick a browser.

import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';
import { ROOT } from './lib.mjs';

const CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);

export async function launch() {
  let puppeteer;
  try {
    puppeteer = (await import('puppeteer-core')).default;
  } catch {
    console.error('puppeteer-core is missing. Run `npm install` first.');
    process.exit(1);
  }
  const executablePath = CANDIDATES.find(p => existsSync(p));
  if (!executablePath) {
    console.error('No Chrome, Chromium or Edge found. Set CHROME_PATH.');
    process.exit(1);
  }
  return puppeteer.launch({ executablePath, headless: true, args: ['--hide-scrollbars', '--no-sandbox'] });
}

export const pageUrl = (file, query = '') => pathToFileURL(join(ROOT, file)).href + (query ? `?${query}` : '');

// Opens a page and collects anything that went wrong while it ran.
export async function open(browser, file, { query = '', width = 390, height = 844, scale = 1, media = [] } = {}) {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(`pageerror: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });
  page.on('requestfailed', r => errors.push(`requestfailed: ${r.url()}`));
  await page.setViewport({ width, height, deviceScaleFactor: scale });
  if (media.length) await page.emulateMediaFeatures(media);
  await page.goto(pageUrl(file, query), { waitUntil: 'load' });
  return { page, errors };
}

export const wait = ms => new Promise(r => setTimeout(r, ms));
