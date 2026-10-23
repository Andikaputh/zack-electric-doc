import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  FileText,
  Printer,
  X,
  FileSpreadsheet,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import InvoiceA4 from './InvoiceA4';
import KwitansiA4 from './KwitansiA4';
import QuotationA4 from './QuotationA4';
import PaperScale from './PaperScale';

const PAPER_HEIGHT_MM = {
  a4: 297,
  letter: 279.4,
  f4: 330,
};

export default function LivePreviewDrawer({ isOpen, onClose, formData, docMode, onPrint }) {
  const [paperSize, setPaperSize] = useState('a4'); // 'a4' | 'letter' | 'f4'
  const [zoom, setZoom] = useState(1); // 1 = seluruh halaman pas di layar
  const drawerBodyRef = useRef(null);
  const [fitScale, setFitScale] = useState(null);
  const [printScale, setPrintScale] = useState(1);

  // Satu skala dipakai untuk semua halaman supaya lebar kertas konsisten.
  const recalcPreviewScale = useCallback(() => {
    // Jangan hitung ulang saat mode print aktif: ukuran print sudah memakai
    // --print-scale yang dihitung dari tampilan layar.
    if (window.matchMedia('print').matches) return;

    const body = drawerBodyRef.current;
    if (!body) return;

    const papers = Array.from(body.querySelectorAll('.a4-page'));
    if (!papers.length) return;

    const maxPaperWidth = Math.max(...papers.map((paper) => paper.offsetWidth || 794));
    const maxPaperHeight = Math.max(...papers.map((paper) => paper.offsetHeight || 1123));
    const contentHeights = papers.map((paper) => {
      const paperStyle = window.getComputedStyle(paper);
      const paddingY =
        (parseFloat(paperStyle.paddingTop) || 0) +
        (parseFloat(paperStyle.paddingBottom) || 0);
      return Math.max(0, paper.offsetHeight - paddingY);
    });
    const maxContentHeight = Math.max(...contentHeights);
    const maxContentHeightMm = (maxContentHeight * 25.4) / 96;
    const availablePrintHeightMm = (PAPER_HEIGHT_MM[paperSize] || 297) - 20 - 4;
    const nextPrintScale =
      maxContentHeightMm > 0
        ? Math.min(1, availablePrintHeightMm / maxContentHeightMm)
        : 1;
    const bodyStyle = window.getComputedStyle(body);
    const paddingX =
      (parseFloat(bodyStyle.paddingLeft) || 0) +
      (parseFloat(bodyStyle.paddingRight) || 0);
    const paddingY =
      (parseFloat(bodyStyle.paddingTop) || 0) +
      (parseFloat(bodyStyle.paddingBottom) || 0);
    const availableWidth = body.clientWidth - paddingX - 8;
    const availableHeight = body.clientHeight - paddingY - 20;

    if (availableWidth <= 0 || availableHeight <= 0) return;

    const nextScale = Math.min(
      1,
      availableWidth / maxPaperWidth,
      availableHeight / maxPaperHeight,
    );

    setFitScale((current) => (Math.abs(current - nextScale) < 0.001 ? current : nextScale));
    setPrintScale((current) =>
      Math.abs(current - nextPrintScale) < 0.001 ? current : nextPrintScale,
    );
  }, [paperSize]);

  useLayoutEffect(() => {
    if (!isOpen) return undefined;

    const body = drawerBodyRef.current;
    if (!body) return undefined;

    const observer = new ResizeObserver(recalcPreviewScale);
    observer.observe(body);
    Array.from(body.querySelectorAll('.a4-page')).forEach((paper) => observer.observe(paper));

    // Hitung langsung saat mount supaya skala sudah benar walau tab sedang
    // tidak aktif (requestAnimationFrame bisa tertunda di background tab).
    recalcPreviewScale();

    const raf = requestAnimationFrame(recalcPreviewScale);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [isOpen, docMode, paperSize, formData, recalcPreviewScale]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Pastikan skala print sudah dihitung sebelum dialog cetak dibuka.
  const handlePrintDocument = () => {
    recalcPreviewScale();
    onPrint();
  };

  const zoomIn = () => setZoom((prev) => Math.min(3, Number((prev + 0.25).toFixed(2))));
  const zoomOut = () => setZoom((prev) => Math.max(1, Number((prev - 0.25).toFixed(2))));

  return (
    <aside className={`preview-drawer ${isOpen ? 'open' : ''}`} id="previewDrawer">
      <div className="drawer-header no-print">
        <div className="drawer-header-title">
          <FileText size={18} />
          <h3>Live Preview Hasil Dokumen</h3>
        </div>

        <div className="drawer-controls">
          {/* DROPDOWN PILIHAN UKURAN KERTAS */}
          <div className="paper-size-control">
            <FileSpreadsheet size={15} className="paper-size-icon" />
            <select
              value={paperSize}
              onChange={(e) => setPaperSize(e.target.value)}
              aria-label="Ukuran kertas"
              title="Pilih ukuran kertas"
            >
              <option value="a4">A4</option>
              <option value="letter">Letter</option>
              <option value="f4">F4 / Folio</option>
            </select>
          </div>

          {/* ZOOM PREVIEW */}
          <div className="zoom-control" role="group" aria-label="Zoom preview">
            <button
              type="button"
              onClick={zoomOut}
              disabled={zoom <= 1}
              aria-label="Perkecil preview"
              title="Perkecil preview"
            >
              <ZoomOut size={15} />
            </button>
            <button
              type="button"
              className="zoom-level"
              onClick={() => setZoom(1)}
              title="Kembalikan ke ukuran pas layar"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              type="button"
              onClick={zoomIn}
              disabled={zoom >= 3}
              aria-label="Perbesar preview"
              title="Perbesar preview"
            >
              <ZoomIn size={15} />
            </button>
          </div>

          <button
            type="button"
            className="btn-print-main drawer-print"
            onClick={handlePrintDocument}
            title="Cetak dokumen"
          >
            <Printer size={14} />
            <span>Cetak</span>
          </button>
        </div>

        <button
          type="button"
          className="btn-close-drawer"
          onClick={onClose}
          aria-label="Tutup preview"
          title="Tutup preview"
        >
          <X size={14} />
          <span>Tutup</span>
        </button>
      </div>

      {/* BODY PREVIEW DENGAN CLASS DINAMIS SESUAI UKURAN KERTAS */}
      <div
        ref={drawerBodyRef}
        className={`drawer-body print-area paper-${paperSize}`}
        data-paper-size={paperSize}
        style={{ '--print-scale': printScale }}
      >
        {docMode === 'quotation' && (
          <PaperScale zoom={zoom} fitScale={fitScale}>
            <QuotationA4 formData={formData} />
          </PaperScale>
        )}

        {(docMode === 'both' || docMode === 'invoice') && (
          <PaperScale zoom={zoom} fitScale={fitScale}>
            <InvoiceA4 formData={formData} />
          </PaperScale>
        )}

        {docMode === 'both' && <div className="page-break" />}

        {(docMode === 'both' || docMode === 'kwitansi') && (
          <PaperScale zoom={zoom} fitScale={fitScale}>
            <KwitansiA4 formData={formData} />
          </PaperScale>
        )}
      </div>
    </aside>
  );
}
