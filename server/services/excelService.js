import fs from 'node:fs';
import xlsx from 'xlsx';
import { INVENTORY_FILE_PATH } from '../config.js';

let productsCache = null;
let lastLoadedAt = 0;
const CACHE_TTL_MS = 5 * 60 * 1000;

function normalizeWhitespace(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

function stripWeightUnits(text) {
  const withoutUnits = String(text || '').replace(
    /\b\d+(\.\d+)?\s*(kg|g|grams?|ml|l|liters?|litres?|pcs?|pieces?|pack|packs|bottle|bottles|bag|bags|sachet|sachets)\b/gi,
    ' '
  );
  return normalizeWhitespace(withoutUnits);
}

function normalizeCompanyFromName(name) {
  const cleaned = normalizeWhitespace(name);
  if (!cleaned) return 'Generic';
  const firstWord = cleaned.split(/\s+/)[0] || 'Generic';
  const lower = firstWord.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function normalizeCategoryFromSheetName(sheetName) {
  if (!sheetName) return 'General';
  let cleaned = sheetName.replace(/&/g, ' & ');
  cleaned = cleaned.replace(/([a-z])([A-Z])/g, '$1 $2');
  cleaned = cleaned.replace(/\s+/g, ' ');
  cleaned = cleaned.toLowerCase().trim();
  if (!cleaned) return 'General';
  return cleaned
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function normalizeHeaderLabel(value) {
  return normalizeWhitespace(String(value || '')).toLowerCase().replace(/[^a-z0-9]+/g, ' ');
}

function parseNumericValue(value) {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;

  const numericText = String(value).replace(/[RWF\s,]/g, '').replace(/[()]/g, '');
  const parsed = Number(numericText);
  return Number.isFinite(parsed) ? parsed : 0;
}

function isNonProductRow(row) {
  if (!Array.isArray(row) || row.length === 0) {
    return true;
  }

  const text = normalizeWhitespace(row.join(' ')).toLowerCase();
  if (!text) return true;
  if (text.includes('out of stock form')) return true;
  if (text.includes('report') && text.includes('date')) return true;
  if (text.includes('inventory list')) return true;
  if (text.includes('code') && text.includes('product')) return true;
  return false;
}

function findHeaderIndex(rawRows) {
  const productAliases = [
    'product name',
    'product',
    'item name',
    'item',
    'name'
  ];

  return rawRows.findIndex((row) => {
    if (!Array.isArray(row)) return false;
    const normalized = row.map((cell) => normalizeHeaderLabel(cell));
    return normalized.some((cell) => productAliases.includes(cell));
  });
}

function buildHeaderMap(headerRow) {
  const map = {};
  if (!Array.isArray(headerRow)) {
    return map;
  }

  headerRow.forEach((cell, index) => {
    const normalized = normalizeHeaderLabel(cell);
    if (!normalized) return;
    if (!map[normalized]) {
      map[normalized] = index;
    }
  });

  return map;
}

function getRowValue(row, headerMap, aliases) {
  for (const alias of aliases) {
    const index = headerMap[alias];
    if (index !== undefined && row[index] !== undefined) {
      return row[index];
    }
  }

  return '';
}

export function parseInventoryFile(filePath = INVENTORY_FILE_PATH) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Inventory file not found at ${filePath}`);
  }

  const workbook = xlsx.readFile(filePath);

  const allProducts = [];
  let idCounter = 1;

  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) return;

    const category = normalizeCategoryFromSheetName(sheetName);

    const rawRows = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: '' });
    const headerIndex = findHeaderIndex(rawRows);

    if (headerIndex === -1) {
      // eslint-disable-next-line no-console
      console.warn(`[excelService] Skipping sheet "${sheetName}" because no header row was found.`);
      return;
    }

    const headerRow = rawRows[headerIndex] || [];
    const headerMap = buildHeaderMap(headerRow);

    rawRows.slice(headerIndex + 1).forEach((row) => {
      if (!Array.isArray(row) || isNonProductRow(row)) {
        return;
      }

      const rawName = getRowValue(row, headerMap, [
        'product name',
        'product',
        'item name',
        'item',
        'name'
      ]);

      const rawQuantity = getRowValue(row, headerMap, [
        'quantity',
        'qty',
        'stock',
        'available quantity',
        'available qty',
        'units'
      ]);

      const rawPrice = getRowValue(row, headerMap, [
        'price',
        'selling price',
        'unit price',
        'amount',
        'rate'
      ]);

      const rawCostPrice = getRowValue(row, headerMap, [
        'cost price',
        'cost',
        'buying price',
        'buy price',
        'purchase price',
        'unit cost'
      ]);

      const nameClean = normalizeWhitespace(rawName);
      if (!nameClean) {
        return;
      }

      if (nameClean.toLowerCase().includes('out of stock')) {
        return;
      }

      const company = normalizeCompanyFromName(nameClean);

      const price = parseNumericValue(rawPrice);
      const quantity = parseNumericValue(rawQuantity);
      const costPrice = parseNumericValue(rawCostPrice);

      allProducts.push({
        id: idCounter++,
        name: nameClean,
        company,
        category,
        price,
        quantity,
        costPrice
      });
    });
  });

  // Debug log – total and first sample
  // eslint-disable-next-line no-console
  console.log('[excelService] Parsed products count:', allProducts.length);
  if (allProducts.length > 0) {
    // eslint-disable-next-line no-console
    console.log('[excelService] Sample product:', allProducts[0]);
  }

  return allProducts;
}

export function getProducts() {
  const now = Date.now();
  if (productsCache && now - lastLoadedAt < CACHE_TTL_MS) {
    return productsCache;
  }

  const parsed = parseInventoryFile();
  productsCache = parsed;
  lastLoadedAt = now;
  return parsed;
}

