import { useEffect, useRef, useState } from 'react';
import '../toast.css';

const SHOW_MS = 3500;
const LEAVE_MS = 240;

// Short confirmation that fades out on its own; the message is announced to screen readers.
export function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  const [leaving, setLeaving] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    timers.current.push(window.setTimeout(() => setLeaving(true), SHOW_MS));
    timers.current.push(window.setTimeout(onClose, SHOW_MS + LEAVE_MS));
    return () => timers.current.forEach(window.clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`toast${leaving ? ' is-leaving' : ''}`} role="status">
      <span className="toast__icon" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m5 12.5 4.5 4.5L19 7.5" />
        </svg>
      </span>
      {message}
    </div>
  );
}
