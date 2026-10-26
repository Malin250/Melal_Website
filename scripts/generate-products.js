import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseInventoryFile } from '../server/services/excelService.js';
import { enrichProductsWithImages } from '../server/services/imageService.js';

const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const inventoryPath = path.join(projectRoot, 'data', 'inventory.xlsx');
const outputDirectory = path.join(projectRoot, 'public');
const outputPath = path.join(outputDirectory, 'products.json');
const products = enrichProductsWithImages(parseInventoryFile(inventoryPath));

fs.mkdirSync(outputDirectory, { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify({ products }));
console.log(`Generated ${products.length} products at ${outputPath}`);
