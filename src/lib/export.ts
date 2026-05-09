/**
 * CSV export utilities for the DataTable export feature.
 * All functions are pure / side-effect-free except downloadCsv.
 */

export interface CsvColumn {
  /** Key path used to read the value from each row object. */
  accessorKey: string;
  /** Column header text written to the CSV header row. */
  header: string;
}

/**
 * Escape a single cell value for safe inclusion in a CSV field.
 * Wraps in double-quotes and escapes internal double-quotes when the value
 * contains a comma, double-quote, or newline character.
 */
export function escapeCsvValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Convert an array of objects to a CSV string with header row.
 * Only the columns described in the `columns` array are included.
 * React nodes and functions are skipped (output as empty string).
 */
export function objectsToCsv<T extends Record<string, unknown>>(
  rows: T[],
  columns: CsvColumn[]
): string {
  const header = columns.map((col) => escapeCsvValue(col.header)).join(",");
  const dataRows = rows.map((row) =>
    columns
      .map((col) => {
        const val = row[col.accessorKey];
        // Skip React nodes and functions — they cannot be serialised to CSV
        if (typeof val === "function") return "";
        if (typeof val === "object" && val !== null && "$$typeof" in val)
          return "";
        return escapeCsvValue(val);
      })
      .join(",")
  );
  return [header, ...dataRows].join("\n");
}

/**
 * Trigger a browser download of the given CSV string.
 * Creates a temporary <a> element, clicks it, then removes it.
 */
export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * All-in-one helper: convert rows to CSV and trigger a browser download.
 */
export function exportRowsToCsv<T extends Record<string, unknown>>(
  rows: T[],
  columns: CsvColumn[],
  filename: string
): void {
  const csv = objectsToCsv(rows, columns);
  downloadCsv(filename, csv);
}
