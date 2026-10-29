import { useEffect } from 'react';
import type { Reminder } from '../../data/places';
import { Bell } from './icons';

interface Props {
  country: string;
  onSave: (reminder: Reminder) => void;
  onSkip: () => void;
}

export function ReminderDialog({ country, onSave, onSkip }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onSkip();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onSkip]);

  return (
    <div className="dialog-scrim" onClick={onSkip}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reminder-title"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="dialog__icon">
          <Bell />
        </span>
        <h2 id="reminder-title" className="dialog__title">
          Remind me when I arrive?
        </h2>
        <p className="dialog__text">
          When you land in {country}, we will send you your saved Tax Free stores so you do not miss a refund.
        </p>

        <button type="button" className="btn-primary" onClick={() => onSave({ onArrival: true })}>
          Remind me
        </button>
        <button type="button" className="dialog__skip" onClick={onSkip}>
          Not now
        </button>
      </div>
    </div>
  );
}
