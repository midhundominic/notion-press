import Papa from "papaparse";

export type Row = Record<string, string>;

export function parseCsv(
  file: File
): Promise<{ data: Row[]; headers: string[] }> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      worker: true,
      dynamicTyping: false,
      complete: (results) => {
        const data = results.data as Row[];
        const headers = results.meta.fields ?? [];
        resolve({ data, headers });
      },
      error: (err) => reject(err),
    });
  });
}

export function toCsv(rows: Row[], headers: string[]): string {
  const arr = [headers];
  for (const r of rows) {
    arr.push(headers.map((h) => r[h] ?? ""));
  }
  return Papa.unparse({ fields: headers, data: rows });
}
