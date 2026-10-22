import { Package, Plus, Trash2, ListPlus, X, Calculator, Eye, EyeOff } from 'lucide-react';
import { formatNumberWithDots, parseFormattedNumber } from '../../utils/formatters';

// Heading 1 di invoice = kategori. Urutan section di form dibuat sama dengan urutan di invoice.
const CATEGORY_SECTIONS = [
  { key: 'equipment', label: 'Equipment' },
  { key: 'jasa', label: 'Jasa' },
];

const normalizeCategory = (val) =>
  String(val || '').toLowerCase() === 'jasa' ? 'jasa' : 'equipment';

export default function Step2Items({ formData, setFormData, onNext, onPrev }) {
  const handleItemChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addItemRow = (category = 'equipment') => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { id: Date.now(), category, desc: '', qty: 1, unit: 'Pcs', price: 0, showSubPrices: false, details: [] },
      ],
    }));
  };

  const removeItemRow = (id) => {
    if (formData.items.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  // HANDLER SUB-ITEM BREAKDOWN
  const addSubDetail = (itemId) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id === itemId) {
          const currentDetails = item.details || [];
          const updatedDetails = [
            ...currentDetails,
            { name: '', qty: 1, unit: 'Buah', price: 0 },
          ];
          return { ...item, details: updatedDetails };
        }
        return item;
      }),
    }));
  };

  const handleSubDetailChange = (itemId, index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id === itemId) {
          const updatedDetails = (item.details || []).map((d, idx) => {
            if (idx === index) {
              const detailObj = typeof d === 'string' ? { name: d, qty: 1, unit: 'Buah', price: 0 } : { ...d };
              return { ...detailObj, [field]: value };
            }
            return d;
          });

          // Hitung ulang total jika sub-item punya harga
          const hasSubPrices = updatedDetails.some((d) => (Number(d.price) || 0) > 0);
          let newTotalPrice = item.totalPrice;
          let newPrice = item.price;

          if (hasSubPrices) {
            newTotalPrice = updatedDetails.reduce((sum, d) => sum + ((Number(d.qty) || 1) * (Number(d.price) || 0)), 0);
            newPrice = 0; // Set 0 agar harga satuan utama muncul '-'
          }

          return { ...item, details: updatedDetails, totalPrice: newTotalPrice, price: newPrice };
        }
        return item;
      }),
    }));
  };

  const removeSubDetail = (itemId, index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id === itemId) {
          const updatedDetails = (item.details || []).filter((_, idx) => idx !== index);
          return { ...item, details: updatedDetails };
        }
        return item;
      }),
    }));
  };

  const renderItemRow = (item) => {
    const subDetails = item.details || [];
    const hasSubPrices = subDetails.some((d) => typeof d === 'object' && (Number(d.price) || 0) > 0);

    return (
      <tr key={item.id} style={{ verticalAlign: 'top' }}>
        <td>
          {/* KATEGORI / HEADING 1 — BISA DIPINDAH ANTAR SECTION */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '6px',
            }}
          >
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: '600',
                letterSpacing: '0.4px',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                whiteSpace: 'nowrap',
              }}
            >
              Kategori
            </span>
            <select
              value={item.category || 'equipment'}
              onChange={(e) => handleItemChange(item.id, 'category', e.target.value)}
              style={{
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer',
                width: 'auto',
              }}
            >
              <option value="equipment">Equipment</option>
              <option value="jasa">Jasa</option>
            </select>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
              (Heading 1)
            </span>
          </div>

          <textarea
            rows={2}
            placeholder="Nama barang / jasa & spesifikasi utama..."
            value={item.desc}
            onChange={(e) => handleItemChange(item.id, 'desc', e.target.value)}
          />

          {/* SUBHEADING / RINCIAN SUB-KOMPONEN */}
          <div style={{ marginTop: '8px', paddingLeft: '8px', borderLeft: '2px solid #3b82f6' }}>
            {subDetails.map((d, dIdx) => {
              const detailObj = typeof d === 'string' ? { name: d, qty: 1, unit: 'Buah', price: 0 } : d;

              return (
                <div key={dIdx} style={{ display: 'flex', gap: '6px', marginBottom: '6px', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Nama sub-komponen..."
                    value={detailObj.name || ''}
                    onChange={(e) => handleSubDetailChange(item.id, dIdx, 'name', e.target.value)}
                    style={{ flex: 2, fontSize: '0.8rem', padding: '4px 8px' }}
                  />
                  <input
                    type="number"
                    placeholder="QTY"
                    min={1}
                    value={detailObj.qty || 1}
                    onChange={(e) => handleSubDetailChange(item.id, dIdx, 'qty', Number(e.target.value))}
                    style={{ width: '50px', fontSize: '0.8rem', padding: '4px 6px' }}
                  />
                  <input
                    type="text"
                    placeholder="Satuan"
                    value={detailObj.unit || 'Buah'}
                    onChange={(e) => handleSubDetailChange(item.id, dIdx, 'unit', e.target.value)}
                    style={{ width: '65px', fontSize: '0.8rem', padding: '4px 6px' }}
                  />

                  {/* INPUT HARGA SUB DENGAN FORMATTER TITIK */}
                  <input
                    type="text"
                    placeholder="Harga Sub (Rp)"
                    value={formatNumberWithDots(detailObj.price)}
                    onChange={(e) => {
                      const rawNum = parseFormattedNumber(e.target.value);
                      handleSubDetailChange(item.id, dIdx, 'price', rawNum);
                    }}
                    style={{ width: '110px', fontSize: '0.8rem', padding: '4px 6px' }}
                  />
                  <button
                    type="button"
                    onClick={() => removeSubDetail(item.id, dIdx)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => addSubDetail(item.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#3b82f6',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: '600'
                }}
              >
                <ListPlus size={14} /> + Tambah Subheading (Sub-Komponen)
              </button>

              {hasSubPrices && (
                <label style={{ fontSize: '0.75rem', color: '#3b82f6', display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={!!item.showSubPrices}
                    onChange={(e) => handleItemChange(item.id, 'showSubPrices', e.target.checked)}
                  />
                  {item.showSubPrices ? <Eye size={13} /> : <EyeOff size={13} />}
                  {item.showSubPrices ? 'Tampilkan Harga Sub di PDF' : 'Sembunyikan Harga Sub di PDF'}
                </label>
              )}
            </div>
          </div>
        </td>

        <td>
          <input
            type="number"
            min={1}
            value={item.qty}
            onChange={(e) => handleItemChange(item.id, 'qty', Number(e.target.value))}
          />
        </td>

        <td>
          <input
            type="text"
            placeholder="Meter/Lot/Set/Buah"
            value={item.unit || 'Pcs'}
            onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
          />
        </td>

        {/* INPUT HARGA SATUAN UTAMA DENGAN FORMATTER TITIK */}
        <td>
          <input
            type="text"
            disabled={hasSubPrices}
            placeholder={hasSubPrices ? 'Hitung Otomatis Sub' : '0'}
            value={hasSubPrices ? '' : formatNumberWithDots(item.price)}
            onChange={(e) => {
              const rawNum = parseFormattedNumber(e.target.value);
              handleItemChange(item.id, 'price', rawNum);
            }}
            style={hasSubPrices ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
          />
          {hasSubPrices && (
            <div style={{ fontSize: '0.72rem', color: '#10b981', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Calculator size={12} /> Auto-sum Sub-item
            </div>
          )}
        </td>

        <td style={{ textAlign: 'center' }}>
          <button
            type="button"
            className="btn-danger-icon"
            onClick={() => removeItemRow(item.id)}
            disabled={formData.items.length === 1}
          >
            <Trash2 size={16} />
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div className="card-panel">
      <div className="card-header">
        <div className="card-header-title">
          <Package size={18} />
          <h3>Rincian Barang, Material & Satuan Pekerjaan</h3>
        </div>
      </div>

      <div className="card-body">
        {/* PENJELASAN HIERARKI */}
        <div className="item-hierarchy-hint">
          <span><b>Heading 1</b> = Kategori Equipment / Jasa</span>
          <span><b>Heading 2</b> = Item barang / jasa</span>
          <span><b>Subheading</b> = Sub-komponen</span>
        </div>

        <div className="table-wrapper-large">
          <table className="item-table-input">
            <thead>
              <tr>
                <th style={{ width: '42%' }}>DESKRIPSI SPESIFIKASI BARANG / JASA</th>
                <th style={{ width: '12%' }}>QTY</th>
                <th style={{ width: '14%' }}>SATUAN</th>
                <th style={{ width: '22%' }}>HARGA SATUAN (RP)</th>
                <th style={{ width: '10%', textAlign: 'center' }}>HAPUS</th>
              </tr>
            </thead>

            {CATEGORY_SECTIONS.map((section) => {
              const sectionItems = formData.items.filter(
                (item) => normalizeCategory(item.category) === section.key
              );

              return (
                <tbody key={section.key}>
                  {/* HEADING 1 DI FORM */}
                  <tr className={`item-section-row ${section.key}`}>
                    <td colSpan={5}>
                      <div className="item-section-title">
                        <span className="item-section-badge">Heading 1</span>
                        <strong>{section.label.toUpperCase()}</strong>
                        <span className="item-section-count">
                          {sectionItems.length} item
                        </span>
                      </div>
                    </td>
                  </tr>

                  {/* HEADING 2 + SUBHEADING */}
                  {sectionItems.map((item) => renderItemRow(item))}

                  <tr>
                    <td colSpan={5} className="item-section-add-cell">
                      <button
                        type="button"
                        className="btn-add-inline"
                        onClick={() => addItemRow(section.key)}
                      >
                        <Plus size={13} /> Tambah Item {section.label}
                      </button>
                      {sectionItems.length === 0 && (
                        <span className="item-section-empty">
                          Belum ada item {section.label.toLowerCase()}.
                        </span>
                      )}
                    </td>
                  </tr>
                </tbody>
              );
            })}
          </table>
        </div>
      </div>

      <div className="card-footer space-between">
        <button type="button" className="btn-step-nav prev" onClick={onPrev}>
          ← Kembali
        </button>
        <button type="button" className="btn-step-nav next" onClick={onNext}>
          Lanjut: Pembayaran & TTD →
        </button>
      </div>
    </div>
  );
}
