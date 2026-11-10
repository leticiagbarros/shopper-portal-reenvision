import { useEffect, useRef, useState } from 'react';
import '../offers.css';
import type { Offer } from '../data/offers';
import { Barcode } from './Barcode';
import { Check } from './trips/icons';
import { daysLabel } from './OfferCard';

interface Props {
  offer: Offer;
  onClose: () => void;
}

// Prototype: a real voucher would be issued and marked as used by the merchant.
export function OfferSheet({ offer, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const copy = () => {
    navigator.clipboard?.writeText(offer.code).then(
      () => setCopied(true),
      () => undefined,
    );
  };

  return (
    <div className="offer-scrim" onClick={onClose}>
      <div
        className="offer-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="offer-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="offer-sheet__hero">
          <button ref={closeRef} type="button" className="offer-sheet__close" aria-label="Close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
          <span className="offer-logo offer-logo--large">
            <img src={offer.logo} alt={offer.brand} draggable={false} />
          </span>
          <h2 id="offer-title" className="offer-sheet__title">
            {offer.value} {offer.unit} at {offer.brand}
          </h2>
          <p className="offer-sheet__desc">{offer.title}</p>
          <div className="offer-sheet__chips">
            <span className="offer-chip">{offer.reason}</span>
            <span className={`offer-chip${offer.daysLeft <= 3 ? ' is-urgent' : ''}`}>{daysLabel(offer.daysLeft)}</span>
          </div>
        </div>

        <div className="offer-sheet__body">
<div className="offer-code">
            <Barcode base12={offer.barcode} />
            <p className="offer-code__text">{offer.code}</p>
          </div>

          <button type="button" className={`offer-sheet__action${copied ? ' is-done' : ''}`} onClick={copy}>
            {copied && <Check />}
            {copied ? 'Code copied' : 'Copy code'}
          </button>

          <ul className="offer-sheet__terms">
            {offer.terms.map((term) => (
              <li key={term}>{term}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
