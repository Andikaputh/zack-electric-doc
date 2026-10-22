import { Eye, Printer } from 'lucide-react';

const DOC_MODES = [
  { value: 'both', label: 'Invoice & Kwitansi', short: 'Invoice + Kwitansi' },
  { value: 'quotation', label: 'Quotation (Penawaran)', short: 'Quotation' },
  { value: 'invoice', label: 'Invoice Saja', short: 'Invoice' },
  { value: 'kwitansi', label: 'Kwitansi Saja', short: 'Kwitansi' },
];

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
        <div className="btn-group-pill" role="group" aria-label="Pilih format dokumen">
          {DOC_MODES.map((mode) => (
            <button
              key={mode.value}
              type="button"
              className={`pill-btn ${docMode === mode.value ? 'active' : ''}`}
              onClick={() => setDocMode(mode.value)}
              aria-pressed={docMode === mode.value}
              title={mode.label}
            >
              <span className="pill-label-full">{mode.label}</span>
              <span className="pill-label-short">{mode.short}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TOMBOL ACTION PREVIEW & PRINT */}
      <div className="nav-actions">
        <button
          type="button"
          className="btn-preview-toggle"
          onClick={onTogglePreview}
          title="Buka live preview A4"
          aria-label="Buka live preview A4"
        >
          <Eye size={16} />
          <span>Live Preview A4</span>
        </button>
        <button
          type="button"
          className="btn-print-main"
          onClick={onPrint}
          title="Cetak atau export PDF"
          aria-label="Cetak atau export PDF"
        >
          <Printer size={16} />
          <span>Cetak / Export PDF</span>
        </button>
      </div>
    </header>
  );
}
