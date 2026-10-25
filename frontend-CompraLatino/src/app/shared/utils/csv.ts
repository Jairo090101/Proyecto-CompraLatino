/** Downloads a UTF-8 CSV. Cells are quoted so commas and accents survive Excel. */
export function downloadCsv(filename: string, headers: string[], rows: string[][]): void {
  const escape = (cell: string) => `"${cell.replaceAll('"', '""')}"`;
  const body = [headers, ...rows].map((row) => row.map((cell) => escape(String(cell))).join(',')).join('\n');
  const blob = new Blob([`\uFEFF${body}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
