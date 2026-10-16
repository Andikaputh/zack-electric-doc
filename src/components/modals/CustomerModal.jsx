import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Edit3, Save, UserCheck, PlusCircle } from 'lucide-react';
import { getCustomerDatabase, saveCustomerDatabase } from '../../utils/customerDb';

export default function CustomerModal({ isOpen, onClose, onSelectCustomer }) {
  const [customers, setCustomers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    id: '',
    name: '',
    code: '',
    address: '',
    phone: '',
    contact: '',
  });

  useEffect(() => {
    if (isOpen) {
      setCustomers(getCustomerDatabase());
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setEditingId(null);
    setForm({ id: '', name: '', code: '', address: '', phone: '', contact: '' });
  };

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name || !form.code) {
      alert('Nama Pelanggan dan Kode Singkatan wajib diisi!');
      return;
    }

    let updatedDb = [];
    if (editingId) {
      updatedDb = customers.map((c) => (c.id === editingId ? { ...form, id: editingId } : c));
    } else {
      const newId = form.code.toLowerCase().replace(/[^a-z0-9]/g, '') || `cust_${Date.now()}`;
      const newCust = { ...form, id: newId };
      updatedDb = [...customers, newCust];
    }

    saveCustomerDatabase(updatedDb);
    setCustomers(updatedDb);
    resetForm();
  };

  const handleEdit = (cust) => {
    setEditingId(cust.id);
    setForm(cust);
  };

  const handleDelete = (id) => {
    if (confirm('Yakin ingin menghapus template pelanggan ini?')) {
      const updatedDb = customers.filter((c) => c.id !== id);
      saveCustomerDatabase(updatedDb);
      setCustomers(updatedDb);
      if (editingId === id) resetForm();
    }
  };

  const handleSelectAndClose = (cust) => {
    if (onSelectCustomer) onSelectCustomer(cust);
    onClose();
  };

  return (
    <div className="modal-overlay" style={modalOverlayStyle}>
      <div className="modal-card" style={modalCardStyle}>
        <div className="modal-header" style={modalHeaderStyle}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Kelola Template Pelanggan</h3>
          <button type="button" onClick={onClose} style={closeBtnStyle}><X size={18} /></button>
        </div>

        <div className="modal-body" style={{ padding: '20px' }}>
          {/* FORM TAMBAH / EDIT TEMPLATE */}
          <form onSubmit={handleSave} style={{ marginBottom: '20px', background: '#111827', padding: '16px', borderRadius: '8px', border: '1px solid #374151' }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#3b82f6', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {editingId ? <Edit3 size={15} /> : <PlusCircle size={15} />}
              {editingId ? 'Edit Template Pelanggan' : 'Tambah Template Baru'}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <div>
                <label style={labelStyle}>Nama Perusahaan / Instansi *</label>
                <input
                  type="text"
                  placeholder="Misal: SDIA AL-AZHAR 20 Cibubur"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Kode Singkatan (Untuk No. Dokumen) *</label>
                <input
                  type="text"
                  placeholder="Misal: SDIA20"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  style={inputStyle}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <div>
                <label style={labelStyle}>Alamat Pelanggan</label>
                <input
                  type="text"
                  placeholder="Alamat lengkap..."
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>No. Telepon / Kontak</label>
                <input
                  type="text"
                  placeholder="021-xxxxxxxx"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Penanggung Jawab / PIC</label>
              <input
                type="text"
                placeholder="Nama Bapak/Ibu PIC..."
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                style={inputStyle}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              {editingId && (
                <button type="button" onClick={resetForm} style={btnSecondaryStyle}>Batal Edit</button>
              )}
              <button type="submit" style={btnPrimaryStyle}>
                {editingId ? <Save size={15} /> : <Plus size={15} />}
                {editingId ? 'Simpan Perubahan' : 'Tambah ke Database'}
              </button>
            </div>
          </form>

          {/* DAFTAR TEMPLATE PELANGGAN */}
          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.82rem', color: '#9ca3af', fontWeight: 600 }}>Daftar Preset Tersimpan:</h4>
          <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {customers.map((cust) => (
              <div key={cust.id} style={customerRowStyle}>
                <div>
                  <strong style={{ color: '#f9fafb', fontSize: '0.88rem' }}>{cust.name}</strong>
                  <span style={{ fontSize: '0.75rem', color: '#3b82f6', marginLeft: '8px', fontWeight: 'bold' }}>[{cust.code}]</span>
                  <div style={{ fontSize: '0.78rem', color: '#9ca3af' }}>{cust.address || 'Tanpa Alamat'}</div>
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <button type="button" onClick={() => handleSelectAndClose(cust)} style={btnUseStyle} title="Gunakan Template">
                    <UserCheck size={14} /> Pilih
                  </button>
                  <button type="button" onClick={() => handleEdit(cust)} style={btnIconStyle} title="Edit">
                    <Edit3 size={14} />
                  </button>
                  <button type="button" onClick={() => handleDelete(cust.id)} style={{ ...btnIconStyle, color: '#ef4444' }} title="Hapus">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const modalOverlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.75)', zIndex: 9999,
  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
};
const modalCardStyle = {
  background: '#1f2937', color: '#f9fafb', width: '100%', maxWidth: '650px',
  borderRadius: '12px', border: '1px solid #374151', overflow: 'hidden'
};
const modalHeaderStyle = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '14px 20px', borderBottom: '1px solid #374151', background: '#111827'
};
const closeBtnStyle = { background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' };
const labelStyle = { display: 'block', fontSize: '0.78rem', color: '#9ca3af', marginBottom: '4px' };
const inputStyle = { width: '100%', padding: '8px 10px', background: '#1f2937', border: '1px solid #374151', borderRadius: '6px', color: '#fff', fontSize: '0.85rem' };
const btnPrimaryStyle = { background: '#3b82f6', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '600' };
const btnSecondaryStyle = { background: '#374151', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem' };
const btnUseStyle = { background: '#10b981', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' };
const btnIconStyle = { background: '#374151', border: 'none', color: '#9ca3af', padding: '6px', borderRadius: '4px', cursor: 'pointer' };
const customerRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#111827', borderRadius: '6px', border: '1px solid #374151' };