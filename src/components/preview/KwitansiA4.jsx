import { formatDateIndonesia, formatRupiah } from '../../utils/formatters';
import { terbilang } from '../../utils/terbilang';
import logoImg from '../../assets/logo.png';
import capImg from '../../assets/cap.png';
import ttdImg from '../../assets/ttd.png';

export default function KwitansiA4({ formData }) {
  // Helper Sanitasi Input Angka
  const parseNum = (val) => {
    if (!val || val === '-') return 0;
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  };

  // 1. Hitung Subtotal Kotor
  const subtotal = (formData.items || []).reduce(
    (acc, item) => acc + (parseNum(item.qty) * parseNum(item.price)),
    0
  );

  // 2. Potong Diskon Terlebih Dahulu (Wajib!) -> Mendapatkan Total Bersih Tagihan
  const discount = parseNum(formData.discount);
  const grandTotal = Math.max(0, subtotal - discount); // (25 Juta - 1 Juta = 24 Juta)

  // 3. Ambil DP & Settlement Input
  const dp = parseNum(formData.dp);
  const settlementInput = parseNum(formData.settlementAmount);

  // 4. PENENTUAN NOMINAL KWITANSI YANG SINKRON DENGAN INVOICE:
  let nominalKw = grandTotal;

  if (formData.paymentType === 'dp') {
    // Mode DP: Kwitansi mencatat penerimaan DP (misal Rp 10.000.000)
    nominalKw = dp;
  } else if (formData.paymentType === 'settlement') {
    // Mode Pelunasan: Kwitansi mencatat Sisa Pelunasan Bersih (24 Juta - 10 Juta = 14 Juta)
    nominalKw = settlementInput > 0 ? settlementInput : Math.max(0, grandTotal - dp);
  } else {
    // Mode Full Payment: Kwitansi mencatat Total Bersih (24 Juta)
    nominalKw = grandTotal;
  }

  // 5. Teks Terbilang Kwitansi 100% Mengikuti nominalKw
  const teksTerbilang = nominalKw > 0 ? `${terbilang(nominalKw)} Rupiah` : 'Nol Rupiah';

  // Pemisahan Teks Multiline Keterangan Pembayaran
  const paymentLines = (formData.forPayment || '').split('\n');

  const showSign = formData.signOption === 'both' || formData.signOption === 'sign_only' || formData.signOption === 'sign';
  const showStamp = formData.signOption === 'both' || formData.signOption === 'stamp_only' || formData.signOption === 'stamp';

  // FUNGSI UKURAN FONT OTOMATIS BERDASARKAN PANJANG TEKS TERBILANG
  const getDynamicFontSize = (text) => {
    const len = text ? text.length : 0;
    if (len > 85) return '0.78rem';
    if (len > 65) return '0.88rem';
    if (len > 45) return '1.02rem';
    if (len > 30) return '1.18rem';
    return '1.38rem';
  };

  return (
    <div id="kwitansiSection" className="kwitansi-box a4-page">
      <div className="kwitansi-header">
        <div className="kwitansi-brand-group">
          <div className="header-logo"><img src={logoImg} alt="Logo ZE" style={{ maxWidth: '75px', height: 'auto' }} /></div>
          <div className="kwitansi-brand-text">
            <strong>Zack Electric</strong><br />Equipment, Engineer & Installation<br />
            <span>Jln. Kalipasir Gg. Tembok No. 27 V, Menteng - Jakarta Pusat 10340<br />Phone : 021-391.7647, 980.99.982, Faxs : 021-314.4916, 8778.2486<br />email : zack_electric@yahoo.com</span>
          </div>
        </div>
        <div className="kwitansi-no-text">No. : <span>{formData.docNo}</span></div>
      </div>

      <div className="kwitansi-title">
        <h2>KWITANSI</h2>
        <span>OFFICIAL RECEIPT</span>
      </div>

      <div className="kwitansi-row">
        <div className="kwitansi-label"><span className="kwitansi-label-underline">TERIMA DARI</span><span>Received From</span></div>
        <div className="kwitansi-val font-bold" style={{ fontSize: '0.95rem' }}>{formData.customerName}</div>
      </div>

      <div className="kwitansi-row" style={{ margin: '15px 0' }}>
        <div className="kwitansi-label">
            <span className="kwitansi-label-underline">UANG SEBESAR</span>
            <span>The Sum of Rupiahs</span>
        </div>
        <div className="kwitansi-terbilang-container">
            <div 
            className="kwitansi-terbilang-text"
            style={{ fontSize: getDynamicFontSize(teksTerbilang) }}
            >
            # {teksTerbilang} #
            </div>
        </div>
        </div>

      <div className="kwitansi-row kwitansi-row-multiline">
        <div className="kwitansi-label"><span className="kwitansi-label-underline">UNTUK PEMBAYARAN</span><span>Being Payment For</span></div>
        <div className="kwitansi-multiline-container">
          {[0, 1, 2].map((idx) => (
            <div key={idx} className="kwitansi-line-item">
              <span className="kwitansi-line-text">{paymentLines[idx] || ''}</span>
              <div className="kwitansi-line-dots"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="kwitansi-bottom-container">
        <div className="kwitansi-bottom-left">
          <div className="kwitansi-jumlah-section">
            <div className="kwitansi-jumlah-top-border-thick"></div>
            <div className="kwitansi-jumlah-top-border-thin"></div>
            <div className="kwitansi-jumlah-inner-content">
              <div className="kwitansi-jumlah-label"><span className="kwitansi-label-underline">JUMLAH</span><span>Amount</span></div>
              <div style={{ fontWeight: 'bold', color: '#003399', fontSize: '1.1rem', marginRight: '5px' }}>Rp.</div>
              <div className="kwitansi-amount-parallelogram">
                <div className="kwitansi-amount-inner"># {formatRupiah(nominalKw)},- #</div>
              </div>
            </div>
            <div className="kwitansi-jumlah-bottom-border-thin"></div>
            <div className="kwitansi-jumlah-bottom-border-thick"></div>
          </div>
          <div className="kwitansi-bank-info">{formData.bankInfo}</div>
        </div>

        <div className="kwitansi-sign">
          <span>{formData.city || 'Jakarta'}</span>, <span>{formatDateIndonesia(formData.date)}</span><br />
          <strong style={{ fontStyle: 'normal' }}>Zack Electric</strong>
          <div className="signature-space">
            {showStamp && <img src={capImg} className="img-stamp" alt="Cap Zack Electric" />}
            {showSign && <img src={ttdImg} className="img-sign" alt="Tanda Tangan Zakaria" />}
          </div>
          ( ................. <strong>Z A K A R I A</strong> ................. )
        </div>
      </div>

      <div className="kwitansi-footer-note">
        ~ KWITANSI INI ADALAH SAH, APABILA CEK/GIRO YANG DITITIPKAN DAPAT DICAIRKAN/DIUANGKAN ~
      </div>
    </div>
  );
}
