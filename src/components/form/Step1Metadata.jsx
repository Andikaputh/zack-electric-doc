import { useEffect, useState } from 'react';
import { User, Settings } from 'lucide-react';
import { getCustomerDatabase } from '../../utils/customerDb';
import { generateFullInvoiceNumber } from '../../utils/invoiceNumber';

export default function Step1Metadata({ formData, setFormData, onNext, onOpenModal }) {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const db = getCustomerDatabase();
    setCustomers(db);
  }, [formData.customerId]);

  const applyCustomerData = (targetCust) => {
    if (!targetCust) return;
    const fullNo = generateFullInvoiceNumber(formData.docSeq, targetCust.id, formData.date);
    setFormData((prev) => ({
      ...prev,
      customerId: targetCust.id,
      customerName: targetCust.name,
      clientCode: targetCust.code,
      address: targetCust.address || '',
      phone: targetCust.phone || '',
      contact: targetCust.contact || '',
      docNo: fullNo,
    }));
  };

  const handleSelectCustomer = (e) => {
    const custId = e.target.value;

    if (custId === '__ADD_NEW__') {
      if (onOpenModal) onOpenModal();
      return;
    }

    const targetCust = customers.find((c) => c.id === custId);
    if (targetCust) {
      applyCustomerData(targetCust);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      const newSeq = field === 'docSeq' ? value : prev.docSeq;
      const newDate = field === 'date' ? value : prev.date;
      const fullNo = generateFullInvoiceNumber(newSeq, prev.customerId, newDate);
      return { ...updated, docNo: fullNo };
    });
  };

  return (
    <div className="card-panel">
      <div className="card-header">
        <div className="card-header-title">
          <User size={18} />
          <h3>Informasi Pelanggan & Metadata Dokumen</h3>
        </div>
        <button type="button" className="btn-text-action" onClick={onOpenModal} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Settings size={14} /> Kelola Template Pelanggan
        </button>
      </div>

      <div className="card-body">
        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="inCustomerSelect">Nama Perusahaan / Pelanggan (Preset)</label>
            <select
              id="inCustomerSelect"
              value={formData.customerId || ''}
              onChange={handleSelectCustomer}
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
              <option value="__ADD_NEW__">+ Tambah / Kelola Template Pelanggan...</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="inContact">Contact Person / PIC</label>
            <input
              type="text"
              id="inContact"
              placeholder="Nama penanggung jawab"
              value={formData.contact}
              onChange={(e) => handleChange('contact', e.target.value)}
            />
          </div>
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="inAddress">Alamat Pelanggan</label>
            <input
              type="text"
              id="inAddress"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="inPhone">No. Telepon / Kontak</label>
            <input
              type="text"
              id="inPhone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>
        </div>

        {/* FIELD BARU: JASA YANG DITAWARKAN (UNTUK NAMA FILE OUTPUT PDF) */}
        <div className="form-group" style={{ marginTop: '10px' }}>
          <label htmlFor="inServiceTitle" style={{ fontWeight: 'bold', color: '#3b82f6' }}>
            Jasa / Pekerjaan yang Ditawarkan (Penamaan File PDF)
          </label>
          <input
            type="text"
            id="inServiceTitle"
            placeholder="Contoh: Perbaikan CCTV / Pergantian Panel Listrik"
            value={formData.serviceTitle || ''}
            onChange={(e) => handleChange('serviceTitle', e.target.value)}
          />
        </div>

        <hr className="divider" />

        <div className="form-grid-3">
          <div className="form-group">
            <label htmlFor="inInvoiceSeq">Urutan No. Dokumen</label>
            <input
              type="number"
              id="inInvoiceSeq"
              value={formData.docSeq}
              onChange={(e) => handleChange('docSeq', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="inNo">Nomor Dokumen Generated</label>
            <input type="text" id="inNo" readOnly className="input-readonly" value={formData.docNo} />
          </div>
          <div className="form-group">
            <label htmlFor="inDatePicker">Tanggal Penerbitan</label>
            <input
              type="date"
              id="inDatePicker"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="inCity">Kota Lokasi Tanda Tangan</label>
          <input
            type="text"
            id="inCity"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
          />
        </div>
      </div>

      <div className="card-footer">
        <button type="button" className="btn-step-nav next" onClick={onNext}>
          Lanjut: Rincian Barang →
        </button>
      </div>
    </div>
  );
}