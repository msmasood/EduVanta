// certificate-print.ts — print utilities for certificates

/**
 * Triggers the browser print dialog scoped to the certificate area.
 * The @media print styles in globals.css handle hiding the dashboard chrome.
 */
export function printCertificate(): void {
  window.print();
}
