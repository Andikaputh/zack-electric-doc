// UTILS TERBILANG INDONESIA (FIX SPASI PULUHAN, RATUSAN, RIBU, JUTA)

export function terbilang(angka) {
  const bil = [
    '',
    'Satu',
    'Dua',
    'Tiga',
    'Empat',
    'Lima',
    'Enam',
    'Tujuh',
    'Delapan',
    'Sembilan',
    'Sepuluh',
    'Sebelas',
  ];

  let num = Math.floor(Math.abs(Number(angka) || 0));
  if (num === 0) return 'Nol';

  const helper = (n) => {
    if (n < 12) {
      return bil[n];
    }
    if (n < 20) {
      return (helper(n - 10) + ' Belas').trim();
    }
    if (n < 100) {
      const sisa = n % 10;
      return (helper(Math.floor(n / 10)) + ' Puluh ' + (sisa ? bil[sisa] : '')).trim();
    }
    if (n < 200) {
      const sisa = n - 100;
      return ('Seratus ' + (sisa ? helper(sisa) : '')).trim();
    }
    if (n < 1000) {
      const sisa = n % 100;
      return (helper(Math.floor(n / 100)) + ' Ratus ' + (sisa ? helper(sisa) : '')).trim();
    }
    if (n < 2000) {
      const sisa = n - 1000;
      return ('Seribu ' + (sisa ? helper(sisa) : '')).trim();
    }
    if (n < 1000000) {
      const sisa = n % 1000;
      return (helper(Math.floor(n / 1000)) + ' Ribu ' + (sisa ? helper(sisa) : '')).trim();
    }
    if (n < 1000000000) {
      const sisa = n % 1000000;
      return (helper(Math.floor(n / 1000000)) + ' Juta ' + (sisa ? helper(sisa) : '')).trim();
    }
    if (n < 1000000000000) {
      const sisa = n % 1000000000;
      return (helper(Math.floor(n / 1000000000)) + ' Miliar ' + (sisa ? helper(sisa) : '')).trim();
    }
    return '';
  };

  // Bersihkan spasi ganda jika ada
  return helper(num).replace(/\s+/g, ' ').trim();
}