// Run with: npm test
import assert from "node:assert/strict";
import { test } from "node:test";
import { toCsv } from "./csv.js";

const columns = [
  { label: "Customer", value: (row) => row.name },
  { label: "Notes", value: (row) => row.notes },
  { label: "Total (ETB)", value: (row) => row.total },
];

// A minimal RFC 4180 reader, written separately from toCsv, to prove the file reads back as the
// same cells: what a spreadsheet would do when it opens the download.
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') (field += '"'), i++;
      else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === ",") row.push(field), (field = "");
    else if (char === "\r" && text[i + 1] === "\n") row.push(field), rows.push(row), (row = []), (field = ""), i++;
    else field += char;
  }
  return rows;
}

test("a value with a comma is quoted and stays in one cell", () => {
  const csv = toCsv(columns, [{ name: "Sara", notes: "Gate 2, blue door", total: 450 }]);
  assert.equal(csv, 'Customer,Notes,Total (ETB)\r\nSara,"Gate 2, blue door",450\r\n');
  assert.deepEqual(parseCsv(csv)[1], ["Sara", "Gate 2, blue door", "450"]);
});

test("a value with a quotation mark has its quotes doubled", () => {
  const csv = toCsv(columns, [{ name: 'Abebe "Abe" Bikila', notes: "", total: 900 }]);
  assert.equal(csv.split("\r\n")[1], '"Abebe ""Abe"" Bikila",,900');
  assert.deepEqual(parseCsv(csv)[1], ['Abebe "Abe" Bikila', "", "900"]);
});

test("commas, quotes and a line break together still read back exactly", () => {
  const notes = 'Ask for "Hana", 3rd floor\nCall on arrival';
  const csv = toCsv(columns, [{ name: "Hana", notes, total: 1200 }]);
  assert.deepEqual(parseCsv(csv), [["Customer", "Notes", "Total (ETB)"], ["Hana", notes, "1200"]]);
});

test("text that looks like a formula is made plain text", () => {
  const csv = toCsv(columns, [{ name: "=HYPERLINK(\"http://evil\")", notes: "+251 911", total: 0 }]);
  assert.deepEqual(parseCsv(csv)[1], ["'=HYPERLINK(\"http://evil\")", "'+251 911", "0"]);
});
