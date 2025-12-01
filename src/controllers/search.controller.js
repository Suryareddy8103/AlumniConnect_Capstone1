import fs from 'fs';
import path from 'path';

// Simple CSV parser that handles quoted fields with commas
function parseCsv(content) {
  const rows = [];
  let cur = '';
  let row = [];
  let inQuotes = false;
  for (let i = 0; i < content.length; i++) {
    const ch = content[i];
    if (ch === '"') {
      // If next is quote, it's an escaped quote
      if (inQuotes && content[i+1] === '"') {
        cur += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      row.push(cur);
      cur = '';
    } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
      // handle \r\n or single newline
      // If CRLF, skip the LF after CR
      if (ch === '\r' && content[i+1] === '\n') { i++; }
      row.push(cur);
      rows.push(row);
      row = [];
      cur = '';
    } else {
      cur += ch;
    }
  }
  // flush
  if (cur !== '' || row.length) {
    row.push(cur);
    rows.push(row);
  }
  return rows;
}

let csvData = null;

function loadCsvOnce() {
  if (csvData) return csvData;
  const csvPath = path.join(process.cwd(), 'alumni-search-system', 'alumni.csv');
  if (!fs.existsSync(csvPath)) {
    console.warn('CSV file not found at', csvPath);
    csvData = [];
    return csvData;
  }
  const content = fs.readFileSync(csvPath, 'utf8');
  const rows = parseCsv(content);
  if (!rows.length) { csvData = []; return csvData; }
  const headers = rows[0].map(h => h.trim());
  const records = rows.slice(1).map(r => {
    const obj = {};
    for (let i = 0; i < headers.length; i++) {
      obj[headers[i]] = (r[i] || '').trim();
    }
    return obj;
  });
  csvData = records;
  return csvData;
}

function filterBySkills(data, query, mode='or') {
  if (!query) return [];
  const tokens = query.split(/\s*,\s*|\s+/).filter(Boolean).map(t => t.toLowerCase());
  if (!tokens.length) return [];
  return data.filter(row => {
    const hay = Object.values(row).join(' ').toLowerCase();
    if (mode === 'and') return tokens.every(t => hay.includes(t));
    return tokens.some(t => hay.includes(t));
  });
}

export function searchCsv(req, res) {
  const { q = '', mode = 'or', limit = 1000, offset = 0 } = req.query;
  const data = loadCsvOnce();
  if (!q) return res.json({ total: 0, offset: 0, limit: Number(limit), count: 0, mode, query: q, data: [] });
  try {
    const filtered = filterBySkills(data, q, mode);
    const start = Number(offset) || 0;
    const end = start + Number(limit);
    const paginated = filtered.slice(start, end);
    return res.json({ total: filtered.length, offset: start, limit: Number(limit), count: paginated.length, mode, query: q, data: paginated });
  } catch (err) {
    console.error('searchCsv error', err);
    return res.status(500).json({ error: 'Search failed', message: String(err.message || err) });
  }
}
