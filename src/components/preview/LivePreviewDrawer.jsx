import { useState } from 'react';
import { FileText, Printer, X, FileSpreadsheet } from 'lucide-react';
import InvoiceA4 from './InvoiceA4';
import KwitansiA4 from './KwitansiA4';
import QuotationA4 from './QuotationA4';

export default function LivePreviewDrawer({ isOpen, onClose, formData, docMode, onPrint }) {
  const [paperSize, setPaperSize] = useState('a4'); // 'a4' | 'letter' | 'f4'

  if (!isOpen) return null;

  // Tangani cetak dengan mengatur ukuran kertas printer secara instan
  const handlePrintDocument = () => {
    let pageCss = 'A4 portrait';
    if (paperSize === 'letter') pageCss = 'letter portrait';
    if (paperSize === 'f4') pageCss = '215mm 330mm'; // Ukuran resmi F4 / Folio

    const style = document.createElement('style');
    style.id = 'dynamic-page-size';
    style.innerHTML = `@page { size: ${pageCss}; margin: 0; }`;
    document.head.appendChild(style);

    onPrint();

    setTimeout(() => {
      const existing = document.getElementById('dynamic-page-size');
      if (existing) existing.remove();
    }, 1000);
  };

  return (
    <aside className={`preview-drawer ${isOpen ? 'open' : ''}`} id="previewDrawer">
      <div className="drawer-header no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="drawer-header-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={18} />
          <h3>Live Preview Hasil Dokumen</h3>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* DROPDOWN PILIHAN UKURAN KERTAS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', background: '#1f2937', padding: '4px 8px', borderRadius: '6px' }}>
            <FileSpreadsheet size={15} style={{ color: '#3b82f6' }} />
            <span>Kertas:</span>
            <select
              value={paperSize}
              onChange={(e) => setPaperSize(e.target.value)}
              style={{
                background: '#111827',
                color: '#fff',
                border: '1px solid #374151',
                borderRadius: '4px',
                padding: '2px 6px',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              <option value="a4">A4 (210 x 297 mm)</option>
              <option value="letter">Letter (215.9 x 279.4 mm)</option>
              <option value="f4">F4 / Folio (215 x 330 mm)</option>
            </select>
          </div>

          <button type="button" className="btn-print-main" onClick={handlePrintDocument} style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
            <Printer size={14} /> Cetak Dokumen
          </button>
          <button type="button" className="btn-close-drawer" onClick={onClose}>
            <X size={14} /> Tutup
          </button>
        </div>
      </div>

      {/* BODY PREVIEW DENGAN CLASS DINAMIS SESUAI UKURAN KERTAS */}
      <div className={`drawer-body print-area paper-${paperSize}`}>
        {docMode === 'quotation' && (
          <QuotationA4 formData={formData} />
        )}

        {(docMode === 'both' || docMode === 'invoice') && (
          <InvoiceA4 formData={formData} />
        )}

        {docMode === 'both' && <div className="page-break"></div>}

        {(docMode === 'both' || docMode === 'kwitansi') && (
          <KwitansiA4 formData={formData} />
        )}
      </div>
    </aside>
  );
}