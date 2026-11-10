import '../offers.css';
import type { Offer } from '../data/offers';
import { OfferCard } from './OfferCard';
import { ArrowLeft } from './trips/icons';
import couponArt from '../assets/icons/coupon.svg';
import chevron from '../assets/icons/chevron.svg';

interface ButtonProps {
  count: number;
  onClick: () => void;
}

export function VouchersButton({ count, onClick }: ButtonProps) {
  return (
    <button type="button" className="vouchers-btn" onClick={onClick}>
      <img className="vouchers-btn__art" src={couponArt} alt="" width={60} height={46} draggable={false} />
      <span className="vouchers-btn__text">
        <span className="vouchers-btn__title">
          {count === 0 ? 'Unlock your first voucher' : count === 1 ? '1 voucher for you' : `${count} vouchers for you`}
        </span>
        <span className="vouchers-btn__sub">{count === 0 ? 'Shop at a Tax Free store to get one' : 'Save on your next purchase'}</span>
      </span>
      <img src={chevron} alt="" width={16} height={16} />
    </button>
  );
}

interface PageProps {
  offers: Offer[];
  onSelect: (offer: Offer) => void;
  onBack: () => void;
}

// Full page that covers the tab it was opened from.
export function VouchersPage({ offers, onSelect, onBack }: PageProps) {
  return (
    <div className="vouchers-clip">
      <main className="screen vouchers-page" aria-label="Vouchers">
      <div className="screen__content">
        <div className="page-head">
          <button type="button" className="icon-btn" aria-label="Back" onClick={onBack}>
            <ArrowLeft />
          </button>
          <div className="page-head__title">
            <h1>Vouchers</h1>
            <p>{offers.length === 0 ? 'None yet' : `${offers.length === 1 ? '1 voucher' : `${offers.length} vouchers`} available`}</p>
          </div>
        </div>
        {offers.length === 0 && (
          <p className="vouchers-empty">Shop at a Tax Free store and your vouchers will show up here.</p>
        )}
        <ul className="vouchers-list">
          {offers.map((offer) => (
            <li key={offer.id}>
              <OfferCard offer={offer} onOpen={onSelect} wide />
            </li>
          ))}
        </ul>
      </div>
      </main>
    </div>
  );
}
