// Format Angka ke Rupiah (misal: 1500000 -> 1.500.000)
export const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID').format(number || 0);
};

// Format tanggal menjadi date-month-year (misal: 2026-10-12 -> 12-10-2026)
export const formatDateIndonesia = (dateString) => {
  if (!dateString) return '';

  // Input dari <input type="date"> berbentuk YYYY-MM-DD. Memecah string secara
  // langsung mencegah tanggal bergeser karena konversi zona waktu oleh Date.
  const isoDateMatch = String(dateString).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoDateMatch) {
    const [, year, month, day] = isoDateMatch;
    return `${day}-${month}-${year}`;
  }

  const date = dateString instanceof Date ? dateString : new Date(dateString);
  if (Number.isNaN(date.getTime())) return String(dateString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}-${month}-${date.getFullYear()}`;
};

// Memformat angka dengan pemisah ribuan titik (contoh: 26500000 -> "26.500.000")
export const formatNumberWithDots = (val) => {
  if (val === undefined || val === null || val === '') return '';
  const numStr = String(val).replace(/\D/g, ''); // Hapus semua karakter non-angka
  if (!numStr) return '';
  return new Intl.NumberFormat('id-ID').format(Number(numStr));
};

// Mengubah string ber-titik kembali menjadi number murni (contoh: "26.500.000" -> 26500000)
export const parseFormattedNumber = (str) => {
  if (!str) return 0;
  const rawNum = String(str).replace(/\./g, '').replace(/\D/g, '');
  return rawNum ? Number(rawNum) : 0;
};
