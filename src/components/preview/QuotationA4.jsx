import { formatDateIndonesia, formatRupiah } from '../../utils/formatters';
import capImg from '../../assets/cap.png';
import ttdImg from '../../assets/ttd.png';
import '../../styles/quotation.css';

export default function QuotationA4({ formData }) {
  const parseNum = (val) => {
    if (!val || val === '-') return 0;
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  };

  const getItemTotal = (item) => {
    const q = parseNum(item.qty) || 1;
    const p = parseNum(item.price);
    
    if (p > 0) return q * p;

    const subDetails = item.details || [];
    const subTotal = subDetails.reduce((sum, d) => {
      if (typeof d === 'object') {
        const subQty = parseNum(d.qty) || 1;
        const subPrice = parseNum(d.price);
        return sum + (subQty * subPrice);
      }
      return sum;
    }, 0);

    return subTotal;
  };

  const totalQuotation = (formData.items || []).reduce((acc, item) => {
    return acc + getItemTotal(item);
  }, 0);

  const showSign = formData.signOption === 'both' || formData.signOption === 'sign_only' || formData.signOption === 'sign';
  const showStamp = formData.signOption === 'both' || formData.signOption === 'stamp_only' || formData.signOption === 'stamp';

  return (
    <div 
      id="quotationSection" 
      className="a4-page quotation-page" 
      style={{ fontFamily: 'Tahoma, sans-serif', fontSize: '10pt', color: '#000' }}
    >
      {/* JUDUL QUOTATION PAS DI ATAS DENGAN SISA SPACE KANAN */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
        <div style={{ width: '270px', textAlign: 'center' }}>
          <strong 
            style={{ 
              fontSize: '14pt', 
              color: '#003399', 
              letterSpacing: '1px', 
              fontFamily: "'Trajan Pro', 'Trajan3', serif",
              fontWeight: 'bold'
            }}
          >
            QUOTATION
          </strong>
        </div>
      </div>

      {/* HEADER METADATA PRESISI 1:1 DENGAN SPACING SERAGAM */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        
        {/* KOLOM KIRI: TO, COMPANY, ADDRES, CONTACT, PHONE */}
        <div style={{ flex: '1', paddingRight: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10pt', fontFamily: 'Tahoma, sans-serif' }}>
            <tbody>
              {/* BARIS TO */}
              <tr>
                <td style={{ width: '85px', verticalAlign: 'top', padding: '2px 0' }}>To</td>
                <td style={{ width: '15px', verticalAlign: 'top', padding: '2px 0', textAlign: 'center' }}>:</td>
                <td style={{ verticalAlign: 'top', padding: '2px 0', fontWeight: 'bold' }}>
                  {formData.customerName}
                </td>
              </tr>

              {/* BARIS COMPANY & ADDRES DIPISAH AGAR SPACING SAMA PERSIS */}
              <tr>
                <td style={{ verticalAlign: 'top', padding: '2px 0' }}>Company</td>
                <td rowSpan={2} style={{ width: '15px', verticalAlign: 'top', padding: '2px 0', textAlign: 'center' }}>:</td>
                <td rowSpan={2} style={{ verticalAlign: 'top', padding: '2px 0' }}>{formData.address}</td>
              </tr>
              <tr>
                <td style={{ verticalAlign: 'top', padding: '2px 0' }}>Addres</td>
              </tr>

              {/* BARIS CONTACT & PHONE */}
              {formData.contact && (
                <tr>
                  <td style={{ verticalAlign: 'top', padding: '2px 0' }}>Contact</td>
                  <td style={{ verticalAlign: 'top', padding: '2px 0', textAlign: 'center' }}>:</td>
                  <td style={{ verticalAlign: 'top', padding: '2px 0', fontWeight: 'bold' }}>
                    {formData.contact}
                  </td>
                </tr>
              )}
              <tr>
                <td style={{ verticalAlign: 'top', padding: '2px 0' }}>Phone</td>
                <td style={{ verticalAlign: 'top', padding: '2px 0', textAlign: 'center' }}>:</td>
                <td style={{ verticalAlign: 'top', padding: '2px 0' }}>{formData.phone}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* KOLOM KANAN: FROM, NOMOR, TANGGAL */}
        <div style={{ width: '270px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10pt', fontFamily: 'Tahoma, sans-serif' }}>
            <tbody>
              <tr>
                <td style={{ width: '70px', verticalAlign: 'top', padding: '2px 0' }}>From</td>
                <td style={{ width: '15px', verticalAlign: 'top', padding: '2px 0', textAlign: 'center' }}>:</td>
                <td style={{ verticalAlign: 'top', padding: '2px 0' }}>
                  <strong style={{ color: '#003399', fontFamily: "'Bell MT', Georgia, serif", fontSize: '14pt' }}>
                    Zack Electric
                  </strong>
                </td>
              </tr>
              <tr>
                <td style={{ verticalAlign: 'top', padding: '2px 0' }}>Nomor</td>
                <td style={{ verticalAlign: 'top', padding: '2px 0', textAlign: 'center' }}>:</td>
                <td style={{ verticalAlign: 'top', padding: '2px 0' }}>{formData.docNo}</td>
              </tr>
              <tr>
                <td style={{ verticalAlign: 'top', padding: '2px 0' }}>Tanggal</td>
                <td style={{ verticalAlign: 'top', padding: '2px 0', textAlign: 'center' }}>:</td>
                <td style={{ verticalAlign: 'top', padding: '2px 0' }}>{formatDateIndonesia(formData.date)}</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      {/* KALIMAT PEMBUKA */}
      <div className="quotation-intro-text" style={{ marginTop: '12px', fontSize: '10pt', lineHeight: '1.5', fontFamily: 'Tahoma, sans-serif' }}>
        Dengan Hormat,<br />
        Bersama ini Kami berikan Penawaran harga {formData.quotationScope || formData.serviceTitle || 'Pekerjaan Listrik'}, dengan rincian Sebagai Berikut :
      </div>

      {/* TABEL PENAWARAN HARGA */}
      <table className="quotation-table" style={{ marginTop: '10px', width: '100%', fontFamily: 'Tahoma, sans-serif', fontSize: '10pt' }}>
        <thead>
          <tr>
            <th style={{ width: '5%' }}>No.</th>
            <th style={{ width: '48%' }}>Description / Keterangan</th>
            <th style={{ width: '14%' }}>QTY</th>
            <th style={{ width: '15%' }}>Harga satuan</th>
            <th style={{ width: '18%' }}>Jumlah</th>
          </tr>
        </thead>
        <tbody>
          {(formData.items || []).map((item, index) => {
            const q = parseNum(item.qty);
            const p = parseNum(item.price);
            const unitText = item.unit ?? '';
            const itemTotal = getItemTotal(item);

            return (
              <tr key={item.id || index}>
                <td style={{ textAlign: 'center', verticalAlign: 'top', paddingTop: '8px' }}>{index + 1}.</td>
                
                <td style={{ padding: '8px', verticalAlign: 'top' }}>
                  <div style={{ fontWeight: index === 0 ? 'bold' : 'normal', fontSize: '10pt' }}>
                    {item.desc}
                  </div>

                  {Array.isArray(item.details) && item.details.length > 0 && (
                    <div style={{ marginTop: '6px', paddingLeft: '20px' }}>
                      {item.details.map((d, dIdx) => (
                        <div
                          key={dIdx}
                          style={{
                            fontSize: '9.5pt',
                            lineHeight: '1.45',
                            minHeight: '20px',
                            marginBottom: '2px'
                          }}
                        >
                          {typeof d === 'object' ? d.name : d}
                        </div>
                      ))}
                    </div>
                  )}
                </td>

                <td style={{ padding: '8px', verticalAlign: 'top', textAlign: 'center' }}>
                  <div style={{ fontSize: '10pt', fontWeight: index === 0 ? 'bold' : 'normal' }}>
                    {q} {unitText}
                  </div>

                  {Array.isArray(item.details) && item.details.length > 0 && (
                    <div style={{ marginTop: '6px' }}>
                      {item.details.map((d, dIdx) => {
                        const qtyStr = typeof d === 'object' ? `${d.qty} ${d.unit}` : '';
                        return (
                          <div
                            key={dIdx}
                            style={{
                              fontSize: '9.5pt',
                              lineHeight: '1.45',
                              minHeight: '20px',
                              marginBottom: '2px',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {qtyStr}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </td>

                <td style={{ padding: '8px', textAlign: p > 0 ? 'right' : 'center', verticalAlign: 'top' }}>
                  <div style={{ fontSize: '10pt' }}>
                    {p > 0 ? (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Rp</span>
                        <span>{formatRupiah(p)}</span>
                      </div>
                    ) : (
                      '-'
                    )}
                  </div>

                  {item.showSubPrices && Array.isArray(item.details) && item.details.length > 0 && (
                    <div style={{ marginTop: '6px' }}>
                      {item.details.map((d, dIdx) => {
                        const subP = typeof d === 'object' ? parseNum(d.price) : 0;
                        return (
                          <div
                            key={dIdx}
                            style={{
                              fontSize: '9.5pt',
                              lineHeight: '1.45',
                              minHeight: '20px',
                              marginBottom: '2px',
                              textAlign: 'right'
                            }}
                          >
                            {subP > 0 ? `Rp ${formatRupiah(subP)}` : '-'}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </td>

                <td style={{ padding: '8px', textAlign: 'right', verticalAlign: 'top' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10pt' }}>
                    <span>Rp</span>
                    <span>{formatRupiah(itemTotal)}</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} style={{ border: 'none', background: 'transparent' }}></td>
            <td style={{ border: 'none', textAlign: 'right', paddingRight: '12px', fontWeight: 'bold' }}>
              Total
            </td>
            <td className="total-cell" style={{ textAlign: 'right', fontWeight: 'bold' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Rp</span>
                <span>{formatRupiah(totalQuotation)}</span>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>

      {/* KALIMAT PENUTUP */}
      <div className="quotation-outro-text" style={{ marginTop: '12px', fontSize: '10pt', lineHeight: '1.5', fontFamily: 'Tahoma, sans-serif' }}>
        Demikian penawaran ini kami buat, Jika ada keterangan yang kurang jelas Silakan menghubungi Kami ditelpon :<br />
        Mobile : 0817.7678.0680, atau dapat <i>emaile : zakaria040499@gmail.com</i> .<br />
        Atas perhatian dan kerjasamanya Kami sampaikan terima kasih.
      </div>

      {/* OTORISASI TANDA TANGAN */}
      <div className="quotation-signature-area" style={{ marginTop: '15px', fontFamily: 'Tahoma, sans-serif' }}>
        <div className="quotation-signature-box">
          Hormat Kami,<br />
          <strong className="quotation-sign-brand" style={{ fontFamily: "'Bell MT', Georgia, serif", fontSize: '14pt' }}>
            Zack Electric
          </strong>
          <div className="signature-space">
            {showStamp && <img src={capImg} className="img-stamp" alt="Cap Zack Electric" />}
            {showSign && <img src={ttdImg} className="img-sign" alt="Tanda Tangan Zakaria" />}
          </div>
          <strong className="quotation-sign-name" style={{ fontFamily: 'Tahoma, sans-serif', fontSize: '10pt' }}>Z a k a r i a</strong>
        </div>
        <div className="clear-fix"></div>
      </div>
    </div>
  );
}
