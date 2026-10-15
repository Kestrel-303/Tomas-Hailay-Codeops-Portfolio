// Builds CSV text by RFC 4180's rules, the ones Excel, Google Sheets and LibreOffice all read:
//   - fields are separated by commas and rows end in CRLF
//   - a field containing a comma, a double quote or a line break is wrapped in double quotes
//   - a double quote inside a field is written twice:  Abebe "Abe"  →  "Abebe ""Abe"""
// Without this, "Gate 2, blue door" would split into two columns and shift every cell after it.
function escapeField(value) {
  if (value === null || value === undefined) return "";
  let text = String(value);
  // A text cell starting with = + - or @ is run as a formula by spreadsheets ("CSV injection").
  // A leading apostrophe makes it plain text. Numbers are left alone, so totals stay numbers.
  if (typeof value === "string" && /^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

// columns: [{ label, value: (row) => ... }]. Returns the whole file as one string.
export function toCsv(columns, rows) {
  const lines = [columns.map((column) => escapeField(column.label))];
  for (const row of rows) lines.push(columns.map((column) => escapeField(column.value(row))));
  return lines.map((cells) => cells.join(",")).join("\r\n") + "\r\n";
}
