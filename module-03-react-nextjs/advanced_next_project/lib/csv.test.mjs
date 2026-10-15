// Run with: npm test
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { csvCell, toCsv } from './csv.js';

// A separate RFC 4180 reader, so the round trip checks what a spreadsheet would actually see,
// not what csv.js thinks it wrote.
function readCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') {
      row.push(cell);
      cell = '';
    } else if (c === '\r' && text[i + 1] === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
      i++;
    } else cell += c;
  }
  return rows;
}

const columns = [
  { header: 'Name', value: (r) => r.name },
  { header: 'Address', value: (r) => r.address },
  { header: 'Total (ETB)', value: (r) => r.total },
];

test('a comma stays in its cell', () => {
  assert.equal(csvCell('Bole, near Edna Mall'), '"Bole, near Edna Mall"');
  const [, row] = readCsv(toCsv(columns, [{ name: 'Sara', address: 'Bole, near Edna Mall', total: 450 }]));
  assert.deepEqual(row, ['Sara', 'Bole, near Edna Mall', '450']);
});

test('quotation marks are doubled and come back single', () => {
  assert.equal(csvCell('Abebe "Abe" Bikila'), '"Abebe ""Abe"" Bikila"');
  const [, row] = readCsv(toCsv(columns, [{ name: 'Abebe "Abe" Bikila', address: '', total: 900 }]));
  assert.deepEqual(row, ['Abebe "Abe" Bikila', '', '900']);
});

test('a line break stays inside one row', () => {
  const address = 'Gate 2, "blue door"\nCall on arrival';
  const rows = readCsv(toCsv(columns, [{ name: 'Hana', address, total: 1200 }]));
  assert.equal(rows.length, 2);
  assert.deepEqual(rows[1], ['Hana', address, '1200']);
});

test('formula-looking text is made plain text; numbers stay numbers', () => {
  assert.equal(csvCell('=HYPERLINK("http://x")'), '"\'=HYPERLINK(""http://x"")"');
  assert.equal(csvCell('+251911000000'), "'+251911000000");
  assert.equal(csvCell(-5), '-5');
});
