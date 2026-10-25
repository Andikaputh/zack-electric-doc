import { formatDateIndonesia, formatRupiah } from '../../utils/formatters';
import { terbilang } from '../../utils/terbilang';
import logoImg from '../../assets/logo.png';
import capImg from '../../assets/cap.png';
import ttdImg from '../../assets/ttd.png';

export default function InvoiceA4({ formData }) {
  // Helper Sanitasi Input Angka
  const parseNum = (val) => {
    if (!val || val === '-') return 0;
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  };

  // HELPER MENGHITUNG TOTAL HARGA PER ITEM SECARA PRESISI
  const getItemTotal = (item) => {
    const q = parseNum(item.qty) || 1;
    const p = parseNum(item.price);

    if (p > 0) {
      return q * p;
    }

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

  // 1. Kalkulasi Subtotal Kotor
  const subtotal = (formData.items || []).reduce(
    (acc, item) => acc + getItemTotal(item),
    0
  );

  // 2. Potong Diskon -> Grand Total Tagihan Bersih
  const discount = parseNum(formData.discount);
  const grandTotal = Math.max(0, subtotal - discount);

  // 3. Evaluasi Apakah Menggunakan DP
  const isFullPayment = formData.paymentType === 'full';
  const dp = isFullPayment ? 0 : parseNum(formData.dp);
  const sisa = Math.max(0, grandTotal - dp);

  // 4. Terbilang Invoice
  const nominalTerbilang = (!isFullPayment && dp > 0) ? (sisa > 0 ? sisa : dp) : grandTotal;
  const teksTerbilang = nominalTerbilang > 0 ? `${terbilang(nominalTerbilang)} Rupiah` : 'Nol Rupiah';

  // Otorisasi TTD & Cap
  const showSign = formData.signOption === 'both' || formData.signOption === 'sign_only' || formData.signOption === 'sign';
  const showStamp = formData.signOption === 'both' || formData.signOption === 'stamp_only' || formData.signOption === 'stamp';

  // HIERARKI 3 LEVEL:
  // Heading 1 = kategori (EQUIPMENT / JASA) -> kolom kanan sengaja dibiarkan kosong
  // Heading 2 = item barang/jasa (baris bernomor seperti biasa)
  // Subheading = rincian sub-komponen di bawah Heading 2
  const CATEGORY_LABELS = { equipment: 'EQUIPMENT', jasa: 'JASA' };
  const CATEGORY_ORDER = ['equipment', 'jasa'];
  const normalizeCategory = (val) =>
    String(val || '').toLowerCase() === 'jasa' ? 'jasa' : 'equipment';

  // Urutan section dibuat sama dengan urutan section di form.
  const itemSections = CATEGORY_ORDER
    .map((key) => ({
      key,
      label: CATEGORY_LABELS[key],
      items: (formData.items || []).filter(
        (item) => normalizeCategory(item.category) === key
      ),
    }))
    .filter((section) => section.items.length > 0);

  let rowNumber = 0;

  return (
    <div id="invoiceSection" className="a4-page">
      {/* HEADER KOP SURAT INVOICE */}
      <table className="header-table">
        <tbody>
          <tr>
            <td className="header-logo">
              <img src={logoImg} alt="Logo ZE" style={{ maxWidth: '75px', height: 'auto' }} />
            </td>
            <td className="header-info">
              <strong>Provide by:</strong><br />
              Procurement of goods and services<br />
              Mechanical and Electrical Engineers<br />
              Security System: CCTV, Alarm Control,...<br />
              Electrical Building, PANEL, Sound System,...<br />
              PABX Telephone, Network,...
            </td>
            <td className="header-contact">
              Jln. Suralaya No. 99 A<br />
              Rt. 004 Rw. 004 Cilangkap<br />
              Cipayung, Jakarta Timur 13870<br />
              Phone : 0817.7678.0680 / 0812.8557.6568<br />
              E-mail : zack_electric4499@gmail.com
            </td>
          </tr>
        </tbody>
      </table>

      <div className="brand-title">ZACK ELECTRIC</div>
      <div className="blue-line"></div>

      {/* METADATA INVOICE SEJAJAR PRESISI */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', margin: '15px 0' }}>
        
        {/* KOLOM KIRI: COMPANY, ADDRESS, PHONE, CONTACT */}
        <div style={{ flex: '1', paddingRight: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <tbody>
              <tr>
                <td style={{ width: '80px', verticalAlign: 'top', padding: '2px 0' }}>Company</td>
                <td style={{ width: '15px', verticalAlign: 'top', padding: '2px 0', textAlign: 'center' }}>:</td>
                <td style={{ verticalAlign: 'top', padding: '2px 0', fontWeight: 'bold' }}>{formData.customerName}</td>
              </tr>
              <tr>
                <td style={{ verticalAlign: 'top', padding: '2px 0' }}>Address</td>
                <td style={{ verticalAlign: 'top', padding: '2px 0', textAlign: 'center' }}>:</td>
                <td style={{ verticalAlign: 'top', padding: '2px 0' }}>{formData.address}</td>
              </tr>
              <tr>
                <td style={{ verticalAlign: 'top', padding: '2px 0' }}>Phone</td>
                <td style={{ verticalAlign: 'top', padding: '2px 0', textAlign: 'center' }}>:</td>
                <td style={{ verticalAlign: 'top', padding: '2px 0', }}>{formData.phone}</td>
              </tr>
              {formData.contact && (
                <tr>
                  <td style={{ verticalAlign: 'top', padding: '2px 0' }}>Contact</td>
                  <td style={{ verticalAlign: 'top', padding: '2px 0', textAlign: 'center' }}>:</td>
                  <td style={{ verticalAlign: 'top', padding: '2px 0', fontWeight: 'bold' }}>{formData.contact}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* KOLOM KANAN: FROM, NOMOR, TANGGAL */}
        <div style={{ width: '270px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <tbody>
              <tr>
                <td style={{ width: '70px', verticalAlign: 'top', padding: '2px 0' }}>From</td>
                <td style={{ width: '15px', verticalAlign: 'top', padding: '2px 0', textAlign: 'center' }}>:</td>
                <td style={{ verticalAlign: 'top', padding: '2px 0', fontWeight: 'bold' }}>Zack Electric</td>
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

      <div className="doc-title">INVOICE</div>

      {/* TABEL ITEM / JASA DENGAN DUKUNGAN SUB-KOMPONEN */}
      <table className="invoice-table">
        <thead>
          <tr>
            <th style={{ width: '5%' }}>No.</th>
            <th style={{ width: '48%' }}>Description / Keterangan</th>
            <th style={{ width: '14%' }}>QTY</th>
            <th style={{ width: '15%' }}>Harga satuan</th>
            <th style={{ width: '18%' }}>Jumlah</th>
          </tr>
        </thead>
        {itemSections.map((section) => (
          <tbody key={section.key}>
            {/* HEADING 1: KATEGORI (EQUIPMENT / JASA) — FULL WIDTH, HANYA BORDER KIRI & KANAN */}
            <tr className="invoice-category-row">
              <td colSpan={5}>{section.label}</td>
            </tr>

            {/* HEADING 2: ITEM BARANG / JASA */}
            {section.items.map((item) => {
              rowNumber += 1;
              const q = parseNum(item.qty);
              const p = parseNum(item.price);
              const unitText = item.unit ?? '';
              const itemTotal = getItemTotal(item);

              return (
                <tr key={item.id}>
                  {/* KOLOM NO */}
                  <td style={{ textAlign: 'center', verticalAlign: 'top', paddingTop: '8px' }}>
                    {rowNumber}.
                  </td>

                  {/* KOLOM DESCRIPTION / KETERANGAN */}
                  <td style={{ padding: '8px', verticalAlign: 'top' }}>
                    <div style={{ fontSize: '0.88rem' }}>
                      {item.desc}
                    </div>

                    {/* SUBHEADING: RINCIAN SUB-KOMPONEN */}
                    {Array.isArray(item.details) && item.details.length > 0 && (
                      <div style={{ marginTop: '6px', paddingLeft: '20px' }}>
                        {item.details.map((d, dIdx) => (
                          <div
                            key={dIdx}
                            style={{
                              fontSize: '0.82rem',
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

                  {/* KOLOM QTY */}
                  <td style={{ padding: '8px', verticalAlign: 'top', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.88rem' }}>
                      {q} {unitText}
                    </div>

                    {/* QTY SUB-KOMPONEN SEJAJAR PRESISI */}
                    {Array.isArray(item.details) && item.details.length > 0 && (
                      <div style={{ marginTop: '6px' }}>
                        {item.details.map((d, dIdx) => {
                          const qtyStr = typeof d === 'object' ? `${d.qty} ${d.unit}` : '';
                          return (
                            <div
                              key={dIdx}
                              style={{
                                fontSize: '0.82rem',
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

                  {/* KOLOM HARGA SATUAN */}
                  <td style={{ padding: '8px', textAlign: p > 0 ? 'right' : 'center', verticalAlign: 'top' }}>
                    <div style={{ fontSize: '0.88rem' }}>
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
                                fontSize: '0.82rem',
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

                  {/* KOLOM JUMLAH */}
                  <td style={{ padding: '8px', textAlign: 'right', verticalAlign: 'top' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                      <span>Rp</span>
                      <span>{formatRupiah(itemTotal)}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        ))}
        <tfoot style={{ fontWeight: 'bold' }}>
          {/* SKENARIO 1: FULL PAYMENT */}
          {(isFullPayment || (discount === 0 && dp === 0)) && (
            <>
              {discount > 0 && (
                <>
                  <tr>
                    <td colSpan={3} className="no-border-cell"></td>
                    <td className="text-right">JUMLAH</td>
                    <td>
                      <span className="currency-prefix">Rp</span>
                      <span className="currency-val">{formatRupiah(subtotal)}</span>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="no-border-cell"></td>
                    <td className="text-right">DISCOUNT</td>
                    <td>
                      <span className="currency-prefix">Rp</span>
                      <span className="currency-val">({formatRupiah(discount)})</span>
                    </td>
                  </tr>
                </>
              )}
              <tr>
                <td colSpan={3} className="no-border-cell"></td>
                <td className="text-right">TOTAL</td>
                <td>
                  <span className="currency-prefix">Rp</span>
                  <span className="currency-val">{formatRupiah(grandTotal)}</span>
                </td>
              </tr>
            </>
          )}

          {/* SKENARIO 2: SKEMA DP / PELUNASAN SISA */}
          {!isFullPayment && dp > 0 && (
            <>
              <tr>
                <td colSpan={3} className="no-border-cell"></td>
                <td className="text-right">JUMLAH</td>
                <td>
                  <span className="currency-prefix">Rp</span>
                  <span className="currency-val">{formatRupiah(subtotal)}</span>
                </td>
              </tr>

              {discount > 0 && (
                <tr>
                  <td colSpan={3} className="no-border-cell"></td>
                  <td className="text-right">DISCOUNT</td>
                  <td>
                    <span className="currency-prefix">Rp</span>
                    <span className="currency-val">({formatRupiah(discount)})</span>
                  </td>
                </tr>
              )}

              <tr>
                <td colSpan={3} className="no-border-cell"></td>
                <td className="text-right">TOTAL</td>
                <td>
                  <span className="currency-prefix">Rp</span>
                  <span className="currency-val">{formatRupiah(grandTotal)}</span>
                </td>
              </tr>

              <tr>
                <td colSpan={3} className="no-border-cell"></td>
                <td className="text-right">UANG MUKA (DP)</td>
                <td>
                  <span className="currency-prefix">Rp</span>
                  <span className="currency-val">{formatRupiah(dp)}</span>
                </td>
              </tr>

              <tr>
                <td colSpan={3} className="no-border-cell"></td>
                <td className="text-right">SISA PEMBAYARAN</td>
                <td>
                  <span className="currency-prefix">Rp</span>
                  <span className="currency-val">{formatRupiah(sisa)}</span>
                </td>
              </tr>
            </>
          )}
        </tfoot>
      </table>

      {/* TERBILANG BOX */}
      <div className="terbilang-box"># Terbilang : {teksTerbilang} #</div>

      {/* REKENING & TANDA TANGAN */}
      <div style={{ marginTop: '10px' }}>
        <div className="signature-box">
          Hormat Kami,<br /><strong>Zack Electric</strong>
          <div className="signature-space">
            {showStamp && <img src={capImg} className="img-stamp" alt="Cap Zack Electric" />}
            {showSign && <img src={ttdImg} className="img-sign" alt="Tanda Tangan Zakaria" />}
          </div>
          <strong>Z A K A R I A</strong>
        </div>
        <div className="clear-fix"></div>
      </div>
    </div>
  );
}
