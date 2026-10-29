import { useRef, useState } from 'react';

export interface PromoCardData {
  id: string;
  title: string;
  image: string;
}

const CARD_STEP = 303; // 295px card + 8px gap

interface Props {
  cards: PromoCardData[];
  onDismiss: (id: string) => void;
}

export function PromoCarousel({ cards, onDismiss }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);

  if (cards.length === 0) return null;

  const handleScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
    const index = atEnd ? cards.length - 1 : Math.round(el.scrollLeft / CARD_STEP);
    setActive(Math.min(cards.length - 1, Math.max(0, index)));
  };

  // Touch scrolls natively; a mouse needs explicit drag handling.
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el || e.pointerType !== 'mouse' || e.button !== 0) return;
    const startX = e.clientX;
    const startScroll = el.scrollLeft;
    let moved = false;

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      if (!moved && Math.abs(dx) > 5) {
        moved = true;
        setDragging(true);
      }
      if (moved) el.scrollLeft = startScroll - dx;
    };
    const onClickCapture = (ev: MouseEvent) => {
      if (moved) ev.stopPropagation();
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      setDragging(false);
      if (moved) {
        el.scrollTo({ left: Math.round(el.scrollLeft / CARD_STEP) * CARD_STEP, behavior: 'smooth' });
        el.addEventListener('click', onClickCapture, { capture: true, once: true });
        setTimeout(() => el.removeEventListener('click', onClickCapture, true), 0);
      }
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  };

  return (
    <section className="carousel" aria-label="Tips">
      <div
        className={`carousel__track${dragging ? ' is-dragging' : ''}`}
        ref={trackRef}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
      >
        {cards.map((card) => (
          <article className="promo-card" key={card.id}>
            <img
              className="promo-card__image"
              src={card.image}
              alt={card.title}
              draggable={false}
            />
            <button
              type="button"
              className="promo-card__close"
              aria-label={`Dismiss ${card.title}`}
              onClick={() => onDismiss(card.id)}
            />
          </article>
        ))}
      </div>
      <div className="carousel__dots" aria-hidden="true">
        {cards.map((card, i) => (
          <span key={card.id} className={i === active ? 'is-active' : undefined} />
        ))}
      </div>
    </section>
  );
}
