import { getCustomerDatabase } from './customerDb';

// KONVERSI ANGKA BULAN KE ROMAWI
export function toRomanMonth(monthIndex) {
  const romanMonths = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
  return romanMonths[monthIndex] || "I";
}

// FORMAT TANGGAL INDONESIA (Contoh: 22 Mei 2026)
export function formatDateIndonesia(dateObj) {
  if (!dateObj) return '';
  const date = typeof dateObj === 'string' ? new Date(dateObj) : dateObj;
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

// GENERATE OTOMATIS NOMOR INVOICE
export function generateFullInvoiceNumber(seqNum = '1473', customerSelectId = 'sdia20', dateVal = '') {
  const db = getCustomerDatabase();
  const currentCust = db.find(c => c.id === customerSelectId) || db[0];
  const clientCode = currentCust ? currentCust.code : "SDIA20";

  let romanMonth = "V";
  let shortYear = "26";

  if (dateVal) {
    const dateObj = new Date(dateVal);
    romanMonth = toRomanMonth(dateObj.getMonth());
    shortYear = String(dateObj.getFullYear()).slice(-2);
  } else {
    const today = new Date();
    romanMonth = toRomanMonth(today.getMonth());
    shortYear = String(today.getFullYear()).slice(-2);
  }

  return `${seqNum}/ZE-${clientCode}/${romanMonth}/${shortYear}`;
}