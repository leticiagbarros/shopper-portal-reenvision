import '../refund-details.css';
import { useState } from 'react';
import alertIcon from '../assets/refund-details/alert-warning.svg';
import mandatoryIcon from '../assets/refund-details/mandatory.svg';
import helpIcon from '../assets/refund-details/help.svg';
import chevronDown from '../assets/refund-details/chevron-down.svg';
import cardIcon from '../assets/refund-details/card.svg';
import chevronRight from '../assets/icons/chevron-right.svg';
import { formatRange } from '../data/places';
import { daysLeft, validationDeadline, type RefundForm } from '../data/guidance';
import { ArrowLeft, Check, Sparkle } from './trips/icons';
import { Barcode } from './Barcode';

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="rd-accordion">
      <summary>
        <span>{title}</span>
        <img src={chevronDown} alt="" width={16} height={16} />
      </summary>
      <div className="rd-accordion__body">{children}</div>
    </details>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="rd-row">
      <span className="rd-row__label">{label}</span>
      <span className="rd-row__value">{value}</span>
    </div>
  );
}

const FileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3.500" y="3.500" width="17" height="17" rx="2.500" stroke="#18181b" strokeWidth="2" />
    <path d="M7.500 9h9M7.500 12.500h9M7.500 16h5" stroke="#18181b" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

interface Props {
  form: RefundForm;
  /** Name of the stamped form the shopper uploaded in the guide, if any. */
  uploaded?: string;
  onBack: () => void;
  onOpenGuide: () => void;
}

export function RefundDetails({ form, uploaded, onBack, onOpenGuide }: Props) {
  const [showForm, setShowForm] = useState(false);
  const steps = uploaded ? 3 : 2;
  const left = daysLeft(form.purchaseDate);
  const deadline = validationDeadline(form.purchaseDate);

  return (
    <>
    <main className="screen" aria-label="Refund details">
      <div className="screen__content rd">
        <div className="page-head">
          <button type="button" className="icon-btn" aria-label="Back to My refunds" onClick={onBack}>
            <ArrowLeft />
          </button>
          <div className="page-head__title">
            <h1>Refund details</h1>
          </div>
        </div>

        <div className="rd-alert" role="alert">
          <img src={alertIcon} alt="" width={22} height={22} />
          <div>
            <p className="rd-alert__title">Finish the Planet Tax Free process within 21 days of receiving the refund</p>
            <p className="rd-alert__text">If not completed, the full refund and extra fees will be charged.</p>
          </div>
        </div>

        <section className="rd-status" aria-label="Get Customs approval">
          <div className={`rd-status__head${uploaded ? ' is-done' : ''}`}>
            {uploaded ? <Check /> : <img src={mandatoryIcon} alt="" width={16} height={16} />}
            <span>{uploaded ? 'Completed' : 'Mandatory'}</span>
          </div>

          <div className="rd-status__body">
            <div className="rd-progress">
              <div className="rd-progress__bars" aria-hidden="true">
                {[1, 2, 3].map((n) => (
                  <span key={n} className={n <= steps ? 'is-on' : undefined} />
                ))}
              </div>
              <span className="rd-progress__label">{steps}/3 steps</span>
            </div>

            <div className="rd-status__content">
              <div>
                <h2 className="rd-status__title">
                  Get Customs approval
                  <img src={helpIcon} alt="" width={20} height={20} />
                </h2>
                <p className="rd-status__text">Get your form approved by Customs before you leave the EU.</p>
              </div>

              <button type="button" className="rd-cta" onClick={onOpenGuide}>
                <span className="rd-cta__icon">
                  <Sparkle />
                </span>
                <span className="rd-cta__text">
                  <strong>Guide me through the next steps</strong>
                  <small>
                    {uploaded
                      ? `Stamped form uploaded: ${uploaded}`
                      : 'Where to go and what to bring, based on your trip'}
                  </small>
                </span>
                <img src={chevronRight} alt="" width={16} height={16} />
              </button>
            </div>
          </div>
        </section>

        <div className="rd-accordions">
          <Accordion title="Purchase details">
            <Row label="ID" value={form.purchaseId} />
            <Row label="Store" value={form.merchant} />
            <Row label="Location" value={form.address} />
            <Row label="Total amount" value={form.totalAmount} />
            <div className="rd-total">
              <span className="rd-row__label">Estimated refund</span>
              <span className="rd-total__value">
                <strong>{form.amount}</strong>
                <small>Fees may apply</small>
              </span>
            </div>
          </Accordion>

          <Accordion title="Refund details">
            <Row label="Paid on" value="Pending" />
            <Row label="Card number" value="No card added yet" />
          </Accordion>

          <Accordion title="Form details">
            <p className="rd-barcode-text">This barcode can be scanned at Customs and refund points</p>
            <Barcode base12={form.barcodeBase} />
            <Row label="Form number" value={form.formNumber} />
            <Row
              label="Customs approval deadline"
              value={`${formatRange(deadline, deadline)} (${left} days left)`}
            />
            <button type="button" className="rd-view-form" onClick={() => setShowForm(true)}>
              <FileIcon />
              <span>View form</span>
              <img src={chevronRight} alt="" width={16} height={16} />
            </button>
          </Accordion>
        </div>

        <button type="button" className="rd-add-card">
          <img src={cardIcon} alt="" width={22} height={22} />
          Add card for refund
        </button>
      </div>
    </main>

      {showForm && (
        <div className="qr-scrim" onClick={() => setShowForm(false)}>
          <div
            className="qr-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="form-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="form-title" className="qr-dialog__title">
              Tax Free form
            </h2>
            <p className="qr-dialog__text">
              {form.merchant} · {form.amount}. Show this barcode at Customs and refund points.
            </p>
            <Barcode base12={form.barcodeBase} large />
            <p className="qr-dialog__id">{form.formNumber}</p>
            <button type="button" className="btn-primary" onClick={() => setShowForm(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
