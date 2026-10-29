import chevronLight from '../assets/icons/chevron-light.svg';
import { FORMS } from '../data/guidance';
import { Sparkle } from './trips/icons';

const toNumber = (amount: string) => Number.parseFloat(amount.replace(/\./g, '').replace(',', '.'));

export function SummaryCard({ onOpenGuide }: { onOpenGuide: () => void }) {
  const total = FORMS.reduce((sum, f) => sum + toNumber(f.amount), 0);

  return (
    <button type="button" className="summary-card" onClick={onOpenGuide}>
      <span className="summary-card__text">
        <span className="summary-card__headline">{FORMS.length} Tax Free ready for refund</span>
        <span className="summary-card__line">
          <span className="summary-card__amount">{total.toFixed(2)} EUR</span>
          <span className="summary-card__label">Estimated refund</span>
        </span>
      </span>
      <span className="summary-card__guide">
        <Sparkle />
        <span>Guide me through the next steps</span>
        <img src={chevronLight} alt="" width={16} height={16} />
      </span>
    </button>
  );
}
