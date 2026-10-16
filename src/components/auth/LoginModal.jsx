import { useState } from 'react';
import { supabase } from '../../config/supabase';
import { Lock } from 'lucide-react';

export default function LoginModal({ isOpen }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  if (!isOpen) return null;

  const handleSendMagicLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      setMessage({ text: 'Gagal mengirim link: ' + error.message, type: 'error' });
    } else {
      setMessage({
        text: 'Link masuk sudah dikirim ke email terdaftar. Silakan buka inbox email!',
        type: 'success',
      });
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" style={{ display: 'flex', zIndex: 9999, background: 'rgba(9, 13, 22, 0.95)', backdropFilter: 'blur(12px)' }}>
      <div className="modal-card" style={{ width: '400px', textAlign: 'center', padding: '28px' }}>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ width: '48px', height: '48px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
            <Lock size={24} />
          </div>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Akses Sistem Zack Electric</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
            Masukkan email terdaftar untuk menerima link akses instant tanpa password.
          </p>
        </div>

        <form onSubmit={handleSendMagicLink}>
          <div className="form-group" style={{ textAlign: 'left', marginBottom: '16px' }}>
            <label htmlFor="authEmail">Email Orang Tua</label>
            <input
              type="email"
              id="authEmail"
              placeholder="nama@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%' }}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary-finish" style={{ width: '100%', justifyContent: 'center', padding: '11px' }}>
            {loading ? 'Sending Link...' : 'Kirim Link Akses'}
          </button>
        </form>

        {message.text && (
          <div style={{ fontSize: '0.78rem', marginTop: '14px', color: message.type === 'error' ? '#ef4444' : '#10b981' }}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}