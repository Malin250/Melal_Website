import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { PORT } from './config.js';
import { getProducts } from './services/excelService.js';
import { enrichProductsWithImages } from './services/imageService.js';
import {
  getWhatsAppStatus,
  sendOwnerWhatsAppMessage
} from './services/whatsappService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: '*'
  })
);
app.use(express.json());

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../dist')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'boutique-la-difference-api' });
});

function applyFiltersAndSorting(products, query) {
  const { category, company, sort, order } = query;

  let result = [...products];

  if (category) {
    const catLower = String(category).toLowerCase();
    result = result.filter((p) => p.category && p.category.toLowerCase() === catLower);
  }

  if (company) {
    const compLower = String(company).toLowerCase();
    result = result.filter((p) => p.company && p.company.toLowerCase() === compLower);
  }

  const sortKey = sort && ['company', 'category', 'price'].includes(sort) ? sort : null;
  const sortOrder = order === 'desc' ? 'desc' : 'asc';

  if (sortKey) {
    result.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];

      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;

      if (typeof av === 'number' && typeof bv === 'number') {
        return sortOrder === 'asc' ? av - bv : bv - av;
      }

      const aStr = String(av).toLowerCase();
      const bStr = String(bv).toLowerCase();
      if (aStr < bStr) return sortOrder === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return result;
}

app.get('/api/products', async (req, res) => {
  try {
    const baseProducts = getProducts();
    const withImages = enrichProductsWithImages(baseProducts);
    const processed = applyFiltersAndSorting(withImages, req.query);

    // Debug log for API response size
    // eslint-disable-next-line no-console
    console.log('[server] /api/products count:', processed.length);
    res.json({ products: processed });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error loading products', error);
    res.status(500).json({ error: 'Failed to load products from inventory.' });
  }
});

app.post('/api/notify-owner', async (req, res) => {
  const { items, totalPrice, totalProfit } = req.body || {};

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'No items provided.' });
  }

  const lines = [
    '🔔 *New Order Received*',
    '',
    '📦 *Items:*'
  ];

  items.forEach((item) => {
    const lineTotal = Number(item.price) > 0
      ? ` — RWF ${(Number(item.price) * item.qty).toLocaleString()}`
      : '';
    lines.push(`  • ${item.name} × ${item.qty}${lineTotal}`);
  });

  lines.push('');
  if (Number(totalPrice) > 0) {
    lines.push(`💰 *Revenue:* RWF ${Number(totalPrice).toLocaleString()}`);
  }
  if (Number(totalProfit) > 0) {
    lines.push(`📈 *Profit:*  RWF ${Number(totalProfit).toLocaleString()}`);
  }
  lines.push('', '— Boutique La Difference POS');

  const messageBody = lines.join('\n');

  try {
    const messageId = await sendOwnerWhatsAppMessage(messageBody);
    return res.json({ ok: true, messageId });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[notify-owner] whatsapp-web.js send error:', err);
    return res.status(503).json({
      error: 'Failed to send WhatsApp notification.',
      detail: err?.message || 'unknown_error'
    });
  }
});

app.get('/api/whatsapp/status', (req, res) => {
  res.json(getWhatsAppStatus());
});

// Any other request that doesn't match an API route should serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on http://localhost:${PORT}`);
});

