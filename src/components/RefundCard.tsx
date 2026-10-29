export interface RefundCardData {
  id: string;
  image: string;
  alt: string;
}

export function RefundCard({ data, onOpen }: { data: RefundCardData; onOpen?: () => void }) {
  return (
    <button type="button" className="refund-card" onClick={onOpen}>
      <img className="refund-card__image" src={data.image} alt={data.alt} draggable={false} />
    </button>
  );
}
