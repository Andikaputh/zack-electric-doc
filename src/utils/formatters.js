// Format Angka ke Rupiah (misal: 1500000 -> 1.500.000)
export const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID').format(number || 0);
};

// Format Tanggal Indonesia (misal: 2026-10-12 -> 12 Oktober 2026)
export const formatDateIndonesia = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
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