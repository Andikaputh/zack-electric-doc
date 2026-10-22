import { useState, useEffect } from 'react';
import { supabase } from './config/supabase';
import LoginModal from './components/auth/LoginModal';
import Navbar from './components/ui/Navbar';
import StepperNav from './components/form/StepperNav';
import Step1Metadata from './components/form/Step1Metadata';
import Step2Items from './components/form/Step2Items';
import Step3Payment from './components/form/Step3Payment';
import LivePreviewDrawer from './components/preview/LivePreviewDrawer';
import CustomerModal from './components/modals/CustomerModal';
import { getCustomerDatabase } from './utils/customerDb';
import { generateFullInvoiceNumber } from './utils/invoiceNumber';

export default function App() {
  const [session, setSession] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [docMode, setDocMode] = useState('both'); // 'both' | 'invoice' | 'kwitansi' | 'quotation'
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  const db = getCustomerDatabase();
  const defaultCust = db[0] || {
    id: 'sdia20',
    name: 'SDIA AL-AZHAR 20 Cibubur',
    code: 'SDIA20',
    address: 'Jln. H. Abdul Rahman No. 9 Cibubur - Jakarta Timur',
    phone: '02187712666',
    contact: '',
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    customerId: defaultCust.id,
    customerName: defaultCust.name,
    clientCode: defaultCust.code,
    address: defaultCust.address,
    phone: defaultCust.phone,
    contact: defaultCust.contact || '',
    serviceTitle: 'Pergantian dan Peremajaan Panel Listrik Utama',
    quotationScope: 'Pengadaan Dan Pemasangan Kabel Tufur Lt 1 Dan Lt 2 Di Gedung SMAI Al Azhar 19 Ciracas',
    docSeq: 1473,
    date: todayStr,
    docNo: generateFullInvoiceNumber('1473', defaultCust.id, todayStr),
    city: 'Jakarta',
    items: [
      {
        id: 1,
        category: 'equipment',
        desc: 'PANEL MDP 197.000 VA',
        qty: 1,
        unit: 'Set',
        price: 0, // Dibuat 0 agar 'Harga Satuan' dirender '-' (strip)
        totalPrice: 26500000,
        details: [
          { name: 'MCCB3P-36KA 175 / NSX-250 (TM250D)', qty: 1, unit: 'Buah' },
          { name: 'MCCB3P-36KA 87.5-125A / TM125D CVS 160F', qty: 3, unit: 'Buah' },
          { name: 'MCCB3P-36KA 70-100 / TM100D CVS 100F', qty: 3, unit: 'Buah' },
          { name: 'DIGITAL METER LR-3D3Y', qty: 1, unit: 'Buah' },
          { name: 'CT 250/5A (5 VA )', qty: 3, unit: 'Buah' },
          { name: 'PILOT LAMP (LED)', qty: 3, unit: 'Buah' },
          { name: 'FUSE CONTROL - 4A', qty: 6, unit: 'Buah' },
          { name: 'BUSBAR R S T (CU)', qty: 1, unit: 'Lot' },
          { name: 'BOX - WALL MOUNTING Type ( Flat 1,5 mm )', qty: 1, unit: 'Unit' },
          { name: 'WIRING & ACCESSORIS', qty: 1, unit: 'Lot' },
        ],
      },
      {
        id: 2,
        category: 'equipment',
        desc: 'Kabel Tufur NYY 4 x 95mm',
        qty: 3,
        unit: 'Meter',
        price: 850000,
        totalPrice: 25500000,
        details: [],
      },
      {
        id: 3,
        category: 'jasa',
        desc: 'Jasa Pekerjaan Bongkar Panel Lama Dan Pemasangan Main Panel Listrik Baru, Rubah Konekan Panel',
        qty: 1,
        unit: 'Lot',
        price: 5000000,
        details: [],
      },
      {
        id: 4,
        category: 'jasa',
        desc: 'Material Bantu, Perapihan, Setting dan Comisioning',
        qty: 1,
        unit: 'Is',
        price: 1500000,
        details: [],
      },
    ],
    paymentType: 'dp',
    discount: 0,
    dp: 10000000,
    settlementAmount: 0,
    forPayment: 'Pekerjaan Pergantian dan Peremajaan Panel Listrik Masjid Riyadhul Jannah SDI AL Azhar 20 Cibubur',
    bankInfo: 'Pembayaran ditujukan ke Rek. BCA A/N Zakaria 6281035573',
    signOption: 'both',
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handlePrint = () => {
    setIsPreviewOpen(true);

    const year = formData.date ? formData.date.split('-')[0] : new Date().getFullYear();
    const seq = formData.docSeq || '0000';
    const service = formData.serviceTitle || 'Pekerjaan Listrik';
    const customer = formData.customerName || 'Customer';

    let docTypePrefix = 'INV';
    if (docMode === 'kwitansi') {
      docTypePrefix = 'Kwitansi';
    } else if (docMode === 'quotation') {
      docTypePrefix = 'Quotation';
    } else if (docMode === 'both') {
      docTypePrefix = 'Dokumen Lampiran';
    }

    const dynamicPdfName = `${docTypePrefix} ${seq} ${service} ${customer} ${year}`.replace(/[\\/:*?"<>|]/g, '');

    const originalTitle = document.title;
    document.title = dynamicPdfName;

    setTimeout(() => {
      window.print();
      setTimeout(() => {
        document.title = originalTitle;
      }, 1000);
    }, 150);
  };

  const handleSelectCustomerFromModal = (cust) => {
    const fullNo = generateFullInvoiceNumber(formData.docSeq, cust.id, formData.date);
    setFormData((prev) => ({
      ...prev,
      customerId: cust.id,
      customerName: cust.name,
      clientCode: cust.code,
      address: cust.address || '',
      phone: cust.phone || '',
      contact: cust.contact || '',
      docNo: fullNo,
    }));
  };

  return (
    <div className="app-container">
      <LoginModal isOpen={!session} />

      {session && (
        <>
          <Navbar
            docMode={docMode}
            setDocMode={setDocMode}
            onTogglePreview={() => setIsPreviewOpen(!isPreviewOpen)}
            onPrint={handlePrint}
          />

          <main className="workspace-area no-print">
            <StepperNav currentStep={currentStep} setCurrentStep={setCurrentStep} />

            {currentStep === 1 && (
              <Step1Metadata
                formData={formData}
                setFormData={setFormData}
                onNext={() => setCurrentStep(2)}
                onOpenModal={() => setIsCustomerModalOpen(true)}
              />
            )}

            {currentStep === 2 && (
              <Step2Items
                formData={formData}
                setFormData={setFormData}
                onNext={() => setCurrentStep(3)}
                onPrev={() => setCurrentStep(1)}
              />
            )}

            {currentStep === 3 && (
              <Step3Payment
                formData={formData}
                setFormData={setFormData}
                onPrev={() => setCurrentStep(2)}
                onTogglePreview={() => setIsPreviewOpen(true)}
              />
            )}
          </main>

          <LivePreviewDrawer
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
            formData={formData}
            docMode={docMode}
            onPrint={handlePrint}
          />

          <CustomerModal
            isOpen={isCustomerModalOpen}
            onClose={() => setIsCustomerModalOpen(false)}
            onSelectCustomer={handleSelectCustomerFromModal}
          />
        </>
      )}
    </div>
  );
}