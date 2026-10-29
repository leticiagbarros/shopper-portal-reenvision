import chevron from '../assets/icons/chevron-right.svg';

interface Props {
  merchant: string;
  amount: string;
  onOpen: () => void;
}

// Coded twin of the "Get Customs approval" card design, for forms without an exported SVG.
export function FormCard({ merchant, amount, onOpen }: Props) {
  return (
    <button type="button" className="form-card" onClick={onOpen}>
      <span className="form-card__tab">Get Customs approval</span>
      <span className="form-card__body">
        <span className="form-card__merchant">{merchant}</span>
        <span className="form-card__row">
          <span className="form-card__label">Estimated refund</span>
          <span className="form-card__value">
            <span className="form-card__amount">{amount}</span>
            <span className="form-card__fees">Fees may apply</span>
          </span>
        </span>
      </span>
      <img className="form-card__chevron" src={chevron} alt="" width={16} height={16} />
    </button>
  );
}
