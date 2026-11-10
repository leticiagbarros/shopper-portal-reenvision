import '../empty-panel.css';
import receiptArt from '../assets/icons/receipt-scroll.svg';

interface Props {
  title: string;
  text: string;
  action: string;
  onAction: () => void;
}

// Empty state: a receipt illustration, a message and one action.
export function EmptyPanel({ title, text, action, onAction }: Props) {
  return (
    <section className="empty-panel" aria-labelledby="empty-panel-title">
      <img className="empty-panel__art" src={receiptArt} alt="" width={104} height={117} draggable={false} />
      <h2 id="empty-panel-title" className="empty-panel__title">
        {title}
      </h2>
      <p className="empty-panel__text">{text}</p>
      <button type="button" className="empty-panel__cta" onClick={onAction}>
        {action}
      </button>
    </section>
  );
}
