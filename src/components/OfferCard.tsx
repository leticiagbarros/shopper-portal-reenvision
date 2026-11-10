import type { Offer } from '../data/offers';
import '../offers.css';

export const daysLabel = (days: number) => (days === 1 ? '1 day left' : `${days} days left`);

interface Props {
  offer: Offer;
  onOpen: (offer: Offer) => void;
  /** Fills the width of its container instead of the fixed carousel width. */
  wide?: boolean;
}

export function OfferCard({ offer, onOpen, wide = false }: Props) {
  return (
    <button type="button" className={`offer-card${wide ? ' offer-card--wide' : ''}`} onClick={() => onOpen(offer)}>
      <span className="offer-logo">
        <img src={offer.logo} alt="" draggable={false} />
      </span>
      <span className="offer-card__text">
        <span className={`offer-chip${offer.daysLeft <= 3 ? ' is-urgent' : ''}`}>{daysLabel(offer.daysLeft)}</span>
        <span className="offer-card__title">
          {offer.value} {offer.unit} at {offer.brand}
        </span>
        <span className="offer-card__desc">{offer.title}</span>
      </span>
    </button>
  );
}
