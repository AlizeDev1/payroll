/**
 * Client-side file download utility with automatic Blob trigger
 * Works offline in mock mode and online with API streaming
 */
export function triggerFileDownload(filename: string, content: string, mimeType = 'text/csv;charset=utf-8;'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

/**
 * Download tabular dataset as formatted CSV file
 */
export function exportToCsv(filename: string, headers: string[], rows: (string | number)[][]): void {
  const csvRows: string[] = [];
  // Add header
  csvRows.push(headers.map((h) => `"${String(h).replace(/"/g, '""')}"`).join(','));

  // Add data rows
  for (const row of rows) {
    csvRows.push(row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','));
  }

  const csvContent = '\uFEFF' + csvRows.join('\r\n'); // Add UTF-8 BOM for Excel compatibility
  triggerFileDownload(filename, csvContent, 'text/csv;charset=utf-8;');
}
