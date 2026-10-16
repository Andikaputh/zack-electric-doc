export default function StepperNav({ currentStep, setCurrentStep }) {
  const steps = [
    { num: 1, title: 'Pelanggan & Metadata', desc: 'Identitas nota & penomoran' },
    { num: 2, title: 'Rincian Barang / Jasa', desc: 'Daftar item & kalkulasi' },
    { num: 3, title: 'Pembayaran & Otorisasi', desc: 'DP, diskon & stempel TTD' },
  ];

  return (
    <div className="stepper-bar">
      {steps.map((step, index) => (
        <div key={step.num} style={{ display: 'contents' }}>
          <div
            className={`step-item ${currentStep === step.num ? 'active' : ''}`}
            onClick={() => setCurrentStep(step.num)}
          >
            <div className="step-num">{step.num}</div>
            <div className="step-info">
              <span className="step-title">{step.title}</span>
              <span className="step-desc">{step.desc}</span>
            </div>
          </div>
          {index < steps.length - 1 && <div className="step-connector"></div>}
        </div>
      ))}
    </div>
  );
}