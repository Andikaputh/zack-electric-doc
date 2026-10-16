import { Eye, Printer } from 'lucide-react';

export default function Navbar({ docMode, setDocMode, onTogglePreview, onPrint }) {
  return (
    <header className="top-navbar no-print">
      <div className="brand-group">
        <div className="brand-text">
          <h1>ZACK ELECTRIC</h1>
          <span className="brand-subtext">Document Generator & Management Workspace</span>
        </div>
      </div>

      {/* MODE DOKUMEN CETAK SWITCHER */}
      <div className="doc-mode-selector">
        <span className="selector-label">Format Cetak:</span>
        <div className="btn-group-pill">
          <button
            type="button"
            className={`pill-btn ${docMode === 'both' ? 'active' : ''}`}
            onClick={() => setDocMode('both')}
          >
            Invoice & Kwitansi
          </button>
          <button
            type="button"
            className={`pill-btn ${docMode === 'quotation' ? 'active' : ''}`}
            onClick={() => setDocMode('quotation')}
          >
            Quotation (Penawaran)
          </button>
          <button
            type="button"
            className={`pill-btn ${docMode === 'invoice' ? 'active' : ''}`}
            onClick={() => setDocMode('invoice')}
          >
            Invoice Saja
          </button>
          <button
            type="button"
            className={`pill-btn ${docMode === 'kwitansi' ? 'active' : ''}`}
            onClick={() => setDocMode('kwitansi')}
          >
            Kwitansi Saja
          </button>
        </div>
      </div>

      {/* TOMBOL ACTION PREVIEW & PRINT */}
      <div className="nav-actions">
        <button type="button" className="btn-preview-toggle" onClick={onTogglePreview}>
          <Eye size={16} />
          <span>Live Preview A4</span>
        </button>
        <button type="button" className="btn-print-main" onClick={onPrint}>
          <Printer size={16} />
          Cetak / Export PDF
        </button>
      </div>
    </header>
  );
}