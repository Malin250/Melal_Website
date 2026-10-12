import { resolve } from 'node:path';
import { enrichProductsWithShadowImages } from '../../server/services/imageService.js';
import { parseInventoryFile } from '../../server/services/excelService.js';

const inventoryPath = resolve(process.cwd(), 'data/inventory.xlsx');
let cachedProducts;

function filterProducts(products, searchParams) {
  const category = searchParams.get('category')?.toLowerCase();
  const company = searchParams.get('company')?.toLowerCase();
  const sort = ['company', 'category', 'price'].includes(searchParams.get('sort'))
    ? searchParams.get('sort')
    : null;
  const descending = searchParams.get('order') === 'desc';

  let result = products.filter((product) => {
    return (!category || product.category?.toLowerCase() === category)
      && (!company || product.company?.toLowerCase() === company);
  });

  if (sort) {
    result = [...result].sort((first, second) => {
      const firstValue = first[sort];
      const secondValue = second[sort];
      const comparison = typeof firstValue === 'number' && typeof secondValue === 'number'
        ? firstValue - secondValue
        : String(firstValue ?? '').toLowerCase().localeCompare(String(secondValue ?? '').toLowerCase());
      return descending ? -comparison : comparison;
    });
  }

  return result;
}

export default async function handler(request) {
  try {
    if (!cachedProducts) {
      cachedProducts = enrichProductsWithShadowImages(parseInventoryFile(inventoryPath));
    }

    const products = filterProducts(cachedProducts, new URL(request.url).searchParams);
    return new Response(JSON.stringify({ products }), {
      headers: { 'content-type': 'application/json; charset=utf-8' }
    });
  } catch (error) {
    console.error('[products function] Failed to load inventory:', error);
    return new Response(JSON.stringify({ error: 'Failed to load products from inventory.' }), {
      status: 500,
      headers: { 'content-type': 'application/json; charset=utf-8' }
    });
  }
}