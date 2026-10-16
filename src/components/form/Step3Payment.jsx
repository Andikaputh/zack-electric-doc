import { CreditCard, ArrowLeft, Eye } from 'lucide-react';
import { formatNumberWithDots, parseFormattedNumber } from '../../utils/formatters';

export default function Step3Payment({ formData, setFormData, onPrev, onTogglePreview }) {
  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Kalkulasi otomatis Sisa Pelunasan agar selalu pas (Subtotal - Diskon - DP)
      const subtotal = (prev.items || []).reduce((acc, item) => {
        const q = Number(item.qty) || 1;
        const p = Number(item.price) || 0;
        if (p > 0) return acc + (q * p);

        const subDetails = item.details || [];
        const subTotal = subDetails.reduce((sum, d) => {
          if (typeof d === 'object') {
            return sum + ((Number(d.qty) || 1) * (Number(d.price) || 0));
          }
          return sum;
        }, 0);

        return acc + subTotal;
      }, 0);

      const discount = Number(field === 'discount' ? value : prev.discount) || 0;
      const dp = Number(field === 'dp' ? value : prev.dp) || 0;
      const grandTotal = Math.max(0, subtotal - discount);

      // Jika memilih skema Pelunasan, hitung otomatis nilai sisa tagihannya
      if (field === 'paymentType' && value === 'settlement') {
        updated.settlementAmount = Math.max(0, grandTotal - dp);
      } else if (field === 'discount' || field === 'dp') {
        if (prev.paymentType === 'settlement') {
          updated.settlementAmount = Math.max(0, grandTotal - dp);
        }
      }

      return updated;
    });
  };

  return (
    <div className="card-panel">
      <div className="card-header">
        <div className="card-header-title">
          <CreditCard size={18} />
          <h3>Pembayaran & Otorisasi Dokumen</h3>
        </div>
      </div>

      <div className="card-body">
        {/* PILIHAN MODE PEMBAYARAN */}
        <div className="form-group">
          <label htmlFor="paymentType" className="bold">Skema / Tipe Pembayaran Kwitansi</label>
          <select
            id="paymentType"
            value={formData.paymentType || 'full'}
            onChange={(e) => handleChange('paymentType', e.target.value)}
            style={{ fontWeight: 'bold', color: '#3b82f6' }}
          >
            <option value="full">1. Pelunasan Langsung (Full Payment 100%)</option>
            <option value="dp">2. Pembayaran Uang Muka (DP Pertama)</option>
            <option value="settlement">3. Pembayaran Pelunasan Sisa (Tahap Akhir)</option>
          </select>
        </div>

        <div className="form-grid-2" style={{ marginTop: '15px' }}>
          {/* DISKON DENGAN FORMATTER TITIK */}
          <div className="form-group">
            <label htmlFor="discount">Diskon / Potongan Harga (Rp)</label>
            <input
              type="text"
              id="discount"
              placeholder="0"
              value={formatNumberWithDots(formData.discount)}
              onChange={(e) => handleChange('discount', parseFormattedNumber(e.target.value))}
            />
          </div>

          {/* INPUT DP DENGAN FORMATTER TITIK */}
          {(formData.paymentType === 'dp' || formData.paymentType === 'settlement') && (
            <div className="form-group">
              <label htmlFor="dp">Nominal DP / Uang Muka Sebelumnya (Rp)</label>
              <input
                type="text"
                id="dp"
                placeholder="0"
                value={formatNumberWithDots(formData.dp)}
                onChange={(e) => handleChange('dp', parseFormattedNumber(e.target.value))}
              />
            </div>
          )}

          {/* INPUT SISA PELUNASAN DENGAN FORMATTER TITIK */}
          {formData.paymentType === 'settlement' && (
            <div className="form-group">
              <label htmlFor="settlementAmount">Nominal Sisa Pelunasan (Rp)</label>
              <input
                type="text"
                id="settlementAmount"
                placeholder="0"
                value={formatNumberWithDots(formData.settlementAmount)}
                onChange={(e) => handleChange('settlementAmount', parseFormattedNumber(e.target.value))}
              />
            </div>
          )}
        </div>

        <div className="form-group" style={{ marginTop: '15px' }}>
          <label htmlFor="forPayment">Untuk Pembayaran (Keterangan Kwitansi)</label>
          <textarea
            id="forPayment"
            rows="3"
            value={formData.forPayment}
            onChange={(e) => handleChange('forPayment', e.target.value)}
            placeholder="Ketik rincian tujuan pembayaran..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="bankInfo">Info Rekening Bank / Catatan</label>
          <input
            type="text"
            id="bankInfo"
            value={formData.bankInfo}
            onChange={(e) => handleChange('bankInfo', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="signOption">Pilihan Otorisasi TTD & Stempel</label>
          <select
            id="signOption"
            value={formData.signOption}
            onChange={(e) => handleChange('signOption', e.target.value)}
          >
            <option value="both">Lengkap (Tanda Tangan & Cap Stempel)</option>
            <option value="sign_only">Hanya Tanda Tangan</option>
            <option value="stamp_only">Hanya Cap Stempel</option>
            <option value="none">Kosongkan (Cetak Manual)</option>
          </select>
        </div>
      </div>

      <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button type="button" className="btn-step-nav prev" onClick={onPrev}>
          <ArrowLeft size={16} /> Kembali
        </button>
        <button type="button" className="btn-step-nav next" onClick={onTogglePreview}>
          <Eye size={16} /> Buka Live Preview (A4)
        </button>
      </div>
    </div>
  );
}