const STEPS = [
  { num: 1, title: 'Pelanggan & Metadata', short: 'Pelanggan', desc: 'Identitas nota & penomoran' },
  { num: 2, title: 'Rincian Barang / Jasa', short: 'Rincian', desc: 'Daftar item & kalkulasi' },
  { num: 3, title: 'Pembayaran & Otorisasi', short: 'Pembayaran', desc: 'DP, diskon & stempel TTD' },
];

export default function StepperNav({ currentStep, setCurrentStep }) {
  return (
    <nav className="stepper-bar" aria-label="Langkah pengisian dokumen">
      {STEPS.map((step, index) => (
        <div key={step.num} className="step-slot">
          <button
            type="button"
            className={`step-item ${currentStep === step.num ? 'active' : ''}`}
            onClick={() => setCurrentStep(step.num)}
            aria-current={currentStep === step.num ? 'step' : undefined}
            aria-label={`Langkah ${step.num}: ${step.title}`}
          >
            <span className="step-num">{step.num}</span>
            <span className="step-info">
              <span className="step-title">
                <span className="step-title-full">{step.title}</span>
                <span className="step-title-short">{step.short}</span>
              </span>
              <span className="step-desc">{step.desc}</span>
            </span>
          </button>
          {index < STEPS.length - 1 && <span className="step-connector" aria-hidden="true" />}
        </div>
      ))}
    </nav>
  );
}
