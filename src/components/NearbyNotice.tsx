import { useEffect, useRef, useState } from 'react';
import '../nearby.css';

const SHOW_MS = 7000;
const LEAVE_MS = 320;

interface Props {
  /** Called after the banner has finished leaving; `open` is true when the shopper tapped it. */
  onClose: (open: boolean) => void;
}

// Prototype only: simulates an iOS push banner for a Tax Free store the shopper walks past.
export function NearbyNotice({ onClose }: Props) {
  const [leaving, setLeaving] = useState(false);
  const timers = useRef<number[]>([]);

  const leave = (open: boolean) => {
    setLeaving(true);
    timers.current.push(window.setTimeout(() => onClose(open), LEAVE_MS));
  };

  useEffect(() => {
    const id = window.setTimeout(() => leave(false), SHOW_MS);
    timers.current.push(id);
    return () => timers.current.forEach(window.clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`nearby${leaving ? ' is-leaving' : ''}`} role="status">
      <button type="button" className="nearby__card" onClick={() => !leaving && leave(true)}>
        <span className="nearby__icon" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 8h14l-1 12H6L5 8Z" />
            <path d="M9 8V7a3 3 0 0 1 6 0v1" />
          </svg>
        </span>
        <span className="nearby__text">
          <span className="nearby__title">Gucci is nearby</span>
          <span className="nearby__body">You just passed a Tax Free store. Shop here and get your VAT back.</span>
        </span>
        <span className="nearby__time">now</span>
      </button>
    </div>
  );
}
