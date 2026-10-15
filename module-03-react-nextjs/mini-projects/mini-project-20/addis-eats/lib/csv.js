// CSV by RFC 4180, the format Excel, Google Sheets and LibreOffice all read:
//   - cells are separated by commas, rows end in CRLF
//   - a cell containing a comma, a double quote or a line break is wrapped in double quotes
//   - a double quote inside such a cell is written twice
// So   Bole, near Edna Mall        →  "Bole, near Edna Mall"         (one cell, not two)
//      Abebe "Abe" Bikila          →  "Abebe ""Abe"" Bikila"
//      Gate 2<newline>blue door    →  "Gate 2<newline>blue door"     (one row, not two)

// A cell starting with one of these is run as a formula by spreadsheets ("CSV injection").
// An apostrophe in front shows it as the text that was typed. Numbers are left as numbers.
const FORMULA_START = /^[=+\-@\t\r]/;
const NEEDS_QUOTES = /[",\r\n]/;

export function csvCell(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'number') return String(value);
  let text = String(value);
  if (FORMULA_START.test(text)) text = `'${text}`;
  return NEEDS_QUOTES.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

// columns: [{ header, value: (row) => cell }]. Returns the whole file as one string.
export function toCsv(columns, rows) {
  const lines = [columns.map((column) => csvCell(column.header)).join(',')];
  for (const row of rows) lines.push(columns.map((column) => csvCell(column.value(row))).join(','));
  return `${lines.join('\r\n')}\r\n`;
}

// A download response: UTF-8 with a byte-order mark first, so Excel doesn't garble "×" or an
// Amharic name; other spreadsheets ignore the mark.
export function csvResponse(csv, filename) {
  return new Response(`﻿${csv}`, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
