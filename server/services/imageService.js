import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const imageMapPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../data/productImageMap.json'
);
const productImageMap = JSON.parse(fs.readFileSync(imageMapPath, 'utf8'));

function normalizeName(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function determineImageCategory(product) {
  const name = normalizeName(product?.name);
  const category = normalizeName(product?.category);

  if (category.includes('drink') || category.includes('beverage')) return 'beverage';
  if (category.includes('snack') || category.includes('biscuit')) return 'snack';
  if (/drink|cola|water|juice|soda|milk|energy|tonic|syrup/.test(name)) return 'beverage';
  if (/biscuit|cookie|chips|crisps|chocolate|nuts|sweet|candy/.test(name)) return 'snack';
  return 'general';
}

function determineImageType(product, imageCategory) {
  const name = normalizeName(product?.name);
  if (imageCategory === 'beverage') {
    if (/water|eau/.test(name)) return 'water';
    if (/milk/.test(name)) return 'milk';
    if (/energy|tonic|champ/.test(name)) return 'energy-drink';
    if (/syrup/.test(name)) return 'syrup';
    return 'beverage';
  }
  if (imageCategory === 'snack') {
    if (/pringles|chips|crisps/.test(name)) return 'crisps';
    if (/chocolate|cadbury|bournville|fullbar/.test(name)) return 'chocolate';
    if (/nuts|groundnut|cashew|almond|macadamia|sesame/.test(name)) return 'nuts';
    if (/sweet|mint|candy/.test(name)) return 'candy';
    return 'biscuit';
  }
  return 'general';
}

export function getProductImageProfile(product) {
  const imageCategory = determineImageCategory(product);
  return {
    imageCategory,
    imageType: determineImageType(product, imageCategory)
  };
}

export function getProductImageMatch(product) {
  const key = normalizeName(product?.name);
  const match = productImageMap[key];
  const profile = getProductImageProfile(product);

  return {
    ...profile,
    imageUrl: match?.imageUrl || null,
    imageStatus: match?.match || 'missing',
    imageSource: match?.source || ''
  };
}

export function enrichProductsWithImages(products) {
  if (!Array.isArray(products)) return [];

  return products.map((product) => ({
    ...product,
    ...getProductImageMatch(product)
  }));
}
