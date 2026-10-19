/**
 * Enterprise Cybersecurity & Data Protection Utilities
 * Compliant with India DPDP Act 2023, RBI Cyber Security Framework, and OWASP Top 10.
 */

/**
 * Mask Bank Account Number (Preserves only last 4 digits)
 * Example: '50100291827461' -> '•••• •••• 7461'
 */
export function maskAccountNumber(acc: string = ''): string {
  if (!acc) return '';
  const clean = String(acc).trim();
  if (clean.length <= 4) return clean;
  const last4 = clean.slice(-4);
  return `•••• •••• ${last4}`;
}

/**
 * Mask Income Tax PAN (Hides first 5 alphanumeric chars, reveals last 4 chars)
 * Example: 'ABCDE1234F' -> '•••••1234F'
 */
export function maskPanNumber(pan: string = ''): string {
  if (!pan) return '';
  const clean = String(pan).trim();
  if (clean.length <= 4) return clean;
  return `•••••${clean.slice(-4)}`;
}

/**
 * Mask 12-digit Indian Aadhaar Number
 * Example: '901234567890' -> '•••• •••• 7890'
 */
export function maskAadhaarNumber(aadhaar: string = ''): string {
  if (!aadhaar) return '';
  const clean = String(aadhaar).replace(/\D/g, '');
  if (clean.length <= 4) return clean;
  return `•••• •••• ${clean.slice(-4)}`;
}

/**
 * Neutralize CSV / Spreadsheet Formula Injection (CWE-1236)
 * Prepends a single quote (') if the field starts with '=', '+', '-', '@', or tab,
 * preventing MS Excel / LibreOffice / Google Sheets from executing arbitrary commands.
 */
export function sanitizeCsvField(value: any): string {
  if (value === null || value === undefined) return '';
  const str = String(value).trim();
  const dangerousChars = ['=', '+', '-', '@', '\t', '\r'];
  if (dangerousChars.some((char) => str.startsWith(char))) {
    return `'${str}`;
  }
  return str;
}

/**
 * Sanitize string for display (removes potential script tags or javascript pseudo-protocols)
 */
export function sanitizeText(input: string = ''): string {
  if (!input) return '';
  return String(input)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '');
}
